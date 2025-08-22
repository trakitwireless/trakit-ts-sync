import { RepSelfGet } from "@commands/Accounts/Self/Responses/RepSelfGet";
import { Reply } from "@commands/API/Responses/Reply";
import { CLEAR_TIMER, JSON_STRINGIFY, SET_TIMER } from "@objects/API/Constants";
import { ulong } from "@objects/API/Types";
import { SyncBase } from "common/SyncBase";
import { SyncDispose } from "common/SyncDispose";
import { SyncInit } from "common/SyncInit";
import { SyncKraken } from "common/SyncKraken";
import { SyncMessage } from "common/SyncMessage";
import { SyncMindflayer } from "common/SyncMindflayer";
import { SyncSubscriptions } from "common/SyncSubscriptions";
import { SyncType } from "common/SyncType";
import { SubscribedRegions } from "./Socket/SubscribedRegions";
import { CMD_CONNECTION, CMD_DISCONNECTION, TrakitSocket } from "./Socket/TrakitSocket";
import { TrakitSocketStatus } from "./Socket/TrakitSocketStatus";

/**
 * The amount of time (in milliseconds) to wait between intervals checking for expired subscriptions.
 **/
const TIMEOUT_SUBSCRIPTION = 10 * 1000;	// 10 seconds

/**
 * This is the class which does the work in the background {@link Worker} for the {@link SyncClient}.
 * It handles synchronizing regions, maintaining a connection to Kraken, and send HTTP requests to Mindflayer.
 * This class also maintains a queue of up-going messages.
 **/
export class SyncWorker {
    /**
     * All active subscriptions per company.
     **/
    #subscriptions: Map<number, SubscribedRegions> = new Map;
    
    /**
     * Callback used to clear expired subscriptions from the dictionary.
     * Also resets the timer after sending unsubscribe Promise to Kraken is resolved.
     **/
    #subscriptionExpirer() {
        const expirations: Promise<Reply>[] = [];
        if (this.#tws.state === TrakitSocketStatus.open) {
            this.#subscriptions.forEach((subscribed, company) => {
                const expired = subscribed.expiredRegions(true);
                if (expired.length) expirations.push(this.#subscribe(false, company, expired));
            });
        }
        Promise.allSettled(expirations).finally(() => {
            this.#subscriptionTimer = SET_TIMER(
                () => this.#subscriptionExpirer(),
                TIMEOUT_SUBSCRIPTION
            );
        });
    }
    /**
     * Handle for the auto-remove expired subscription types.
     **/
    #subscriptionTimer: number = 0;

    /**
     * The Kraken main connection.
     **/
    #tws!: TrakitSocket;

    /**
     * Disconnects Kraken then sends a message to the {@link SyncClient} about it, and dies.
     * Does not terminate the {@link Worker}.
     **/
    dispose() {
        const action = (response: Reply) => {
            var msg = new SyncDispose();
            msg.response = response;
            self.postMessage(msg);
            this.#tws.dispose();
            (this.#tws as TrakitSocket | null) = null;
        };
        this.#tws.close().then(action, action);
    }
    /**
     * Handles the "connection" event from Kraken.
     * This will update the global {@link SESSION_ID}, sends a {@link SyncMessage} to the {@link SyncClient},
     * and re-subscribe to any regions that were subscribed to before the disconnection occured.
     * Also restarts the subscription expirer.
     * @param selfDetails 
     */
    #onOpen(selfDetails: RepSelfGet) {
        self.postMessage(new SyncMessage(CMD_CONNECTION, selfDetails));
        this.#subscriptions.forEach((subscribed, company) => {
            // remove all regions from in-sync list; ALL OF THEM.
            // but, re-sync to the ones that were not going to expire
            // this will also auto-get lists of objects
            this.sync(new SyncSubscriptions(
                true,
                company,
                subscribed.reset()
            ));
        });
        // start expired subscription timer
        this.#subscriptionExpirer();
    }
    /**
     * Handles the "disconnection" event from Kraken.
     * Stops the subscription expirer (it is restarted on re-connection).
     * Also sends a {@link SyncMessage} to the {@link SyncClient}.
     * @param msg 
     **/
    #onClose(msg: Reply) {
        self.postMessage(new SyncMessage(CMD_DISCONNECTION, msg));
        // stop trying to remove expired subscriptions
        CLEAR_TIMER(this.#subscriptionTimer);
        this.#subscriptionTimer = 0;
    }
    /**
     * Handles message events from Kraken.
     * For login and session-details related messages, will set the global {@link SESSION_ID},
     * (Kraken handles this to set its own {@link KrakenSocket#ghostId}).
     * Also sends a {@link SyncMessage} to the {@link SyncClient}.
     * @param kind 
     * @param content 
     **/
    #onMessage(kind: string, content: any) {
        switch (kind) {
            //case "connectionResponse": => won't fire because connectionResponse triggers the "connection" event instead
            case "loginResponse":
            case "getSessionDetailsResponse":
                break;
            case "subscribeResponse":
            case "unsubscribeResponse":
                // check kind and update subscriptions based on if it is a (un)subscribeResponse message
                // instead of doing it in the Promise resolver within {@link SyncWorker#sync}.
                // this may not work because we don't know the temporary sync regions
                break;
        }
        self.postMessage(new SyncMessage(kind, content));
    }
    /**
     * Handles the "error" event from Kraken.
     * All this does is relay the event as a {@link SyncMessage} to the {@link SyncClient}.
     * @param error 
     **/
    #onError(error: Reply) {
        self.postMessage(new SyncMessage("error", error));
    }

    /**
     * Sends a (un)subscribe command to Kraken for the given company and regions.
     **/
    #subscribe(add: boolean, company: ulong, regions: string[]) {
        return this.#tws.send(
            add
                ? "subscribe"
                : "unsubscribe",
            {
                "company": {
                    "id": company,
                },
                "subscriptionTypes": regions,
            },
            SyncKraken_DEFAULT_RETRIES
        );
    }
    /**
     * Returns (and creates a reference if needed) the subscriptions for the given company.
     * @param company
     **/
    #currentSubscriptions(company: ulong) {
        let subs = this.#subscriptions.get(company);
        if (!subs) this.#subscriptions.set(company, subs = new SubscribedRegions)
        return subs;
    }

    /**
     * When invoked, it means the main {@link Window} is ready to control this worker.
     * @param msg
     **/
    init(msg: SyncInit) {
        this.#tws = new TrakitSocket(msg.socket, msg.ghostId);
        this.#tws.onOpen = (msg) => this.#onOpen(msg);
        this.#tws.onClose = (msg) => this.#onClose(msg);
        this.#tws.onMessage = (msg, data) => this.#onMessage(msg, data);
        this.#tws.onError = (msg) => this.#onError(msg);
        const action = (response: Reply) => {
            msg.response = response;
            self.postMessage(msg);
        };
        this.#tws.open().then(action, action);
    }
    /**
     * Immediately posts the current {@link Worker} state and variables, ignoring the queue and going "right now".
     * @param msg
     **/
    variables(msg: SyncBase) {
        self.postMessage({
            "id": (msg || {}).id || null,
            "v": [trakit_fleetfreedom.version, ns.version/*, DATABASE_VERSION*/],
            "kind": SyncType.variables,
            "kraken": {
                "ghostId": this.#tws.ghostId,
                "state": this.#tws.state,
                "ready": this.#tws.ready,
                "reconnectEnabled": this.#tws.reconnectEnabled,
                "keepAliveEnabled": this.#tws.keepAliveEnabled,
                "lastReceived": this.#tws.lastReceived,
                "lastMessageName": this.#tws.lastMessageName,
            },
            "subscriptions": this.#subscriptions.toObject(function (subscribed, company) {
                var current = [],
                    expiring = [];
                subscribed.__regions.forEach(function (expiry, region) {
                    (expiry ? expiring : current).push(region);
                });
                return {
                    "company": company,
                    "current": current,
                    "expiring": expiring,
                };
            }),
        });
    }
    /**
     * Begins synchronizing the given regions.
     * If all regions are in-sync, will resolve immediately with the arrays of content.  (How do I do that?)
     * @param msg
     **/
    sync(msg: SyncSubscriptions) {
        const subscribed = this.#currentSubscriptions(msg.company),
            alreadySubscribed = subscribed.regions,
            requestedSubscriptions = msg.subs.map((region) => {
                return SUBSCRIPTION_SPLITS[region] || [region];
            }).reduce((acc, val) => acc.concat(val), []),
            temporarySubscriptions = OBJECT_EACH(
                SUBSCRIPTION_LIST_BY_COMPANY,
                function ( url, sub) {
                    // here we find any subscription types that were not requested, but will be filled based on the fact that they are coming in too, regardless of if they were asked.
                    // example is subscribe to assetGeneral, but listing assets also gives assetAdvanced, so we create a subscription for assetAdvanced too
                    // but the assetAdvanced must be temporary since we didn't ask for it
                    // it can expire using the regular expiration timeout
                    return this.includes(url)
                        ? sub
                        : "";
                },
                requestedSubscriptions.map((sub) => {
                    // for mindflayer requests that will also pull up other regions (assets => assetGeneral/assetAdvanced)
                    // build a list of all URL templates for every subscription type being requested
                    return SUBSCRIPTION_LIST_BY_COMPANY[sub] || "";
                })
            )
                .remove("")
                .unique()
                .without(requestedSubscriptions),
            newSubscriptions = requestedSubscriptions.concat(temporarySubscriptions)
                .without(alreadySubscribed);
        (newSubscriptions.length
            // if there are new subscriptions to make, do so and when the Promise is resolved pass the response (normal KraknSocket behaviour)
            ? this.#subscribe(true, msg.company, newSubscriptions)
            // otherwise, return a fulfilled Promise with a response of no "merged", and errorCode=0
            : Promise.resolve({
                "errorCode": 0,
                "company": { "id": msg.company },
                "merged": [],
            })
        ).then(
            // subscriptions succeeded (at least partially)
            function (response) {
                // remove expiration from any new subscriptions
                subscribed.removeExpiries(requestedSubscriptions.without(temporarySubscriptions));
                // once subscriptions are made, set the expiry of the temporary ones
                subscribed.addExpiries(temporarySubscriptions);
                // now load all the data
                return Promise.allSettled(
                    response["merged"]
                        .map(function (sub) {
                            return SUBSCRIPTION_LIST_BY_COMPANY[sub] || "";
                        })
                        .unique()
                        .remove("")
                        .map(function (url) {
                            // method and body are null (defaults to GET and null)
                            // callback is used because it is invoked before the Promise is resolved (fulfilled or rejected)
                            // which adds the reply message to the Window-bound queue before the full sync-response Promise
                            return XHR_MINDFLAYER(url.replace("{companyId}", msg.company), null, null, function (response) {
                                OBJECT_EACH(SUBSCRIPTION_LIST_BY_COMPANY, function (value, region) {
                                    // for each URL, we find the associated regions, or return blank string
                                    return value === url
                                        ? region
                                        : "";
                                })
                                    // blanks are removed
                                    .remove("")
                                    // since Mindflayer is not providing region lists in all cases (for complex types)
                                    // we find out if this region is a member of a complex type, and return that type name instead
                                    .map(function (region) {
                                        var sub = "";
                                        OBJECT_EACH(SUBSCRIPTION_SPLITS, function (splits, key) {
                                            if (splits.includes(region)) sub = key;
                                        });
                                        // if not a complex type, return region name
                                        return sub || region;
                                    })
                                    // this does result in duplicates ie; assetGeneral => asset, assetAdvanced => asset, assetDispatch => asset
                                    // so it's important to make this list unique in the end
                                    .unique()
                                    .forEach(function (sub) {
                                        self.postMessage(new SyncMessage(
                                            /*
                                            (
                                                sub.endsWith("y")
                                                    ? sub.slice(0, -1) + "ie"
                                                    : sub
                                            ) + "sMerged",
                                            */
                                            sub + "List",
                                            response
                                        ));
                                    });
                            });
                        })
                ).then(function (results) {
                    var responses = [response].concat(results.map(function (result) {
                        return result["value"] || result["reason"];
                    }));
                    msg.response = {
                        "errorCode": responses.gather("errorCode").distinct()[0] || 0,
                        "message": responses.gather("message").join(", ") || "No operations",
                        "responses": responses,
                    };
                    self.postMessage(msg);
                });
            },
            // subscriptions failed???
            function (response) {
                msg.response = response;
                self.postMessage(msg);
            }
        );
    }
    /**
     * Begins removing regions from synchronization.
     * The process is not immediate, but will start a timeout.
     * This allows the service to re-request sync on a region within a few seconds (or minutes, haven't decided), like when switching sections.
     * @param msg
     **/
    desync(msg: SyncSubscriptions) {
        const subscribed = this.#currentSubscriptions(msg.company),
            regions = msg.subs.map((region) => SUBSCRIPTION_SPLITS[region] || [region])
                .reduce((acc, val) => acc.concat(val), [])
                .without(subscribed.expiringRegions())
        subscribed.addExpiries(regions);
        // does not send "unsubscribe" to Kraken, this is done in the {@link SyncWorker#subscriptionTimer} process.
        msg.response = {
            "errorCode": 0,
            "message": "Regions added to unsubscribe timeout",
            "regions": regions,
        };
        self.postMessage(msg);
    }
    /**
     * Sends an XHR to Mindflayer, and when a response is returned (or timeout occurs, or JSON parsing error occurs),
     * the response is added to the message and add to the queue to go back to the main {@link Window}.
     * @param msg
     **/
    mindflayer(msg: SyncMindflayer) {
        // if the socket is not open, we would miss sync events
        // so if the socket is not open, we should open it and then send the mindflayer command
        // but we also don't need to worry about that for GET requests; which are got getting an object or a list of them

        const action = (response: Reply) => {
            msg.response = response;
            self.postMessage(msg);
        }



        return msg.method === "GET" || this.#tws.state === TrakitSocketStatus.open
            ? XHR_MINDFLAYER(
                msg.path,
                msg.method,
                msg.body
                    ? msg.body instanceof FormData
                        ? msg.body
                        : JSON_STRINGIFY(msg.body)
                    : null
            ).then(action, action)
            : this.#tws.open().finally(() => this.mindflayer(msg));
    }
    /**
     * Sends a command to Kraken, and when a response is returned (or timeout occurs),
     * the response is added to the message and add to the queue to go back to the main {@link Window}.
     * @param msg
     **/
    kraken(msg: SyncKraken) {
        const action = (response: Reply) => {
            msg.response = response;
            self.postMessage(msg);
        };
        this.#tws.send(msg.name, msg.body).then(action, action);
    }
}