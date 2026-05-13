import { JsonObject } from "@trakit/objects";
import { datetime, nothing, utility } from "@trakit/objects";

/**
 * The kinds of broadcast messages sent to all connected clients.
 */
export enum BroadcastType {
	maintenance = "maintenance",
	upgrade = "upgrade",
}

/**
 * A message sent to all connected clients regardless of authentication about the Trak-iT WebSocket.
 * Broadcast messages are used to notify clients of upcoming maintenance or upgrades to the Trak-iT service.
 * The message contains information about the type of broadcast, the server time when the broadcast was sent, and a message describing the broadcast.
 */
export abstract class Broadcast {
	/**
	 * Creates a Broadcast object from a JSON object received from the Trak-iT WebSocket.
	 * The JSON object must contain a "kind" property that matches one of the BroadcastType values, which is used to determine the specific type of Broadcast to create.
	 * Depending on the "kind" value, additional properties may be required in the JSON object to create the appropriate Broadcast subclass (e.g., BroadcastMaintenance or BroadcastUpgrade).
	 * If the "kind" value is not recognized, an error is thrown.
	 * @param json The JSON object received from the Trak-iT WebSocket.
	 * @returns A Broadcast object of the appropriate subclass.
	 */
	static fromJson(json: JsonObject): Broadcast {
		switch (json?.kind as BroadcastType) {
			case BroadcastType.maintenance:
				return new BroadcastMaintenance(json);
			case BroadcastType.upgrade:
				return new BroadcastUpgrade(json);
			default:
				throw new Error(`Unknown broadcast type: ${json?.kind}`);
		}
	}

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

	constructor(json: JsonObject) {
		this.kind = json?.kind as BroadcastType;
		this.serverTime = utility.date(json?.serverTime as datetime);
		this.message = json?.message as string ?? "";
	}
}

/**
 * Notification to clients of a scheduled maintenance window.
 * During a maintenance window, the service may go down and come back online repeatedly until the window ends.
 */
export class BroadcastMaintenance extends Broadcast {
	/**
	 * Timestamp of when the maintenance window begins.
	 */
	starting: Date;
	/**
	 * Timestamp of when the maintenance window ends.
	 */
	ending: Date;

	constructor(json: JsonObject) {
		super(json);
		this.starting = utility.date(json?.starting as datetime);
		this.ending = utility.date(json?.ending as datetime);
	}
}

/**
 * Notification to clients that an upgrade will take place (with optional requirement of reloading all resources).
 */
export class BroadcastUpgrade extends Broadcast {
	/**
	 * Timestamp of when the upgrade will be ready.
	 */
	eta: Date;
	/**
	 * Indicates whether a reload of all resources is required for the upgrade.
	 */
	reload: boolean;

	constructor(json: JsonObject) {
		super(json);
		this.eta = utility.date(json?.eta as datetime);
		this.reload = !!json?.reload;
	}
}