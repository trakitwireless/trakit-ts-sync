import { SyncBase } from "./SyncBase";
import { SyncType } from "./SyncType";

/**
 * This message is sent to the main {@link Window} to indicate the current status of the worker.
 **/
export class SyncStatus extends SyncBase {

	
	constructor() {
		super(SyncType.status);
	}
}