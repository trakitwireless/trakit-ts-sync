import { Payload } from "@trakit/commands";
import { nothing } from "@trakit/objects";
import { SyncBase } from "./SyncBase";
import { SyncType } from "./SyncType";

/**
 * For creating a call directly to Trak-iT WebSocket (like... what exactly? Connection details?)
 **/
export class SyncSocket extends SyncBase {
	/**
	 * Name of the Trak-iT WebSocket command.
	 **/
	name: string;
	/**
	 * The JSON used for the command.
	 **/
	body: Payload | null;

	constructor(name: string, body: Payload | nothing) {
		super(SyncType.socket);
		this.name = name;
		this.body = body || null;
	}
}