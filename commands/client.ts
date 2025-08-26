/**
 * Synchronization library main process.
 * {@link https://github.com/trakitwireless/trakit-ts-sync|Client synchronization library.}
 * Last updated on Thu Feb 27 2025 11:59:01 
 * @copyright Trak-iT Wireless Inc. 2025
 */

import { TrakitSocketStatus } from "commands/TrakitSocketStatus";
import { TrakitSocketCommander } from "./TrakitSocketCommander";

/**
 * Version number for this release.
 */
export const version = 5.0;

export default {
    version,
    
    TrakitSocketStatus,
    TrakitSocketCommander,
};