/**
 * Synchronization library main process.
 * {@link https://github.com/trakitwireless/trakit-ts-sync|Client synchronization library.}
 * Last updated on Thu Feb 27 2025 11:59:01 
 * @copyright Trak-iT Wireless Inc. 2025
 */

import {
	TrakitEvent,
	TrakitEventAccount,
	TrakitEventDelete,
	TrakitEventList,
	TrakitEventSync,
	TrakitEventUpdate
} from "./API/Events";
import {
	createClientErrorResponse,
	makeVerbRoute,
	requestCreateCommander,
	requestCreateCors,
	requestRelayCorsJson
} from "./API/Functions";
import { TrakitBaseCommander } from "./API/TrakitBaseCommander";
import { TrakitObjectCommander } from "./API/TrakitObjectCommander";
import { HttpVerb } from "./RESTful/Constants";
import { TrakitRestfulCommander } from "./RESTful/TrakitRestfulCommander";
import { TrakitSyncCommander } from "./Synchronization/TrakitSyncCommander";
import { TrakitEventSocketBroadcast, TrakitEventSocketMessage, TrakitEventSocketState } from "./WebSocket/Events";
import { makeCommandName } from "./WebSocket/Functions";
import { SubscribedRegions } from "./WebSocket/SubscribedRegions";
import { TrakitSocketCommander, TrakitSocketStatus } from "./WebSocket/TrakitSocketCommander";

/**
 * Version number for this release.
 */
export const version = '0.0.62';

/**
 * API exports
 */
export {
	createClientErrorResponse,
	requestRelayCorsJson,
	TrakitBaseCommander,
	TrakitEvent,
	TrakitEventAccount,
	TrakitEventDelete,
	TrakitEventList,
	TrakitEventSync,
	TrakitEventUpdate,
	TrakitObjectCommander,
	type HttpVerb
};

/**
 * RESTful API exports
 */
export {
	makeVerbRoute,
	requestCreateCommander,
	requestCreateCors,
	TrakitRestfulCommander
};

/**
 * WebSocket API exports
 */
export {
	makeCommandName,
	SubscribedRegions,
	TrakitSocketCommander,
	TrakitSocketStatus
};

/**
 * Synchronization exports
 */
export {
	TrakitEventSocketBroadcast,
	TrakitEventSocketMessage,
	TrakitEventSocketState,
	TrakitSyncCommander
};
