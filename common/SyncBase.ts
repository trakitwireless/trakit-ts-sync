import { Reply } from "@commands/API/Responses/Reply";
import { SyncType } from "./SyncType"; // Adjust the path if SyncType is elsewhere

/**
 * Base class for all synchronization messages.
 **/
export abstract class SyncBase {
	/**
	 * A hint at the type of structure this class has.
	 **/
	kind: SyncType;
	/**
	 * This value is set by the {@link SyncClient} upon posting to the worker.
	 * @expose
	 * @type {!number}
	 **/
	id: number = -1;
	/**
	 * Each synchronization message is sent to the {@link Worker},
	 * and it is returned to the main {@link Window} with the response populated.
	 **/
	response: Reply;
    
	constructor(kind: SyncType) {
		this.kind = kind;
	}
}