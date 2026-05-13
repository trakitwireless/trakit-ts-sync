import { JsonObject } from "@trakit/objects";
/**
 * The kinds of broadcast messages sent to all connected clients.
 */
export declare enum BroadcastType {
    maintenance = "maintenance",
    upgrade = "upgrade"
}
/**
 * A message sent to all connected clients regardless of authentication about the Trak-iT WebSocket.
 * Broadcast messages are used to notify clients of upcoming maintenance or upgrades to the Trak-iT service.
 * The message contains information about the type of broadcast, the server time when the broadcast was sent, and a message describing the broadcast.
 */
export declare abstract class Broadcast {
    /**
     * Creates a Broadcast object from a JSON object received from the Trak-iT WebSocket.
     * The JSON object must contain a "kind" property that matches one of the BroadcastType values, which is used to determine the specific type of Broadcast to create.
     * Depending on the "kind" value, additional properties may be required in the JSON object to create the appropriate Broadcast subclass (e.g., BroadcastMaintenance or BroadcastUpgrade).
     * If the "kind" value is not recognized, an error is thrown.
     * @param json The JSON object received from the Trak-iT WebSocket.
     * @returns A Broadcast object of the appropriate subclass.
     */
    static fromJson(json: JsonObject): Broadcast;
    /**
     * The type of broadcast message, used to identify the kind of broadcast received.
     */
    kind: BroadcastType;
    /**
     * The UTC date/time of the server hosting the connection.
     */
    serverTime: Date;
    /**
     * Human readable message describing the broadcast.
     */
    message: string;
    constructor(json: JsonObject);
}
/**
 * Notification to clients of a scheduled maintenance window.
 * During a maintenance window, the service may go down and come back online repeatedly until the window ends.
 */
export declare class BroadcastMaintenance extends Broadcast {
    /**
     * Timestamp of when the maintenance window begins.
     */
    starting: Date;
    /**
     * Timestamp of when the maintenance window ends.
     */
    ending: Date;
    constructor(json: JsonObject);
}
/**
 * Notification to clients that an upgrade will take place (with optional requirement of reloading all resources).
 */
export declare class BroadcastUpgrade extends Broadcast {
    /**
     * Timestamp of when the upgrade will be ready.
     */
    eta: Date;
    /**
     * Indicates whether a reload of all resources is required for the upgrade.
     */
    reload: boolean;
    constructor(json: JsonObject);
}
//# sourceMappingURL=Broadcast.d.ts.map