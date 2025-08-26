/**
 * Synchronization library WebWorker process.
 * {@link https://github.com/trakitwireless/trakit-ts-sync|Client synchronization library.}
 * Last updated on Thu Feb 27 2025 11:59:01 
 * @copyright Trak-iT Wireless Inc. 2025
 */
import { SyncBase } from "common/SyncBase";
import { SyncInit } from "common/SyncInit";
import { SyncRestful } from "common/SyncRestful";
import { SyncSocket } from "common/SyncSocket";
import { SyncSubscriptions } from "common/SyncSubscriptions";
import { SyncType } from "common/SyncType";
import { SyncWorker } from "./SyncWorker";

/**
 * Version number for this release.
 */
export const version = 5.0;

/**
 * Instance of the peasant that will do the work.
 * @const {!SyncWorker}
 **/
const PEASANT = new SyncWorker;

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
        case SyncType.status:
            PEASANT.status(msg);
            break;
        case SyncType.sync:
            PEASANT.sync(msg as SyncSubscriptions);
            break;
        case SyncType.desync:
            PEASANT.desync(msg as SyncSubscriptions);
            break;
        case SyncType.rest:
            PEASANT.rest(msg as SyncRestful);
            break;
        case SyncType.socket:
            PEASANT.socket(msg as SyncSocket);
            break;
        case SyncType.event:
        default:
            throw new Error("Unhandled message kind: " + msg.kind);
    }
};