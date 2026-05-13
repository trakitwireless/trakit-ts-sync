import { Reply } from '@trakit/commands';
import { JsonObject } from "@trakit/objects";
import { TrakitEvent } from "../API/Events";
import { Broadcast } from "./Broadcast";
/**
 * Represents a message event received from the Trak-iT WebSocket.
 */
export declare class TrakitEventSocketMessage extends TrakitEvent {
    /**
     * The name of the message event, used to identify the type of message received.
     */
    readonly name: string;
    /**
     * The body of the message event, containing the data associated with the object being synchronized.
     */
    readonly body: JsonObject;
    constructor(type: string, name: string, body: JsonObject);
}
/**
 * Used when the Trak-iT WebSocket is closed, or an error occurs that causes the connection to close.
 */
export declare class TrakitEventSocketState extends TrakitEvent {
    /**
     * Indicates whether the WebSocket connection is currently online (open) or offline (closed).
     */
    readonly online: boolean;
    /**
     * The reply contains the details and reason provided by the Trak-iT service when the WebSocket is closed.
     */
    readonly reply: Reply;
    constructor(type: string, online: boolean, reply: Reply);
}
/**
 * Event raised when a broadcast message is received from the Trak-iT WebSocket.
 */
export declare class TrakitEventSocketBroadcast extends TrakitEvent {
    readonly broadcast: Broadcast;
    constructor(type: string, json: JsonObject);
}
//# sourceMappingURL=Events.d.ts.map