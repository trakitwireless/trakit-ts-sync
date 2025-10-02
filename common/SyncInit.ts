import { RepSelfGet } from "@trakit/commands";
import { guid, Machine, nothing, url } from "@trakit/objects";
import { SyncBase } from "./SyncBase";
import { SyncType } from "./SyncType";
import { TrakitSocketCommander } from "commands/TrakitSocketCommander";

/**
 * In order to start the {@link Worker}, it needs the {@link trakit.json.RespSelfDetails#ghostId}.
 * @constructor
 * @extends {SyncBase}
 * @param {string=} ghostId
 **/
export class SyncInit extends SyncBase {
	/**
	 * The account to authenticate with; either a {@link Machine}, {@link RepSelfGet} or a session token.
	 */
	account: RepSelfGet | Machine | guid | nothing;
	/**
	 * Trak-iT WebSocket service URL.
	 **/
	socket: url;
	/**
	 * Trak-iT RESTful service URL.
	 **/
	rest: url;

	constructor(account?: Machine | RepSelfGet | guid | nothing, socket?: url | nothing, rest?: url | nothing) {
		super(SyncType.init);
		this.account = account;
		this.socket = socket || TrakitSocketCommander.URI_PROD;
		this.rest = rest || TrakitSocketCommander.URI_PROD;
	}
}