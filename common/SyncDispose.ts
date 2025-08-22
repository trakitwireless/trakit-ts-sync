import { SyncBase } from "./SyncBase";
import { SyncType } from "./SyncType";

/**
 * This message is sent to the main {@link Window} to indicate that the worker is being disposed.
 **/
export class SyncDispose extends SyncBase {
	constructor() {
		super(SyncType.dispose);
	}
}