import { SyncBase } from "./SyncBase";
import { SyncType } from "./SyncType"; // Adjust the path if SyncType is elsewhere

/**
 * In order to start the {@link Worker}, it needs the {@link trakit.json.RespSelfDetails#ghostId}.
 * @constructor
 * @extends {SyncBase}
 * @param {string=} ghostId
 **/
export class SyncInit extends SyncBase {
	/**
	 * Your session id.
	 **/
	ghostId: string;

	constructor(ghostId?: string | null) {
		super(SyncType.init);
		this.ghostId = ghostId || "";
	}
}