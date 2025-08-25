import { Payload } from "@commands/API/Requests/Payload";
import { SyncBase } from "./SyncBase";
import { SyncType } from "./SyncType";

/**
 * For creating a call directly to Kraken (like... what exactly? Connection details?)
 **/
export class SyncSocket extends SyncBase {
	/**
	 * Name of the Kraken command.
	 **/
	name: string;
	/**
	 * The JSON used for the command.
	 **/
	body: Payload | null;

	constructor(name: string, body?: Payload | null) {
		super(SyncType.socket);
		this.name = name;
		this.body = body || null;
	}
}