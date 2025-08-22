/**
 * Object definitions that work with our various APIs.
 * {@link https://github.com/trakitwireless/trakit-ts|TypeScript API documentation.}
 * Last updated on Thu Feb 27 2025 11:59:01 
 * @copyright Trak-iT Wireless Inc. 2025
 */
import { SyncType } from "common/SyncType";
import { SyncWorker } from "./SyncWorker";
import { SyncBase } from "common/SyncBase";
import { SyncInit } from "common/SyncInit";

/**
 * Instance of the peasant that will do the work.
 * @const {!SyncWorker}
 **/
var PEASANT = new SyncWorker;

/**
 * Main thread command handler.
 * @expose
 * @param {MessageEvent} event
 **/
self.onmessage = function (event: MessageEvent<SyncBase>) {
    var msg = event.data;
    switch (msg.kind) {
        case SyncType.init:
            PEASANT.init(msg as SyncInit);
            break;
        case SyncType.dispose:
            PEASANT.dispose();
            break;
        case SyncType.variables:
            PEASANT.variables(msg);
            break;
        case SyncType.sync:
            PEASANT.sync(msg);
            break;
        case SyncType.desync:
            PEASANT.desync(msg);
            break;
        case SyncType.rest:
            PEASANT.mindflayer(msg);
            break;
        case SyncType.socket:
            PEASANT.kraken(msg);
            break;
        case SyncType.event:
        default:
            throw new Error("Unhandled message kind: " + msg.kind);
    }
};