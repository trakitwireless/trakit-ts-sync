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
import { createClientErrorResponse, fetchJsonObject } from "./API/Functions";
import { TrakitBaseCommander } from "./API/TrakitBaseCommander";
import { TrakitObjectCommander } from "./API/TrakitObjectCommander";
import { HttpVerb } from "./RESTful/Constants";
import { createCorsRequest, payloadToVerbRoute } from "./RESTful/Functions";
import { TrakitRestfulCommander } from "./RESTful/TrakitRestfulCommander";
import { TrakitSyncCommander } from "./Synchronization/TrakitSyncCommander";
import { TrakitEventSocketClose, TrakitEventSocketMessage } from "./WebSocket/Events";
import { payloadToCommandName } from "./WebSocket/Functions";
import { SubscribedRegions } from "./WebSocket/SubscribedRegions";
import { TrakitSocketCommander, TrakitSocketStatus } from "./WebSocket/TrakitSocketCommander";

/**
 * Version number for this release.
 */
export const version = '0.0.51';

/**
 * API exports
 */
export {
	createClientErrorResponse,
	fetchJsonObject,
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
	createCorsRequest,
	payloadToVerbRoute,
	TrakitRestfulCommander
};

/**
 * WebSocket API exports
 */
export {
	payloadToCommandName,
	SubscribedRegions,
	TrakitSocketCommander,
	TrakitSocketStatus
};

/**
 * Synchronization exports
 */
export {
	TrakitEventSocketClose,
	TrakitEventSocketMessage,
	TrakitSyncCommander
};
