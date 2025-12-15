/**
 * Synchronization library main process.
 * {@link https://github.com/trakitwireless/trakit-ts-sync|Client synchronization library.}
 * Last updated on Thu Feb 27 2025 11:59:01 
 * @copyright Trak-iT Wireless Inc. 2025
 */

import { SubscribedRegions } from "./synchronization/WebSocket/SubscribedRegions";
import { TrakitBaseCommander } from "./synchronization/API/TrakitBaseCommander";
import { TrakitObjectCommander } from "./synchronization/API/TrakitObjectCommander";
import { TrakitRestfulCommander } from "./synchronization/RESTful/TrakitRestfulCommander";
import { TrakitSocketCommander } from "./synchronization/WebSocket/TrakitSocketCommander";
import { TrakitSyncCommander } from "./synchronization/Synchronization/TrakitSyncCommander";

/**
 * Version number for this release.
 */
export const version = 5.0;

/**
 * Exports the main classes for synchronization commands.
 */
export {
	TrakitRestfulCommander, TrakitSocketCommander,
	TrakitSyncCommander
};

	export {
		SubscribedRegions, TrakitBaseCommander, TrakitObjectCommander
	};
