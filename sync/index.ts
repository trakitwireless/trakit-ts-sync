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
import { TrakitBaseCommander } from "./API/TrakitBaseCommander";
import { TrakitObjectCommander } from "./API/TrakitObjectCommander";
import { TrakitRestfulCommander } from "./RESTful/TrakitRestfulCommander";
import { TrakitSyncCommander } from "./Synchronization/TrakitSyncCommander";
import { TrakitEventSocketClose, TrakitEventSocketMessage } from "./WebSocket/Events";
import { SubscribedRegions } from "./WebSocket/SubscribedRegions";
import { TrakitSocketCommander } from "./WebSocket/TrakitSocketCommander";

/**
 * Version number for this release.
 */
export const version = '0.0.24';

/**
 * API exports
 */
export {
	TrakitBaseCommander,
	TrakitEvent,
	TrakitEventAccount,
	TrakitEventDelete,
	TrakitEventList,
	TrakitEventSync,
	TrakitEventUpdate,
	TrakitObjectCommander
};

/**
 * RESTful API exports
 */
export {
	TrakitRestfulCommander
};

/**
 * WebSocket API exports
 */
export {
	SubscribedRegions,
	TrakitSocketCommander
};

/**
 * Synchronization exports
 */
export {
	TrakitEventSocketClose,
	TrakitEventSocketMessage,
	TrakitSyncCommander
};
