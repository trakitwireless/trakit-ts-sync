import {
	ActionType,
	ErrorCode,
	Payload,
	Reply,
	RepSelfGet,
} from "@trakit/commands";
//import * as commands from "@trakit/commands";
import {
	Asset,
	classes,
	Contact,
	Dashcam,
	DashcamLive,
	email,
	guid,
	IDeserializable,
	IRequestable,
	ISerializable,
	JsonObject,
	Machine,
	objects,
	Session,
	nothing,
	storage,
	ulong,
	url,
	User,
	utility
} from '@trakit/objects';
import { createClientErrorResponse } from "./TrakitCommander";
import { TrakitObjectCommander } from "./TrakitObjectCommander";
import { syncKey } from "./JSON";

/**
 * Maximum time (in milliseconds) to wait before givin up on a command.
 **/
const TIMEOUT_COMMAND = 120 * 1000;
/**
 * Amount of time (in milliseconds) to let the underlying WebSocket idle before sending a noop command.
 **/
const TIMEOUT_NOOP = 300 * 1000;
/**
 * Maximum time (in milliseconds) to wait before trying to re-connect to Trak-iT's WebSocket.
 **/
const TIMEOUT_MAX_RECONNECT = 300 * 1000;

/**
 * Describes the state of the {@link TrakitSocketCommander}'s connection to the Trak-iT WebSocket service.
 */
export enum TrakitSocketStatus {
	/**
	 * A connection is being established and is awaiting the initial {@link RepSelfGet|connectionResponse} message.
	 */
	opening = WebSocket.CONNECTING,
	/**
	 * A connection is established and the {@link RepSelfGet|connectionResponse} message has been received.
	 */
	open = WebSocket.OPEN,
	/**
	 * Either the client or the server has initiated a disconnection.
	 */
	closing = WebSocket.CLOSING,
	/**
	 * The underlying {@link WebSocket} connection has been terminated.
	 */
	closed = WebSocket.CLOSED,
}

/**
 * 
 */
export const CMD_CONNECTION = "connection";
/**
 * 
 */
export const CMD_DISCONNECTION = "dis" + CMD_CONNECTION;

/**
 * 
 */
const MESSAGE_PARSER = /^(get|merge|remove|restore|suspend|revive|multiMerge|multiRemove|clear)?(.+?)(List)?(?:By(.+))?(Merged|Deleted|Suspended|Response)$/i;

function createStoreAction(msgName: string) {
	/*										0	1				2				3		4			5
	getAssetsListResponse					[	'get'			'Assets'		'List'				'Response']
	getAssetsListByDerpResponse				[	'get'			'Assets'		'List'	'Derp'		'Response']
	clearBehaviourLogsByBehaviourResponse	[	'clear'			'BehaviourLogs'			'Behaviour'	'Response']
	mergeAssetResponse						[	'merge'			'Asset'								'Response']
	multiMergeAssetResponse					[	'multiMerge'	'Asset'								'Response']
	removeAssetResponse						[	'remove'		'Asset'								'Response']
	restoreAssetResponse					[	'restore'		'Asset'								'Response']
	suspendAssetResponse					[	'suspend'		'Asset'								'Response']
	reviveAssetResponse						[	'revive'		'Asset'								'Response']
	assetGeneralMerged						[					'assetGeneral'						'Merged']
	assetDeleted							[					'asset'								'Deleted']
	assetSuspended							[					'asset'								'Suspended']
	subscribeResponse						[					'subscribe'							'Response']
	broadcast								null
	sessionEnded							null
	updateOwnContactResponse				[					'updateOwnContact'					'Response']
	updateOwnPasswordResponse				[					'updateOwnPassword'					'Response']
	updateOwnPreferencesResponse			[					'updateOwnPreferences'				'Response']
	loginResponse							[					'login'								'Response']
	logoutResponse							[					'logout'							'Response']
	connectionResponse						[					'connection'						'Response']
	noopResponse							[					'noop'								'Response']
	sessionMachineMerged					[					'sessionMachine'					'Merged']
	sessionGeneralMerged					[					'sessionGeneral'					'Merged']
	sessionAdvancedMerged					[					'sessionAdvanced'					'Merged']
	noopResponse							[					'noop'								'Response']
	*/
	const match = MESSAGE_PARSER.exec(msgName);
	switch (match?.[5]) {
		case "Response":
			switch (match[1]) {
				case "get":
					break;
				case "merge":
				case "multiMerge":
					break;
				case "remove":
				case "multiRemove":
					break;
				case "restore":
					break;
				case "suspend":
					break;
				case "revive":
					break;
			}
			break;
		case "Merged":
			switch (match[2]) {
				case "sessionGeneral":
				case "sessionAdvanced":
					// self stuff
					break;
				default:
					utility.capitalize(match[2]);
					break;
			}
			break;
		case "Deleted":
			break;
		case "Suspended":
			break;
	}
	
	let action: ActionType,
		object: string = utility.capitalize(utility.singularize(match[2])),
		filter: string = match[4] ? utility.capitalize(match[4]) : "",
		batch: boolean = match[1].startsWith("multi");
	if (batch) match[1] = match[1].slice(5);
	switch (match[1]) {
		case "get":
			action = match[3] ? "List" : "Get";
			break;
		case "remove":
			action = "Delete";
			break;
		case "revive":
			action = "Reactivate";
			break;
		default:
			action = utility.capitalize(match[1]) as ActionType;
			break;
	}
	



}

/**
 * Returns a WebSocket command name based on the {@link Payload} type.
 * @param payload 
 * @returns 
 */
function getCommand(payload: Payload): string {
	const action = payload.getAction(),
		error = new Error("no command supported for " + payload.constructor.name, { cause: action });
	switch (action.object) {
		case "Subscription":
			switch (action.kind) {
				case "Merge":
					return "subscribe";
				case "Delete":
					return "unsubscribe";
				case "List":
					return "getSubscriptionsList";
				default:
					throw error;
			}
		case "Self":
			switch (action.filter) {
				case "Get":
					return "getSessionDetails";
				case "Login":
				case "Logout":
					return action.filter.toLowerCase();
				case "Contact":
				case "Password":
				case "Preferences":
					return "updateOwn" + action.filter;
				default:
					throw error;
			}
		case "Session":
			switch (action.kind) {
				case "Get":
				case "List":
					break;  // fall through to default
				case "Delete":
					return "killSession";
				default:
				case "Merge":
				case "Restore":
				case "Suspend":
				case "Reactivate":
					throw error;
			}
			break;
		case "DispatchJob":
			switch (action.filter) {
				case "Cancel":
				case "Change":
					return action.kind.toLocaleLowerCase() + action.object;
			}
	}
	switch (action.kind) {
		case "Get":
		case "Merge":
		case "Restore":
		case "Suspend":
			return action.kind.toLocaleLowerCase() + action.object;
		case "Delete":
			return "remove" + action.object;
		case "Reactivate":
			return "revive" + action.object;
		case "List":
			return "get" + utility.pluralize(action.object) + "List"
				+ (
					(action.filter || "Company") != "Company"
						? "By" + action.filter
						: ""
				);
		default:
			throw error;
	}
}

/**
 * Uses Trak-iT's {@link WebSocket} service to access and manipulate all Trak-iT API Objects.
 **/
export class TrakitSocketCommander extends TrakitObjectCommander<[string, JsonObject]> {
	/**
	 * Production RESTful service URL.
	 * This service is covered by the SLA and should be used for serices and code running in your own production environment.
	 * Both services access the same data-set, so be careful making changes as they will be reflected in production as well.
	 */
	static readonly URI_PROD: url = "wss://socket.trakit.ca/";
	/**
	 * Testing or beta RESTful service URL.
	 * This service is not covered by the SLA and should be used to test your own code before deployment.
	 * Throttling of connections and commands is tighter to help you diagnose issues before switching to production.
	 * Both services access the same data-set, so be careful making changes as they will be reflected in production as well.
	 */
	static readonly URI_BETA: url = "wss://kraken.trakit.ca/";

	#lastConnected: Date = new Date(NaN);
	#lastReceived: Date = new Date(NaN);
	#lastMessage: string = "";
	#lastSent: Date = new Date(NaN);

	/**
	 * Timestamp recorded right after establishing a connection and receiving the `connectionResponse` message.
	 */
	get lastConnected(): Date {
		return this.#lastConnected;
	}
	/**
	 * A timestamp from the last time we received any kind of message from the underlying WebSocket (requested or otherwise).
	 * Does not reset when we send a message, only on receive.
	 * This is used by the keep-alive process.
	 **/
	get lastReceived(): Date {
		return this.#lastReceived;
	}
	/**
	 * The name of the most recent message received by the underlying WebSocket.
	 **/
	get lastMessage(): string {
		return this.#lastMessage;
	}
	/**
	 * Timestamp recorded right after sending the most recent message.
	 */
	get lastSent(): Date {
		return this.#lastSent;
	}

	/**
	 * Returns a {@link TrakitSocketStatus} about the underlying WebSocket.
	 * Also takes into account a null connection, and an open connection that has not yet received the first message.
	 **/
	get state(): TrakitSocketStatus {
		switch (this.#socket?.readyState ?? WebSocket.CLOSED) {
			case 0: return TrakitSocketStatus.opening;
			case 1: return !this.#socketReady ? TrakitSocketStatus.opening : TrakitSocketStatus.open;
			case 2: return TrakitSocketStatus.closing;
			default: return TrakitSocketStatus.closed;
		}
	}
	/**
	 * True when the WebSocket is ready to send and receive messages.
	 * This value can be false if the connection is established, but the account has not authenticated yet, or your password has expired.
	 */
	get ready(): boolean {
		return this.#socketReady
			&& this.#socketOperable;
	}

	/**
	 * Gets invoked any time the WebSocket connection is opened.
	 */
	onOpen: ((this: TrakitSocketCommander, message: RepSelfGet) => any) | null = null;
	/**
	 * Gets invoked any time the WebSocket connection is closed.
	 */
	onClose: ((this: TrakitSocketCommander, message: Reply) => any) | null = null;
	/**
	 * Gets invoked any time a message is received from the WebSocket.
	 */
	onMessage: ((this: TrakitSocketCommander, name: string, message: JsonObject) => any) | null = null;
	/**
	 * Gets invoked any time an error occurs on the WebSocket.
	 */
	onError: ((this: TrakitSocketCommander, message: Reply) => any) | null = null;

	//#region Internal WebSocket control
	/**
	 * Counter used to correlate requests to responses.
	 **/
	#requestId: number = 0;
	/**
	 * A collection of pending command Promises.
	 * Each key is a reqId (except for connection and disconnection) and each value is a function invoked with a {@link Reply} object.
	 **/
	#requestsPending: Map<string | number, (response: JsonObject) => void> = new Map();
	/**
	 * Settles the promise for the given request ID with the provided message content.
	 * @param reqId The ID of the request to settle.
	 * @param msgContent The content of the message to resolve or reject the promise.
	 */
	#requestSettle(reqId: string | number, msgContent: JsonObject): void {
		this.#requestsPending.get(reqId)?.(msgContent);
		this.#requestsPending.delete(reqId);
	}
    
	/**
	 * The underlying WebSocket.
	 **/
	#socket!: WebSocket;
	/**
	 * Marked true after `connectionResponse` message, and the underlying WebSocket is ready to send and receive messages.
	 * Marked false upon disconnection from the underlying WebSocket.
	 **/
	#socketReady: boolean = false;
	/**
	 * Marked true when a valid session (account is valid and password is not expired) is established from `connectionResponse` or `loginResponse`.
	 * If false, the re-connect process will not function, nor will the "noop" keep-alive messages be sent.
	 **/
	#socketOperable: boolean = true;    // defualt true, so that the first connection will auto-reconnect.
    
	/**
	 * Handler for when the underlying WebSocket connection opens.
	 * This handler will reset the keep-alive and re-connect timers, as well as bind message and error handlers (the socket only has open/close hadlers when constructed)
	 * It does not fire the "connection" event, or mark the TrakitSocket as ready, as those things are handled in the onmessage handler.
	 **/
	#socketOpen(event: Event) {
		this.#socket.onopen = null;
		this.#socket.onmessage = (msg) => this.#socketMessage(msg);
		this.#socket.onerror = (err) => this.#socketError(err);
		this.#delayReconnect = 0;
	}
	/**
	 * This is a generic "error" handler for the underlying WebSocket.
	 * Since WebSocket errors are generic and thrown without any detail (at least none documented),
	 * I'm not sure what good this thing will do.
	 **/
	#socketError(event: Event) {
		this.onError?.({
			"errorCode": ErrorCode.service,
			"message": "WebSocket error",
		} as Reply);
	}
	/**
	 * Handler for when the underlyng WebSocket connection is severed.
	 * Will first find all pending command promise settlers and invoke them.
	 * A special case is made for the disconnection Promise and it is marked as successful (if it exists).
	 * This also fires the "disconnection" event, and starts the re-connect timer.
	 **/
	#socketClose(event: CloseEvent) {
		clearTimeout(this.#timerKeepAlive);
		clearTimeout(this.#timerReconnect);
		this.#socketReady = false;
		this.#delayReconnect = this.#delayReconnect
			? this.#delayReconnect * 2
			: this.lastReceived
				? (new Date).valueOf() - this.lastReceived.valueOf()
				: 5000;
		const reconnectTimeout = Math.min(this.#delayReconnect, TIMEOUT_MAX_RECONNECT),
			errorDetails = {
				"kind": "connection",
				"state": TrakitSocketStatus.closed,
				"code": event.code,
				"reason": event.reason,
				"wasClean": event.wasClean,
				"reconnect": this.reconnectEnabled,
				"retry": (new Date).valueOf() + reconnectTimeout,
			},
			response: JsonObject = {
				"errorCode": ErrorCode.success,
				"message": "Disconnected",
				"errorDetails": errorDetails,
			};

		// cancel all commands (sorting into the order in which they were sent, with "disconnection" last)
		for (const reqId of [...this.#requestsPending.keys()].sort()) {
			this.#requestSettle(reqId,
				reqId === CMD_DISCONNECTION
					? response
					: {
						...response,
						"reqId": reqId,
						"errorCode": ErrorCode.unknown,
						"errorDetails": {
							...errorDetails,
						},
					}
			);
		}

		// fire event
		this.onClose?.(new Reply(response));

		// start reconnect timer
		this.#timerReconnect = this.reconnectEnabled
			&& this.#socketOperable
			? setTimeout(
				() => this.open(),
				reconnectTimeout,
				this
			)
			: 0;

		(this.#socket as any) =
			this.#socket.onopen =
			this.#socket.onerror =
			this.#socket.onclose =
			this.#socket.onmessage = null;
	}
	/**
	 * Handler for when the underlyng WebSocket receives a message.
	 * Each message is formatted as {messageName}(space){JSON Object}.
	 * Some specific messages (such as connection, getSessionDetails, login, logout, noop, sessionEnded, and updateOwnPassword) are handled with special cases.
	 * After special handling, a "message" event is (optionally, depending on the message name) fired, then the Promise resolver (if it exists) is invoked.
	 * This handler also fires the "connection" event, not the onopen handler.
	 **/
	#socketMessage(event: MessageEvent<string>) {
		this.#lastReceived = new Date;

		/**
		 * The name of the message received by the underlying WebSocket.
		 * This value is only changed for the "connectionResponse" to "connection" to properly fire that event.
		 **/
		const msgName = event.data.substring(0, event.data.indexOf(" "));
		/**
		 * The JSON parsed from the message received by the underlying WebSocket.
		 **/
		const msgContent = JSON.parse(event.data.substring(msgName.length + 1)) as JsonObject;
	
		// first, set this value
		this.#lastMessage = msgName;
		switch (msgName) {
			case "connectionResponse":
				this.#socketAccount(msgContent);
				this.#lastConnected = new Date(this.#lastReceived);
				this.#socketReady = true;
				// Promise is settled here, not below
				this.#requestSettle(CMD_CONNECTION, msgContent);
				// then we fire event here, not below
				this.onOpen?.(this.account);
				break;
			case "loginResponse":
			case "getSessionDetailsResponse":
				this.#socketAccount(msgContent);
				break;
			case "updateOwnPasswordResponse":
				this.#socketOperable = msgContent["errorCode"] === 0;
				break;
			case "sessionMachineMerged":
				this.account.machine?.fromJSON(msgContent);
				break;
			case "sessionGeneralMerged":
				this.account.user?.general?.fromJSON(msgContent);
				break;
			case "sessionAdvancedMerged":
				this.account.user?.advanced?.fromJSON(msgContent);
				break;
			case "logoutResponse":
			case "sessionEnded":
				this.#socketAccount(msgContent);
				this.close();
				break;
		}

		const objectName = MESSAGE_PARSER.exec(msgName) ?? [];
		if (objectName.length > 1) {



			// we need something better
			


			if (objectName[2]) {
				// it's a list response
			} else {
				this.#socketMerged(
					objectName[1] + (msgContent["errorCode"] === 0 ? "Merged" : "Deleted"),
					msgContent
				);
			}
		}

		/**
		 * For the "connectionResponse", because already fired the "onOpen" event instead of the "message" event.
		 * For the "noopResponse", because the "no operation" messages do not need an event.
		 **/
		if (!(msgName === "connectionResponse" || msgName === "noopResponse")) {
			/**
			 * The function that will settle (resolve or reject) the Promise for the pending command.
			 **/
			this.#requestSettle(msgContent["reqId"] as number, msgContent);

			/**
			 * Fires the "message" event.
			 */
			this.onMessage?.(msgName, msgContent);
		}

		// lastly, reset keep-alive process
		// because, the #socketOperable is only set to true during the switch/case, and this will only re-activate if it's true
		this.resetKeepAlive();
	}
	/**
	 * Updates the account information based on the received message content.
	 * @param msgContent The JSON object containing the account information.
	 */
	#socketAccount(msgContent: JsonObject): void {
		const msgUser = { ...msgContent.user as JsonObject },
			msgContact = msgUser.contact as JsonObject,
			msgMachine = msgContent.machine as JsonObject;
		if (msgContent.user) {
			if (msgContact) {
				this.#socketMerged("contactMerged", msgContact);
				msgUser.contact = msgContact["id"];
			}
			this.#socketMerged("userMerged", msgUser);
		}
		if (msgMachine) this.#socketMerged("machineMerged", msgMachine);
		this.setAuth(new RepSelfGet(msgContent));
		this.#socketOperable = this.account.errorCode === 0
			&& !this.account.user?.passwordExpired;
	}

	/**
	 * This needs to be moved somewhere generic to be used by REST service as well.
	 * Might be a way to import the HIERARCHY#SyncClient_merged from Medusa.
	 * @param msgName 
	 * @param msgContent 
	 */
	#socketMerged(msgName: string, msgContent: JsonObject): void {
		let typeName = msgName[0].toUpperCase() + msgName.slice(1).replace(MESSAGE_PARSER, "") as classes,
			merge: () => void = () => {
				const key = syncKey(msgContent, typeName),
					map = storage[typeName],
					obj = map.get(key) as IRequestable & IDeserializable;
				if (obj) {
					obj.fromJSON(msgContent);
				} else {
					const init = new objects[typeName]() as IRequestable & IDeserializable;
					init.fromJSON(msgContent);
					map.set(key, init);
				}
			};
		switch (typeName as string) {
			case "CompanyLabels":
				typeName = "CompanyStyle";
				break;
			case "CompanyPolicies":
				typeName = "CompanyPolicy";
				break;
			case "Session":
				merge = () => {
					storage.Session.set(
						syncKey(msgContent, typeName),
						Session.fromJSON(msgContent)
					);
				};
				break;
		}
		merge();
	}
	//#endregion Internal WebSocket control

	//#region Reconnection
	/**
	 * Flag set to specifically allow automatic re-connection to Trak-iT's WebSocket.
	 * This value is set to false in the message handler if the connectionResponse message does not have an errorCode zero.
	 * Conversly, it is set to true if a login or password change is successful.
	 **/
	reconnectEnabled: boolean = true;
	/**
	 * The amount of time (in milliseconds) to wait before trying to re-connect.
	 * This time doubles with every attempt, and maxes out at {@link TIMEOUT_MAX_RECONNECT}.
	 **/
	#delayReconnect: number = 0;
	/**
	 * Handle for the timer associated with performing the waiting operation.
	 **/
	#timerReconnect: number = 0;
	//#endregion Reconnection

	//#region Keep-Alive
	/**
	 * Flag set to specifically send "noop" messages on a timer to ensure the firewall doesn't prematurely kill the underlying WebSocket.
	 **/
	keepAliveEnabled: boolean = false;
	/**
	 * Handle for the timer associated with performing the keep-alive operation.
	 **/
	#timerKeepAlive: number = 0;
	//#endregion Keep-Alive

	constructor(
		baseAddress?: URL | url | nothing,
		account?: RepSelfGet | { machine: { key: string } }
			| Machine | { key: string }
			| { ghostId: guid }
			| guid
			| nothing
	) {
		super(baseAddress ?? TrakitSocketCommander.URI_PROD, account);
	}
	/**
	 * Disconnects the underlying WebSocket, unbinds all event-handlers, and clears any circular binds.
	 */
	dispose(): void {
		this.#socketOperable = false;	// prevent re-connect
		this.close().finally(() => {
			(this.#socket as any) =
				(this.#requestsPending as any) = null;
		});
	}

	/**
	 * Creates a new underlying WebSocket and returns a Promise that resolves when the connectionResponse message is received.
	 * If the underlying WebSocket is not closed (as in, any state of openning or being closed), the returned Promise will be rejected.
	 **/
	open(): Promise<RepSelfGet> {
		clearTimeout(this.#timerReconnect);
		this.#timerReconnect = 0;
		return new Promise<RepSelfGet>(async (resolve, reject) => {
			const state = this.state;
			switch (state) {
				case TrakitSocketStatus.closed:
					const endpoint = this.createBaseUrl();
					if (this.account.machine) {
						endpoint.searchParams.delete("shadowKey");
						if (this.account.machine.secret?.length) {
							endpoint.searchParams.delete("shadowSig");// sign without key or sig
							endpoint.searchParams.append("shadowSig", await this.account.machine.createHmacSignature(endpoint));
						}
						endpoint.searchParams.append("shadowKey", this.account.machine.key);
					} else if (this.account.ghostId) {
						endpoint.searchParams.set("ghostId", this.account.ghostId);
					}
					this.#socket = new WebSocket(endpoint);
					this.#socket.onopen = (ev) => this.#socketOpen(ev);
					this.#socket.onclose = (ev) => this.#socketClose(ev);
					this.#requestsPending.set(CMD_CONNECTION, (response: JsonObject) => {
						(response["errorCode"] === 0 ? resolve : reject)(this.account as RepSelfGet);
					});
					break;
				default:
					reject(new RepSelfGet({
						"errorCode": ErrorCode.unknown,
						"message": "WebSocket not closed",
						"errorDetails": {
							"kind": "connection",
							"connection": state,
						}
					}));
					break;
			}
		});
	}
	/**
	 * Closes the underlying WebSocket connection, and returns a Promise that resolves when the connection is confirmed to be closed.
	 * If the underlying WebSocket is not open (as in, any state of openning or being closed), the returned Promise will be rejected.
	 **/
	close(): Promise<Reply> {
		return new Promise<Reply>((resolve, reject) => {
			const state = this.state;
			switch (state) {
				case TrakitSocketStatus.open:
					this.reconnectEnabled = false;
					this.#requestsPending.set(CMD_DISCONNECTION, (response: JsonObject) => {
						(response["errorCode"] === 0 ? resolve : reject)(new Reply(response));
					});
					this.#socket.close(1000, "Bye!");
					break;
				default:
					reject(new Reply({
						"errorCode": ErrorCode.unknown,
						"message": "WebSocket not open",
						"errorDetails": {
							"kind": "connection",
							"connection": state,
						},
					}));
					break;
			}
		});
	}

	/**
	 * Creates a request object for the specified payload.
	 * @param payload The payload to include in the request.
	 * @returns A request object configured with the specified parameters.
	 */
	override _createRequest(payload: Payload): [string, JsonObject] {
		return [
			getCommand(payload),
			payload.toJSON(),
		];
	}
	/**
	 * Sends a command and parameters to Trak-iT's WebSocket service.
	 * If the underlying WebSocket is not open (as in, any state of openning or being closed), the returned Promise will be rejected.
	 * IF the command is sent, and a response received, even an error, the Promise is resolved.
	 * @param command	The name of the command to send.
	 * @param params	Optional object or value for the command.
	 * @returns 		A Promise which is resolved when a response is received, otherwise it is rejected.
	 **/
	override _relayRequest(request: [string, JsonObject]): Promise<JsonObject> {
		const command = request[0],
			params = request[1] || {};
		return new Promise((resolve, reject) => {
			// get the socket state inside the resolver because it could be invoked multiple times.
			const state = this.state;
			switch (state) {
				case TrakitSocketStatus.open:
					const reqId = ++this.#requestId,
						timer = setTimeout(
							() => this.#requestSettle(reqId, {
								"reqId": reqId,
								"errorCode": ErrorCode.unknown,
								"message": "Command timeout",
							}),
							TIMEOUT_COMMAND
						);
					params.reqId = reqId;
					this.#requestsPending.set(reqId, (response: JsonObject) => {
						clearTimeout(timer);
						resolve(response);
					});
					try {
						this.#socket.send(command + " " + JSON.stringify(params));
					} catch (ex: Error | any) {
						this.#requestSettle(reqId, createClientErrorResponse(ex));
					}
					this.resetKeepAlive();
					break;
				case TrakitSocketStatus.closed:
					this.open().then(() => this._relayRequest(request).then(resolve)).catch(reject);
					break;
				default:
					reject({
						"errorCode": ErrorCode.unknown,
						"message": "Not connected",
						"errorDetails": {
							"kind": "connection",
							"connection": state,
						},
					});
					break;
			}
		});
	}
	/**
	 * Resets the keep-alive timer (to try and keep the firewall from disconnecting the underlying WebSocket).
	 **/
	resetKeepAlive(): Promise<boolean> {
		clearTimeout(this.#timerKeepAlive);
		this.#timerKeepAlive = this.keepAliveEnabled
			&& this.#socketOperable
			? setTimeout(
				() => this._relayRequest(["noop", {}]),
				TIMEOUT_NOOP
			)
			: 0;
		return Promise.resolve(this.#timerKeepAlive !== 0);
	}
}