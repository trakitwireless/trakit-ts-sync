import { SyncMessage } from "common/SyncMessage";
import { SubscribedRegions } from "./Socket/SubscribedRegions";
import { TrakitSocket, TrakitSocket_cmd_connection, TrakitSocket_cmd_disconnection, TrakitSocketState } from "./Socket/TrakitSocket";
import { SyncBase } from "common/SyncBase";
import { ulong } from "@objects/API/Types";
import { SyncInit } from "common/SyncInit";
import { Reply } from "@commands/API/Responses/Reply";
import { SyncType } from "common/SyncType";
import { SyncSubscriptions } from "common/SyncSubscriptions";
import { SyncMindflayer } from "common/SyncMindflayer";
import { SyncKraken } from "common/SyncKraken";
import { CLEAR_TIMER, JSON_STRINGIFY, SET_TIMER } from "@objects/API/Constants";

/**
 * The amount of time (in milliseconds) to wait between intervals checking for expired subscriptions.
 * @const {!number}
 **/
const SyncWorker_subscriptionExpirer_TIMEOUT = 10 * 1000;	// 10 seconds



/**
 * Callback used to clear expired subscriptions from the dictionary.
 * Also resets the timer after sending unsubscribe Promise to Kraken is resolved.
 * @param {!SyncWorker} peasant
 **/
function SyncWorker_subscriptionExpirer(peasant:SyncWorker) {
    const expirations: Promise<Reply>[] = [];
	if (peasant.__kraken.state === TrakitSocketState.open) {
		peasant.__subscriptions.forEach(function(subscribed, company) {
			const expired = subscribed.expiredRegions(true);
			if (expired.length) expirations.push(peasant.__subscribe(false, company, expired));
		});
	}
	Promise.allSettled(expirations).finally(function() {
		peasant.__subscriptionTimer = SET_TIMER(
			SyncWorker_subscriptionExpirer,
			SyncWorker_subscriptionExpirer_TIMEOUT,
			peasant
		);
	});
}

/**
 * Handles the "connection" event from Kraken.
 * This will update the global {@link SESSION_ID}, sends a {@link SyncMessage} to the {@link SyncClient},
 * and re-subscribe to any regions that were subscribed to before the disconnection occured.
 * Also restarts the subscription expirer.
 * @this {SyncWorker}
 * @param {!trakit.fleetfreedom.MVCEvent} event
 * @param {!trakit.json.RespSelfDetails} sessionDetails
 **/
function SyncWorker_krakenConnect(this: SyncWorker, sessionDetails: Reply) {
    this.__post(new SyncMessage(TrakitSocket_cmd_connection, sessionDetails));
    this.__subscriptions.forEach((subscribed, company) => {
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
    SyncWorker_subscriptionExpirer(this);
}
/**
 * Handles the "disconnection" event from Kraken.
 * Stops the subscription expirer (it is restarted on re-connection).
 * Also sends a {@link SyncMessage} to the {@link SyncClient}.
 * @this {SyncWorker}
 * @param {!trakit.fleetfreedom.MVCEvent} event
 * @param {!trakit.json.BaseResponse} details
 **/
function SyncWorker_krakenDisconnect(this: SyncWorker, details: Reply) {
    this.__post(new SyncMessage(TrakitSocket_cmd_disconnection, details));
    // stop trying to remove expired subscriptions
    CLEAR_TIMER(this.__subscriptionTimer);
    this.__subscriptionTimer = 0;
}
/**
 * Handles message events from Kraken.
 * For login and session-details related messages, will set the global {@link SESSION_ID},
 * (Kraken handles this to set its own {@link KrakenSocket#ghostId}).
 * Also sends a {@link SyncMessage} to the {@link SyncClient}.
 * @this {SyncWorker}
 * @param {any} event
 * @param {!{kind:string,content:Object}} payload
 **/
function SyncWorker_krakenMessage(this: SyncWorker, kind: string, content: any) {
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
    this.__post(new SyncMessage(kind, content));
}
/**
 * Handles the "error" event from Kraken.
 * All this does is relay the event as a {@link SyncMessage} to the {@link SyncClient}.
 * @this {SyncWorker}
 * @param {!trakit.fleetfreedom.MVCEvent} event
 * @param {!trakit.json.BaseResponse} error
 **/
function SyncWorker_krakenError(this: SyncWorker, error: Reply) {
	this.__post(new SyncMessage("error", error));
}

/**
 * This is the class which does the work in the background {@link Worker} for the {@link SyncClient}.
 * It handles synchronizing regions, maintaining a connection to Kraken, and send HTTP requests to Mindflayer.
 * This class also maintains a queue of up-going messages.
 * @constructor
 **/
export class SyncWorker {
    /**
     * All active subscriptions per company.
     **/
    __subscriptions: Map<number, SubscribedRegions> = new Map;
    /**
     * Handle for the auto-remove expired subscription types.
     **/
    __subscriptionTimer: number = 0;

    /**
     * The Kraken main connection.
     **/
    __kraken: TrakitSocket;

    constructor(url: string) {
        this.__kraken = new TrakitSocket(url);
        this.__kraken.onOpen = SyncWorker_krakenConnect.bind(this);
        this.__kraken.onClose = SyncWorker_krakenDisconnect.bind(this);
        this.__kraken.onMessage = SyncWorker_krakenMessage.bind(this);
        this.__kraken.onError = SyncWorker_krakenError.bind(this);
    }

    /**
     * Disconnects Kraken then sends a message to the {@link SyncClient} about it, and dies.
     * Does not terminate the {@link Worker}.
     * @this {SyncWorker}
     * @override
     **/
    dispose() {
        const action = (response: Reply) => {
            var msg = new SyncBase(SyncType.dispose);
            msg.response = response;
            this.__post(msg);
            this.__kraken.dispose();
            (this.__kraken as TrakitSocket | null) = null;
        };
        this.__kraken.close().then(action, action);
    }

    /**
     * Serves two purposes:
     * 1) Adds the given {@link SyncBase} to the queue of things to be sent to the main {@link Window}.
     * 2) If the {@link SyncWorker#sendNext} is true, grabs the top item from {@link SyncWorker#sendQueue} and posts it to the main {@link Window}.
     * Can this function be broken into two functions? Yes.
     * @this {SyncWorker}
     * @param {SyncBase=} msg
     **/
    __post(msg: SyncBase) {
        //if (msg) this.__postQueue.push(msg);
        //if (this.__postNext) {
        //	msg = this.__postQueue.shift();
        //	this.__postNext = !msg;
        if (msg) SELF.postMessage(msg);
        //}
    }
    /**
     * Sends a (un)subscribe command to Kraken for the given company and regions.
     **/
    __subscribe(add: boolean, company: ulong, regions: string[]) {
        return this.__kraken.send(
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
     * @this {SyncWorker}
     * @param {!number} company
     * @return {!SubscribedRegions}
     **/
    __currentSubscriptions(company: ulong) {
        let subs = this.__subscriptions.get(company);
        if (!subs) this.__subscriptions.set(company, subs = new SubscribedRegions)
        return subs;
    }

    /**
     * When invoked, it means the main {@link Window} is ready to control this worker.
     * @this {SyncWorker}
     * @param {!SyncInit} msg
     **/
    init(msg: SyncInit) {
        var peasant = this;
        peasant.__kraken.ghostId = msg.ghostId;
        peasant.__kraken.open().finally(function (response: Reply) {
            msg.response = response;
            peasant.__post(msg);
        });
    }
    /**
     * Immediately posts the current {@link Worker} state and variables, ignoring the queue and going "righ now".
     * @this {SyncWorker}
     * @param {!SyncBase} msg
     **/
    variables(msg: SyncBase) {
        SELF.postMessage({
            "id": (msg || {}).id || null,
            "v": [trakit_fleetfreedom.version, ns.version/*, DATABASE_VERSION*/],
            "kind": SyncType.variables,
            "kraken": {
                "ghostId": this.__kraken.ghostId,
                "state": this.__kraken.state,
                "reqId": this.__kraken.reqId,
                "ready": this.__kraken.__ready,
                "operable": this.__kraken.__operable,
                "reconnectEnabled": this.__kraken.reconnectEnabled,
                "keepAliveEnabled": this.__kraken.keepAliveEnabled,
                "lastReceived": this.__kraken.lastReceived,
                "lastMessageName": this.__kraken.lastMessageName,
            },
            "subscriptions": this.__subscriptions.toObject(function (subscribed, company) {
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
     * @this {SyncWorker}
     * @param {!SyncSubscriptions} msg
     **/
    sync(msg: SyncSubscriptions) {
        var peasant = this,
            subscribed = peasant.__currentSubscriptions(msg.company),
            alreadySubscribed = subscribed.regions,
            requestedSubscriptions = msg.subs.map(function (region) {
                return SUBSCRIPTION_SPLITS[region] || [region];
            }).flatten(),
            temporarySubscriptions = OBJECT_EACH(
                SUBSCRIPTION_LIST_BY_COMPANY,
                function (url, sub) {
                    // here we find any subscription types that were not requested, but will be filled based on the fact that they are coming in too, regardless of if they were asked.
                    // example is subscribe to assetGeneral, but listing assets also gives assetAdvanced, so we create a subscription for assetAdvanced too
                    // but the assetAdvanced must be temporary since we didn't ask for it
                    // it can expire using the regular expiration timeout
                    return this.includes(url)
                        ? sub
                        : "";
                },
                requestedSubscriptions.map(function (sub) {
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
            ? peasant.__subscribe(true, msg.company, newSubscriptions)
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
                                        peasant.__post(new SyncMessage(
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
                    peasant.__post(msg);
                });
            },
            // subscriptions failed???
            function (response) {
                msg.response = response;
                peasant.__post(msg);
            }
        );
    };
    /**
     * Begins removing regions from synchronization.
     * The process is not immediate, but will start a timeout.
     * This allows the service to re-request sync on a region within a few seconds (or minutes, haven't decided), like when switching sections.
     * @this {SyncWorker}
     * @param {!SyncSubscriptions} msg
     **/
    desync(msg: SyncSubscriptions) {
        var peasant = this,
            subscribed = peasant.__currentSubscriptions(msg.company),
            regions = msg.subs.map(function (region) { return SUBSCRIPTION_SPLITS[region] || [region]; })
                .flatten()
                .without(subscribed.expiringRegions())
        subscribed.addExpiries(regions);
        // does not send "unsubscribe" to Kraken, this is done in the {@link SyncWorker#subscriptionTimer} process.
        msg.response = {
            "errorCode": 0,
            "message": "Regions added to unsubscribe timeout",
            "regions": regions,
        };
        peasant.__post(msg);
    }
    /**
     * Sends an XHR to Mindflayer, and when a response is returned (or timeout occurs, or JSON parsing error occurs),
     * the response is added to the message and add to the queue to go back to the main {@link Window}.
     * @this {SyncWorker}
     * @param {!SyncMindflayer} msg
     **/
    mindflayer(msg: SyncMindflayer) {
        var peasant = this;
        // if the socket is not open, we would miss sync events
        // so if the socket is not open, we should open it and then send the mindflayer command
        // but we also don't need to worry about that for GET requests; which are got getting an object or a list of them
        return msg.method === "GET" || peasant.__kraken.state === TrakitSocketState.open
            ? XHR_MINDFLAYER(
                msg.path,
                msg.method,
                msg.body
                    ? msg.body instanceof FormData
                        ? msg.body
                        : JSON_STRINGIFY(msg.body)
                    : null
            ).finally(function (response) {
                msg.response = response;
                peasant.__post(msg);
            })
            : peasant.__kraken.open().finally(function () {
                peasant.mindflayer(msg);
            });
    }
    /**
     * Sends a command to Kraken, and when a response is returned (or timeout occurs),
     * the response is added to the message and add to the queue to go back to the main {@link Window}.
     * @this {SyncWorker}
     * @param {!SyncKraken} msg
     **/
    kraken(msg: SyncKraken) {
        var peasant = this;
        peasant.__kraken.send(msg.name, msg.body, msg.retries).finally(function (response) {
            msg.response = response;
            peasant.__post(msg);
        });
    }
}