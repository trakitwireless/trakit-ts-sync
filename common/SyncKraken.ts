import { Payload } from "@commands/API/Requests/Payload";
import { SyncBase } from "./SyncBase";
import { SyncType } from "./SyncType";

/**
 * The number of tmes to attempt to send a command while the WebSocket is disconnected.
 **/
const SyncKraken_DEFAULT_RETRIES = 3;

/**
 * For creating a call directly to Kraken (like... what exactly? Connection details?)
 **/
export class SyncKraken extends SyncBase {
	/**
	 * Name of the Kraken command.
	 **/
	name: string;
	/**
	 * The JSON used for the command.
	 **/
	body: Payload;
	/**
	 * The number of attempts to send this command while the WebSocket is disconnected.
	 **/
	retries: number;

	constructor(name: string, body?: Payload | null, retries?: number) {
		super(SyncType.socket);
		this.name = name;
		this.body = body || null;
		this.retries = retries || SyncKraken_DEFAULT_RETRIES;
	}
}