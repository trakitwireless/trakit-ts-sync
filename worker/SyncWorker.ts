import { RepSelfGet } from "@commands/Accounts/Self/Responses/RepSelfGet";
import { Reply } from "@commands/API/Responses/Reply";
import { PaySubscriptionMerge } from "@commands/WebSocket/Requests/PaySubscriptionMerge";
import { RepSubscription } from "@commands/WebSocket/Responses/RepSubscription";
import { CLEAR_TIMER, JSON_STRINGIFY, SET_TIMER } from "@objects/API/Constants";
import { ulong } from "@objects/API/Types";
import { SUBSCRIPTION_LIST_BY_COMPANY, SUBSCRIPTION_SPLITS } from "common/Subscriptions";
import { SubscriptionType } from "common/SubscriptionType";
import { SyncDispose } from "common/SyncDispose";
import { SyncInit } from "common/SyncInit";
import { SyncMessage } from "common/SyncMessage";
import { SyncRestful } from "common/SyncRestful";
import { SyncSocket } from "common/SyncSocket";
import { SyncStatus } from "common/SyncStatus";
import { SyncSubscriptions } from "common/SyncSubscriptions";
import { SyncType } from "common/SyncType";
import { CMD_CONNECTION, CMD_DISCONNECTION, TrakitSocketCommander } from "../commands/TrakitSocketCommander";
import { TrakitSocketStatus } from "../commands/TrakitSocketStatus";
import { SubscribedRegions } from "./SubscribedRegions";
import { version } from "./worker";

/**
 * The amount of time (in milliseconds) to wait between intervals checking for expired subscriptions.
 **/
const TIMEOUT_SUBSCRIPTION = 10 * 1000;	// 10 seconds

/**
 * This is the class which does the work in the background {@link Worker} for the {@link SyncClient}.
 * It handles synchronizing regions, maintaining a connection to Trak-iT's WebSocket, and send HTTP requests to Trak-iT's RESTful service.
 * This class also maintains a queue of up-going messages.
 **/
export class SyncWorker {
    /**
     * All active subscriptions per company.
     **/
    #subscriptions: Map<number, SubscribedRegions> = new Map;
    
    /**
     * Callback used to clear expired subscriptions from the dictionary.
     * Also resets the timer after sending unsubscribe Promise to Trak-iT's WebSocket is resolved.
     **/
    #subscriptionExpirer() {
        const expirations: Promise<Reply>[] = [];
        if (this.#socket.state === TrakitSocketStatus.open) {
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
     * The Trak-iT WebSocket's main connection.
     **/
    #socket!: TrakitSocketCommander;

    /**
     * Disconnects the Trak-iT WebSocket then sends a message to the {@link SyncClient} about it, then dies.
     * Does not terminate the {@link Worker}.
     **/
    dispose() {
        const action = (response: Reply) => {
            var msg = new SyncDispose();
            msg.response = response;
            self.postMessage(msg);
            this.#socket.dispose();
            (this.#socket as TrakitSocketCommander | null) = null;
        };
        this.#socket.close().then(action, action);
    }
    /**
     * Handles the "connection" event from the Trak-iT WebSocket.
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
     * Handles the "disconnection" event from the Trak-iT WebSocket.
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
     * Handles message events from the Trak-iT WebSocket.
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
     * Handles the "error" event from the Trak-iT WebSocket.
     * All this does is relay the event as a {@link SyncMessage} to the {@link SyncClient}.
     * @param error 
     **/
    #onError(error: Reply) {
        self.postMessage(new SyncMessage("error", error));
    }

    /**
     * Sends a (un)subscribe command to the Trak-iT WebSocket for the given company and regions.
     **/
    #subscribe(add: boolean, company: ulong, regions: SubscriptionType[]) {
        return this.#socket.send(
            add
                ? "subscribe"
                : "unsubscribe",
            {
                "company": {
                    "id": company,
                },
                "subscriptionTypes": regions,
            } as PaySubscriptionMerge
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
        this.#socket = new TrakitSocketCommander(msg.socket, msg.ghostId);
        this.#socket.onOpen = (msg) => this.#onOpen(msg);
        this.#socket.onClose = (msg) => this.#onClose(msg);
        this.#socket.onMessage = (msg, data) => this.#onMessage(msg, data);
        this.#socket.onError = (msg) => this.#onError(msg);
        const action = (response: Reply) => {
            msg.response = response;
            self.postMessage(msg);
        };
        this.#socket.open().then(action, action);
    }
    /**
     * Immediately posts the current {@link Worker} state and variables, ignoring the queue and going "right now".
     * @param msg
     **/
    status(msg: SyncStatus) {
        msg.response = {
            "id": (msg || {}).id || null,
            "v": [version],
            "kind": SyncType.status,
            "socket": {
                "ghostId": this.#socket.ghostId,
                "state": this.#socket.state,
                "ready": this.#socket.ready,
                "reconnectEnabled": this.#socket.reconnectEnabled,
                "keepAliveEnabled": this.#socket.keepAliveEnabled,
                "lastReceived": this.#socket.lastReceived,
                "lastMessageName": this.#socket.lastMessageName,
            },
            "subscriptions": {
                // key is a company id
                // value is an array of `SubscriptionType`s
            },
        } as any;
        for (let [company, subscribed] of this.#subscriptions) {
            const regions = subscribed.regions,
                expiring = subscribed.expiringRegions();
            (msg.response as any).subscriptions[company] = {
                current: regions.filter(r => !expiring.includes(r)),
                expiring: expiring,
            };
        }
        self.postMessage(msg);
    }
    /**
     * Begins synchronizing the given regions.
     * If all regions are in-sync, will resolve immediately with the arrays of content.  (How do I do that?)
     * @param msg
     **/
    sync(msg: SyncSubscriptions) {
        const subscribed = this.#currentSubscriptions(msg.company),
            alreadySubscribed = subscribed.regions,
            requestedSubscriptions: SubscriptionType[] = msg.subs.map((region) => {
                return SUBSCRIPTION_SPLITS[region] || [region];
            }).reduce((acc, val) => acc.concat(val), []),
            subscriptionUrls = requestedSubscriptions.map(s => SUBSCRIPTION_LIST_BY_COMPANY[s] || ""),
            temporarySubscriptions: SubscriptionType[] = [],
            newSubscriptions: SubscriptionType[] = [];
        
        for (let subType of SUBSCRIPTION_LIST_BY_COMPANY) {
            // here we find any subscription types that were not requested, but will be filled based on the fact that they are coming in too, regardless of if they were asked.
            // example is subscribe to assetGeneral, but listing assets also gives assetAdvanced, so we create a subscription for assetAdvanced too
            // but the assetAdvanced must be temporary since we didn't ask for it
            // it can expire using the regular expiration timeout
            if (subscriptionUrls.includes(SUBSCRIPTION_LIST_BY_COMPANY[subType])) {
                temporarySubscriptions.push(subType);
            }
        }
        for (let subType of requestedSubscriptions.concat(temporarySubscriptions)) {
            // for REST requests that will also pull up other regions (assets => assetGeneral/assetAdvanced)
            // build a list of all URL templates for every subscription type being requested
            if (!alreadySubscribed.includes(subType) && !newSubscriptions.includes(subType)) {
                newSubscriptions.push(subType);
            }
        }
        
        
        
        
        
        (newSubscriptions.length
            // if there are new subscriptions to make, do so and when the Promise is resolved pass the response (normal KraknSocket behaviour)
            ? this.#subscribe(true, msg.company, newSubscriptions) as Promise<RepSubscription>
            // otherwise, return a fulfilled Promise with a response of no "merged", and errorCode=0
            : Promise.resolve({
                "errorCode": 0,
                "company": { "id": msg.company },
                "merged": [],
            } as unknown as RepSubscription)
        ).then(
            // subscriptions succeeded (at least partially)
            function (response: RepSubscription) {
                // remove expiration from any new subscriptions
                subscribed.removeExpiries(requestedSubscriptions.without(temporarySubscriptions));
                // once subscriptions are made, set the expiry of the temporary ones
                subscribed.addExpiries(temporarySubscriptions);




                const requestUrls = response.merged
                    .map((sub) => (SUBSCRIPTION_LIST_BY_COMPANY[sub]?.replace("{companyId}", msg.company) || ""))
                    .filter((url) => url !== "")
                    .reduce((acc, val) => acc.concat(val), [])
                    .map((url: string) => new Promise((resolve, reject) => {
                        // Make the request
                        var xhr = new XMLHttpRequest;
                        xhr.onload =
                            xhr.onerror = function (event) {
                                var error = {},
                                    response = JSON_PARSE_SAFE(xhr.responseText, error) || {
                                        "errorCode": 2,	// internal service error
                                        "message": error["message"] || "JSON parse error",
                                        "errorDetails": error,
                                    };
                                (response.errorCode === 0 ? resolve : reject)(response);
                            };
                        xhr.open("GET", url, true);
                        xhr.send();
                    }));
















                // now load all the data
                return Promise.allSettled(
                    response.merged                        .map(function (sub) {
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
                                    // since Trak-iT's RESTful service is not providing region lists in all cases (for complex types)
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
        // does not send "unsubscribe" to the Trak-iT WebSocket, this is done in the {@link SyncWorker#subscriptionTimer} process.
        msg.response = {
            "errorCode": 0,
            "message": "Regions added to unsubscribe timeout",
            "regions": regions,
        };
        self.postMessage(msg);
    }
    /**
     * Sends an XHR to Trak-iT's RESTful service, and when a response is returned (or timeout occurs, or JSON parsing error occurs),
     * the response is added to the message and add to the queue to go back to the main {@link Window}.
     * @param msg
     **/
    rest(msg: SyncRestful) {
        // if the socket is not open, we would miss sync events
        // so if the socket is not open, we should open it and then send the REST command
        // but we also don't need to worry about that for GET requests; which are got getting an object or a list of them

        const action = (response: Reply) => {
            msg.response = response;
            self.postMessage(msg);
        }



        return msg.method === "GET" || this.#socket.state === TrakitSocketStatus.open
            ? XHR_MINDFLAYER(
                msg.path,
                msg.method,
                msg.body
                    ? msg.body instanceof FormData
                        ? msg.body
                        : JSON_STRINGIFY(msg.body)
                    : null
            ).then(action, action)
            : this.#socket.open().finally(() => this.rest(msg));
    }
    /**
     * Sends a command to the Trak-iT WebSocket, and when a response is returned (or timeout occurs),
     * the response is added to the message and add to the queue to go back to the main {@link Window}.
     * @param msg
     **/
    socket(msg: SyncSocket) {
        const action = (response: Reply) => {
            msg.response = response;
            self.postMessage(msg);
        };
        this.#socket.send(msg.name, msg.body).then(action, action);
    }
}