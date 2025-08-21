import { Payload } from "@commands/API/Requests/Payload";
import { SyncBase } from "./SyncBase";
import { SyncType } from "./SyncType";

/**
 * For creating a call directly to Mindflayer (like a merge or delete object).
 * Can also send to Medusa.
 **/
export class SyncMindflayer extends SyncBase {
	/**
	 * The full path for this direct call.
	 * Does not include the Mindflayer domain or "https://" prefix.
	 **/
	path: string;
	/**
	 * The HTTP method used.
	 **/
	method: string;
	/**
	 * The JSON used for the command.
	 **/
	body: Payload | null;

	constructor(path: string, method?: string, body?: Payload) {
		super(SyncType.rest);
		this.path = path;
		this.method = method || "GET";
		this.body = body || null;
	}
}