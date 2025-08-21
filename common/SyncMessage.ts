import { SyncBase } from "./SyncBase";
import { SyncType } from "./SyncType"; // Adjust the path if SyncType is elsewhere

/**
 * Kraken events as received from the socket.
 **/
export class SyncMessage extends SyncBase {
	/**
	 * Name of the Kraken message or response.
	 **/
	name: string;
	/**
	 * The JSON from the Kraken message or response.
	 **/
	content: object;
	
	constructor(name: string, content: object) {
		super(SyncType.event);
		this.name = name;
		this.content = content;
	}
}