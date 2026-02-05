import {
	ErrorCode,
	Payload,
	PaySubscriptionDelete,
	PaySubscriptionList,
	PaySubscriptionMerge,
	Reply,
	ReplySync,
	ReplySyncGet,
	RepSelfGet,
	RepSubscription,
	RepSubscriptionList,
	SubscriptionType
} from "@trakit/commands";
import {
	guid,
	int,
	IRequestable,
	JsonObject,
	Machine,
	nothing,
	storage,
	ulong,
	url
} from '@trakit/objects';
import {
	createClientErrorResponse,
	getJsonKeyValue,
	makeObjectName,
	makeReplyClass
} from "../API/Functions";
import { TrakitObjectCommander } from "../API/TrakitObjectCommander";
import { MSG_SYNC } from "./Constants";
import { makeCommandName } from "./Functions";

/**
 * Maximum time (in milliseconds) to wait before givin up on a command.
 */
const TIMEOUT_COMMAND = 120 * 1000;
/**
 * Amount of time (in milliseconds) to let the underlying WebSocket idle before sending a noop command.
 */
const TIMEOUT_NOOP = 300 * 1000;
/**
 * Maximum time (in milliseconds) to wait before trying to re-connect to Trak-iT's WebSocket.
 */
const TIMEOUT_MAX_RECONNECT = 300 * 1000;
/**
 * Name of the connection "command", where we expect a connectionResponse message upon establishing a connection.
 * Used to resolve the Promise returned by {@link TrakitSocketCommander.open}.
 */
const CMD_CONNECTION = "connection";
/**
 * Name of the disconnection "command", where we resolve all pending commands upon disconnection as failed.
 * Also used to resolve the Promise returned by {@link TrakitSocketCommander.close}.
 */
const CMD_DISCONNECTION = "dis" + CMD_CONNECTION;

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
 * Uses Trak-iT's {@link WebSocket} service to access and manipulate Trak-iT API objects.
 */
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

	// last time a connection was established (with a connectionResponse message).
	#lastConnected: Date = new Date(NaN);
	// last time any message was received.
	#lastReceived: Date = new Date(NaN);
	// name of the last message received.
	#lastMessage: string = "";
	// last time any message was sent.
	#lastSent: Date = new Date(NaN);

	/**
	 * Timestamp recorded right after establishing a connection and receiving the `connectionResponse` message.
	 */
	get lastConnected(): Date { return this.#lastConnected; }
	/**
	 * A timestamp from the last time we received any kind of message from the underlying WebSocket (requested or otherwise).
	 * Does not reset when we send a message, only on receive.
	 * This is used by the keep-alive process.
	 */
	get lastReceived(): Date { return this.#lastReceived; }
	/**
	 * The name of the most recent message received by the underlying WebSocket.
	 */
	get lastMessage(): string { return this.#lastMessage; }
	/**
	 * Timestamp recorded right after sending the most recent message.
	 */
	get lastSent(): Date { return this.#lastSent; }
	/**
	 * Returns a {@link TrakitSocketStatus} about the underlying WebSocket.
	 * Also takes into account a null connection, and an open connection that has not yet received the first message.
	 */
	get state(): TrakitSocketStatus {
		switch (this.#socket?.readyState) {
			case WebSocket.CONNECTING: return TrakitSocketStatus.opening;
			case WebSocket.OPEN: return !this.#socketReady ? TrakitSocketStatus.opening : TrakitSocketStatus.open;
			case WebSocket.CLOSING: return TrakitSocketStatus.closing;
			default: return TrakitSocketStatus.closed;
		}
	}
	/**
	 * True when the WebSocket is ready to send and receive messages.
	 * This value can be false if the connection is established, but the account has not authenticated yet, or your password has expired.
	 */
	get ready(): boolean { return this.#socketReady && this.#socketOperable; }

	/**
	 * Gets invoked any time the WebSocket connection is established and the `connectionResponse` message is received.
	 */
	onOpen?: ((this: TrakitSocketCommander, account: RepSelfGet) => any) | nothing;
	/**
	 * Gets invoked any time the WebSocket connection is closed.
	 */
	onClose?: ((this: TrakitSocketCommander, reply: Reply) => any) | nothing;
	/**
	 * Gets invoked any time a message is received by the Trak-iT WebSocket connection.
	 * This is useful for logging or debugging, but you should use the {@link onUpdate}, {@link onDelete},
	 * and {@link onList} events to track changes to objects.
	 */
	onMessage?: ((this: TrakitSocketCommander, name: string, body: JsonObject) => any) | nothing;
	/**
	 * Gets invoked any time an error occurs on the WebSocket.
	 */
	onError?: ((this: TrakitSocketCommander, reply: Reply) => any) | nothing;

	//#region Internal WebSocket control
	/**
	 * Counter used to correlate requests to responses.
	 */
	#requestId: number = 0;
	/**
	 * A collection of pending command Promises.
	 * Each key is a reqId (except for connection and disconnection) and each value is a function invoked with a {@link Reply} object.
	 */
	#requestsPending: Map<string | number, (response: JsonObject) => void> = new Map();
	/**
	 * Settles the promise for the given request ID with the provided message content.
	 * @param reqId The ID of the request to settle.
	 * @param msgContent The content of the message to resolve or reject the promise.
	 */
	#requestSettle(reqId: string | number, msgContent: JsonObject): boolean {
		this.#requestsPending.get(reqId)?.(msgContent);
		return this.#requestsPending.delete(reqId);
	}
    
	/**
	 * The underlying WebSocket.
	 */
	#socket!: WebSocket;
	/**
	 * Marked true after `connectionResponse` message, and the underlying WebSocket is ready to send and receive messages.
	 * Marked false upon disconnection from the underlying WebSocket.
	 */
	#socketReady: boolean = false;
	/**
	 * Marked true when a valid session (account is valid and password is not expired) is established from `connectionResponse` or `loginResponse`.
	 * If false, the re-connect process will not function, nor will the "noop" keep-alive messages be sent.
	 */
	#socketOperable: boolean = true;    // defualt true, so that the first connection will auto-reconnect.
    
	/**
	 * Handler for when the underlying WebSocket connection opens.
	 * This handler will reset the keep-alive and re-connect timers, as well as bind message and error handlers (the socket only has open/close hadlers when constructed)
	 * It does not fire the "connection" event, or mark the TrakitSocket as ready, as those things are handled in the onmessage handler.
	 */
	#socketOpen(event: Event) {
		this.#socket.onopen = null;
		this.#socket.onmessage = (msg) => this.#socketMessage(msg);
		this.#delayReconnect = 0;
	}
	/**
	 * This is a generic "error" handler for the underlying WebSocket.
	 * Since WebSocket errors are generic and thrown without any detail (at least none documented),
	 * I'm not sure what good this thing will do.
	 */
	#socketError(event: Event) {
		this.onError?.(new Reply({
			"errorCode": ErrorCode.service,
			"message": "WebSocket error",
			"errorDetails": {
				"kind": "connection",
				"state": this.state,
				"reconnect": this.reconnectEnabled,
			}
		}));
	}
	/**
	 * Handler for when the underlyng WebSocket connection is severed.
	 * Will first find all pending command promise settlers and invoke them.
	 * A special case is made for the disconnection Promise and it is marked as successful (if it exists).
	 * This also fires the "disconnection" event, and starts the re-connect timer.
	 */
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
	 */
	#socketMessage(event: MessageEvent<string>) {
		this.#lastReceived = new Date;

		/**
		 * The name of the message received by the underlying WebSocket.
		 * This value is only changed for the "connectionResponse" to "connection" to properly fire that event.
		 */
		const msgName = event.data.substring(0, event.data.indexOf(" "));
		/**
		 * The JSON parsed from the message received by the underlying WebSocket.
		 */
		const msgContent = JSON.parse(event.data.substring(msgName.length + 1)) as JsonObject;
		
		// first, set this value
		this.#lastMessage = msgName;
		/**
		 * Some command responses are considered "transparent" and do not fire the "onMessage" event.
		 * The "connectionResponse" because it fires "onOpen" instead of the "onMessage".
		 * The "noopResponse", because the "no operation" messages do not need an event.
		 */
		if (!(msgName === "connectionResponse" || msgName === "noopResponse")) {
			this.onMessage?.(msgName, msgContent);
		}

		// then, handle special messages
		switch (msgName) {
			case "connectionResponse":
				this.#socketAccount(msgContent);
				this.#lastConnected = new Date(this.#lastReceived);
				this.#socketReady = true;
				// Promise is settled here, not below
				this.#requestSettle(CMD_CONNECTION, msgContent);
				// then we fire event here, not below
				this.onAccount?.(this.account);
				this.onOpen?.(this.account);
				break;
			case "loginResponse":
			case "getSessionDetailsResponse":
				this.#socketAccount(msgContent);
				this.onAccount?.(this.account);
				break;
			case "updateOwnPasswordResponse":
				if (!this.#socketOperable) {
					this.#socketOperable = msgContent["errorCode"] === 0;
				}
				break;
			case "sessionMachineMerged":
				this.account.machine?.fromJSON(msgContent);
				this.onAccount?.(this.account);
				break;
			case "sessionGeneralMerged":
				this.account.user?.general?.fromJSON(msgContent);
				this.onAccount?.(this.account);
				break;
			case "sessionAdvancedMerged":
				this.account.user?.advanced?.fromJSON(msgContent);
				this.onAccount?.(this.account);
				break;
			case "logoutResponse":
				this.close();
			// no break
			case "sessionEnded":
				this.#socketAccount(msgContent);
				this.#socketOperable = false;
				this.onAccount?.(this.account);
				break;
		}

		// handle command promise settlement
		if (msgName.endsWith("Response")) {
			this.#requestSettle(msgContent["reqId"] as int, msgContent);
		} else if (!msgName.startsWith("session")) {
			// fire the sync events for other messages (ie; __Merged, __Deleted, and __Suspended)
			// ignore self stuff (ie; session__Merged)
			const msgMatch = MSG_SYNC.exec(msgName) as string[];
			if (msgMatch?.length) this.#socketSync(msgMatch as [unknown, string, string], msgContent);
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
				this.#socketSync([, "contact", "Merged"], msgContact);
				msgUser.contact = msgContact["id"];
			}
			this.#socketSync([, "user", "Merged"], msgUser);
		}
		if (msgMachine) {
			this.#socketSync([, "machine", "Merged"], msgMachine);
		}
		this.setAuth(new RepSelfGet(msgContent));
		this.#socketOperable = this.account.errorCode === 0
			&& !this.account.user?.passwordExpired;
	}
	/**
	 * Constructs a {@link ReplySync} object based on the message name,
	 * stores the content in the {@link storage},
	 * and fires the appropriate update/delete events.
	 * @param msgMatch 
	 * @param msgContent 
	 * @returns 
	 */
	#socketSync(msgMatch: [unknown, string, string], msgContent: JsonObject): ReplySync | nothing {
		const type = makeObjectName(msgMatch[1]),
			companyId = msgContent[type.startsWith("Company") ? "parent" : "company"] as ulong,
			SyncReply = makeReplyClass(
				type,
				msgMatch[2] === "Merged"
					? "Get"
					: msgMatch[2].slice(0, -1).slice(0, 7)
			);
		if (SyncReply) {
			const reply = new SyncReply({
				"errorCode": ErrorCode.success,
				"message": msgMatch[2] + " event",
				[msgMatch[1]]: msgContent,
			}) as ReplySync;
			if (reply.store()) {
				switch (msgMatch[2]) {
					case "Merged":
					case "Suspended":
						const object = (reply as ReplySyncGet<IRequestable>).getObject?.();
						if (object) this.onUpdate?.(type, companyId, object);
						break;
					case "Deleted":
						this.onDelete?.(type, companyId, getJsonKeyValue(msgContent, type));
						break;
				}
			}
			return reply;
		}
	}
	//#endregion Internal WebSocket control

	//#region Reconnection
	/**
	 * Flag set to specifically allow automatic re-connection to Trak-iT's WebSocket.
	 * This value is set to false in the message handler if the connectionResponse message does not have an errorCode zero.
	 * Conversly, it is set to true if a login or password change is successful.
	 */
	reconnectEnabled: boolean = true;
	/**
	 * The amount of time (in milliseconds) to wait before trying to re-connect.
	 * This time doubles with every attempt, and maxes out at {@link TIMEOUT_MAX_RECONNECT}.
	 */
	#delayReconnect: number = 0;
	/**
	 * Handle for the timer associated with performing the waiting operation.
	 */
	#timerReconnect: number = 0;
	//#endregion Reconnection

	//#region Keep-Alive
	/**
	 * Flag set to specifically send "noop" messages on a timer to ensure the firewall doesn't prematurely kill the underlying WebSocket.
	 */
	keepAliveEnabled: boolean = false;
	/**
	 * Handle for the timer associated with performing the keep-alive operation.
	 */
	#timerKeepAlive: number = 0;
	//#endregion Keep-Alive

	constructor(
		account?: RepSelfGet | { machine: { key: string } }
				| Machine | { key: string }
				| { ghostId: guid }
				| guid
				| nothing,
		baseAddress?: URL | url | nothing,
	) {
		super(account, baseAddress ?? TrakitSocketCommander.URI_PROD);
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
	 */
	open(): Promise<RepSelfGet> {
		clearTimeout(this.#timerReconnect);
		this.#timerReconnect = 0;
		return new Promise<RepSelfGet>(async (resolve, reject) => {
			const state = this.state;
			switch (state) {
				case TrakitSocketStatus.closed:
					const endpoint = this.createBaseUrl();
					this.#socket = new WebSocket(
						endpoint,
						this.account.machine
							? (
								this.account.machine.secret?.length
									? "HMAC256#" + btoa(
										this.account.machine.key
										+ ":"
										+ (await this.account.machine.createHmacSignature(endpoint))
									)
									: "MACHINE#" + btoa(
										this.account.machine.key
									)
							)
								.replaceAll("/", "|")
								.replace(/=*$/, "")
							: (
								this.account.ghostId
								|| undefined
							)
					);
					this.#socket.onopen = (ev) => this.#socketOpen(ev);
					this.#socket.onerror = (ev) => this.#socketError(ev);
					this.#socket.onclose = (ev) => this.#socketClose(ev);
					this.#requestsPending.set(CMD_CONNECTION, (response: JsonObject) => {
						(response["errorCode"] === 0 ? resolve : reject)(this.account);
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
	 */
	close(): Promise<Reply> {
		return new Promise<Reply>((resolve, reject) => {
			const state = this.state;
			switch (state) {
				case TrakitSocketStatus.opening:
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
			makeCommandName(payload),
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
	 */
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
	 */
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

	//#region Subscriptions
	/**
	 * Subscribes to the specified subscription types for the given company.
	 * @param companyId 
	 * @param subscriptions 
	 * @returns 
	 */
	subscribe(companyId: ulong, subscriptions: SubscriptionType[]): Promise<RepSubscription> {
		return subscriptions?.length
			? this.command(new PaySubscriptionMerge({
				company: companyId,
				subscriptionTypes: subscriptions,
			}))
			: Promise.resolve(new RepSubscription({
				"errorCode": ErrorCode.success,
				"message": "No subscriptions specified",
			}));
	}
	/**
	 * Unsubscribes from the specified subscription types for the given company.
	 * @param companyId 
	 * @param subscriptions 
	 * @returns 
	 */
	unsubscribe(companyId: ulong, subscriptions: SubscriptionType[]): Promise<RepSubscription> {
		return subscriptions?.length
			? this.command(new PaySubscriptionDelete({
				company: companyId,
				subscriptionTypes: subscriptions,
			}))
			: Promise.resolve(new RepSubscription({
				"errorCode": ErrorCode.success,
				"message": "No subscriptions specified",
			}));
	}
	/**
	 * Retrieves the list of active subscriptions for the current account.
	 * @returns 
	 */
	listSubscriptions(): Promise<RepSubscriptionList> {
		return this.command(new PaySubscriptionList());
	}
	//#endregion Subscriptions
}