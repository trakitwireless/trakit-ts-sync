/**
 * Synchronization library main process.
 * {@link https://github.com/trakitwireless/trakit-ts-sync|Client synchronization library.}
 * Last updated on Thu Feb 27 2025 11:59:01 
 * @copyright Trak-iT Wireless Inc. 2025
 */

import { TrakitBaseCommander } from "./API/TrakitBaseCommander";
import { TrakitObjectCommander } from "./API/TrakitObjectCommander";
import { TrakitRestfulCommander } from "./RESTful/TrakitRestfulCommander";
import { TrakitSyncCommander } from "./Synchronization/TrakitSyncCommander";
import { SubscribedRegions } from "./WebSocket/SubscribedRegions";
import { TrakitSocketCommander } from "./WebSocket/TrakitSocketCommander";

/**
 * Version number for this release.
 */
export const version = '0.0.8';

export {
	TrakitBaseCommander,
	TrakitObjectCommander
};
	
export {
	TrakitRestfulCommander
};

export {
	SubscribedRegions,
	TrakitSocketCommander
};

export {
	TrakitSyncCommander
};
