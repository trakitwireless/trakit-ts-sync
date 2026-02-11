import { Reply } from '@trakit/commands';
import { JsonObject } from "@trakit/objects";
import { TrakitEvent } from "../API/Events";

/**
 * Represents a message event received from the Trak-iT WebSocket.
 */
export class TrakitSocketMessageEvent extends TrakitEvent {
	/**
	 * The name of the message event, used to identify the type of message received.
	 */
	readonly name: string;
	/**
	 * The body of the message event, containing the data associated with the object being synchronized.
	 */
	readonly body: JsonObject;

	constructor(name: string, body: JsonObject) {
		super("message");
		this.name = name;
		this.body = body;
	}
}
/**
 * Used when the Trak-iT WebSocket is closed, or an error occurs that causes the connection to close.
 */
export class TrakitSocketCloseEvent extends TrakitEvent {
	/**
	 * The reply contains the details and reason provided by the Trak-iT service when the WebSocket is closed.
	 */
	readonly reply: Reply;
	
	constructor(type: string, reply: Reply) {
		super(type);
		this.reply = reply;
	}
}