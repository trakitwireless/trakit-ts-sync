import { nothing } from "@trakit/objects";
import { SyncBase } from "./SyncBase";
import { SyncType } from "./SyncType";

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
	/**
	 * Trak-iT WebSocket service URL.
	 **/
	socket: string;
	/**
	 * Trak-iT RESTful service URL.
	 **/
	rest: string;

	constructor(ghostId: string | nothing, socket: string | nothing, rest?: string | nothing) {
		super(SyncType.init);
		this.ghostId = ghostId || "";
		this.socket = socket || "";
		this.rest = rest || "";
	}
}