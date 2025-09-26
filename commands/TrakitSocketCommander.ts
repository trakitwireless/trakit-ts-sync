import {
	ErrorCode,
	Payload,
	Reply,
	RepSelfGet,
	SelfMachine,
	SelfUser,
	SelfUserAdvanced,
	SelfUserGeneral,
	TrakitObjectCommander,
} from "@trakit/commands";
import {
	utility,
	nothing,
} from '@trakit/objects';
import { TrakitSocketStatus } from "./TrakitSocketStatus";

/**
 * Production {@link WebSocket} service URL.
 * This service is covered by the SLA and should be used for serices and code running in your own production environment.
 * Both services access the same data-set, so be careful making changes as they will be reflected in production as well.
 */
export const URI_PROD = "wss://socket.trakit.ca/";  
/**
 * Testing or beta {@link WebSocket} service URL.
 * This service is not covered by the SLA and should be used to test your own code before deployment.
 * Throttling of connections and commands is tighter to help you diagnose issues before switching to production.
 * Both services access the same data-set, so be careful making changes as they will be reflected in production as well.
 */
export const URI_BETA = "wss://kraken.trakit.ca/";  

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
 * 
 */
export const CMD_CONNECTION = "connection";
/**
 * 
 */
export const CMD_DISCONNECTION = "dis" + CMD_CONNECTION;

/**
 * command name reply suffix and unknown command response name
 */
const RESPONSE_SUFFIX = "Response",
    UNKNOWN_COMMAND = "unknownCommand" + RESPONSE_SUFFIX;

/**
 * Returns a WebSocket command name based on the {@link Payload} type.
 * @param payload 
 * @returns 
 */
function getCommandName(payload: Payload): string {
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
					return "getSessionDetails";
				case "Delete":
					return "killSession";
			}
			break;
	}
	switch (action.kind) {
		case "Get":
		case "Merge":
		case "Restore":
		case "Suspend":
		case "Cancel":
		case "Change":
			return action.kind.toLocaleLowerCase() + action.object;
		case "Delete":
			return "remove" + action.object;
		case "Reactivate":
			return "revive" + action.object;
		case "List":
			return "get" + utility.plural(action.object) + "List"
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
export class TrakitSocketCommander extends TrakitObjectCommander {
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
        switch (this.#socket?.readyState ?? 3) {
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
     * 
     * @param payload 
     * @returns 
     */
    override command<TReply extends Reply>(payload: Payload): Promise<TReply> {
        return this.send(getCommandName(payload), payload);
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
    onMessage: ((this: TrakitSocketCommander, name: string, message: any) => any) | null = null;
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
    #requests: Map<string | number, <TReply extends Reply>(response: TReply) => void> = new Map();
    
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
    #socketOperable: boolean = true;	// defualt true, so that the first connection will auto-reconnect.
    
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
                ? new Date().valueOf() - this.lastReceived.valueOf()
                : 5000;
        const reconnectTimeout = Math.min(this.#delayReconnect, TIMEOUT_MAX_RECONNECT),
            errorDetails = {
                "code": event.code,
                "reason": event.reason,
                "wasClean": event.wasClean,
                "reconnect": this.reconnectEnabled,
                "retry": new Date().valueOf() + reconnectTimeout,
            },
            response: any = {
                "errorCode": ErrorCode.unknown,
                "message": "Disconnected",
                "errorDetails": errorDetails,
            };

        // cancel all commands
        this.#requests.forEach((settler, key) => {
            response.errorCode = key === CMD_DISCONNECTION ? 0 : 1;
            if (key = utility.id(key)) response["reqId"] = key;
            settler(response);
        });

        delete response["reqId"];
        response.errorCode = ErrorCode.unknown;
        this.onClose?.(response);

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
         * Will fire an event of the message name when true (default).
         * This value is only set to false for "noopResponse".
         **/
        let msgEvent = true;
        /**
         * The name of the message received by the underlying WebSocket.
         * This value is only changed for the "connectionResponse" to "connection" to properly fire that event.
         **/
        const msgName = event.data.substring(0, event.data.indexOf(" "));
        /**
         * The JSON parsed from the message received by the underlying WebSocket.
         **/
        const msgContent = JSON.parse(event.data.substring(msgName.length + 1));

        // first, set this value
        this.#lastMessage = msgName;
        switch (msgName) {
            case "connectionResponse":
                this.#lastConnected = new Date(this.#lastReceived);
                this.setAuth(this.account = new RepSelfGet(msgContent));
                this.#socketOperable = msgContent["errorCode"] === 0;
                this.#socketReady = true;
                // Promise is settled here, not below
                this.#requests.get(CMD_CONNECTION)?.(msgContent);
                // then we fire event here, not below
                this.onOpen?.(msgContent);
                // because we are firing the "connection" event instead of the "message" event at the end.
                msgEvent = false;
                break;
            case "loginResponse":
            case "getSessionDetailsResponse":
                this.setAuth(this.account = new RepSelfGet(msgContent));
                this.#socketOperable = this.account.errorCode === 0
                    && !this.account.user?.passwordExpired;
                break;
            case "updateOwnPasswordResponse":
                this.#socketOperable = msgContent["errorCode"] === 0;
                break;
            case "sessionMachineMerged":
                (this.account as RepSelfGet).machine = new SelfMachine(msgContent);
                break;
            case "sessionGeneralMerged":
                ((this.account as RepSelfGet).user as SelfUser).general = new SelfUserGeneral(msgContent);
                break;
            case "sessionAdvancedMerged":
                ((this.account as RepSelfGet).user as SelfUser).advanced = new SelfUserAdvanced(msgContent);
                break;
            case "noopResponse":
                // the "no operation" messages do not need an event
                msgEvent = false;
                break;
            case "logoutResponse":
            case "sessionEnded":
                this.close();
                break;
        }

        /**
         * The function that will settle (resolve or reject) the Promise for the pending command.
         **/
        const settler = this.#requests.get(msgContent["reqId"]);
        if (settler) settler(msgContent);

        // fire message event
        if (msgEvent) {
            this.onMessage?.(msgName, msgContent);
        }

        // lastly, reset keep-alive process
        // because, the __operable is only set to true during the switch/case, and this will only re-activate if it's true
        this.resetKeepAlive();
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
    keepAliveEnabled: boolean = true;
    /**
     * Handle for the timer associated with performing the keep-alive operation.
     **/
    #timerKeepAlive: number = 0;
    //#endregion Keep-Alive

    constructor(url?: string, ghostId?: string | nothing) {
        super(url || URI_PROD);
        if (ghostId) this.query.set("ghostId", ghostId);
    }
    /**
     * Disconnects the underlying WebSocket, unbinds all event-handlers, and clears any circular binds.
     */
    dispose(): void {
        this.#socketOperable = false;	// prevent re-connect
        this.close().finally(() => {
            (this.#socket as any) =
                (this.#requests as any) = null;
        });
    }

    /**
     * Creates a new underlying WebSocket and returns a Promise that resolves when the connectionResponse message is received.
     * If the underlying WebSocket is not closed (as in, any state of openning or being closed), the returned Promise will be rejected.
     **/
    open() {
        clearTimeout(this.#timerReconnect);
        this.#timerReconnect = 0;
        return new Promise<RepSelfGet>(async (resolve, reject) => {
            const state = this.state;
            switch (state) {
                case TrakitSocketStatus.closed:
                    const reqId = CMD_CONNECTION,
                        endpoint = this.createBaseUrl();
                    if (this.account?.ghostId) {
                        endpoint.searchParams.append("ghostId", this.account.ghostId);
                    } else if (this.account?.machine) {
                        endpoint.searchParams.append("shadowSig", await this.account.machine.createHmacSignature(endpoint));
                        endpoint.searchParams.append("shadowKey", this.account.machine.key);    // sign without key
                    }
                    this.#socket = new WebSocket(endpoint);
                    this.#socket.onopen = (ev) => this.#socketOpen(ev);
                    this.#socket.onclose = (ev) => this.#socketClose(ev);
                    this.#requests.set(reqId, (response: Reply) => {
                        this.#requests.delete(reqId);
                        (response.errorCode === 0 ? resolve : reject)(response as RepSelfGet);
                    });
                    break;
                default:
                    reject({
                        "errorCode": ErrorCode.unknown,
                        "message": "WebSocket not closed",
                        "errorDetails": {
                            "connection": state,
                        }
                    });
                    break;
            }
        });
    }
    /**
     * Closes the underlying WebSocket connection, and returns a Promise that resolves when the connection is confirmed to be closed.
     * If the underlying WebSocket is not open (as in, any state of openning or being closed), the returned Promise will be rejected.
     **/
    close() {
        return new Promise<Reply>((resolve, reject) => {
            const state = this.state;
            switch (state) {
                case TrakitSocketStatus.open:
                    this.reconnectEnabled = false;
                    const reqId = "disconnection";
                    this.#requests.set(reqId, (response: Reply) => {
                        this.#requests.delete(reqId);
                        (response.errorCode === 0 ? resolve : reject)(response);
                    });
                    this.#socket.close(1000, "Bye!");
                    break;
                default:
					reject(new Reply({
                        "errorCode": ErrorCode.unknown,
                        "message": "WebSocket not open",
                        "errorDetails": {
                            "connection": state,
                        },
                    }));
                    break;
            }
        });
    }
    /**
     * Sends a command and parameters to Trak-iT's WebSocket.
     * If the underlying WebSocket is not open (as in, any state of openning or being closed), the returned Promise will be rejected.
     * @param command		The name of the command to send.
     * @param params		Optional object or value for the command.
     **/
    send<TReply extends Reply>(command: string, params?: Payload) {
        return new Promise<TReply>((resolve, reject) => {
            // get the socket state inside the resolver because it could be invoked multiple times.
            const state = this.state;
            switch (state) {
                case TrakitSocketStatus.open:
                    const reqId = ++this.#requestId,
                        settler = (response: Reply) => {
                            clearTimeout(timer);
                            this.#requests.delete(reqId);
                            (response.errorCode === 0 ? resolve : reject)(response as TReply);
                        },
                        timer = setTimeout(
                            settler,
                            TIMEOUT_COMMAND,
                            {
                                "reqId": reqId,
                                "errorCode": ErrorCode.unknown,
                                "message": "Command timeout",
                            }
                        );
                    params = params || {} as Payload;
                    params.reqId = reqId;
                    this.#requests.set(reqId, settler);
                    this.#socket.send(command + " " + JSON.stringify(params));
                    this.resetKeepAlive();
                    break;
                case TrakitSocketStatus.closed:
                    this.open().then(() => this.send(command, params).then(resolve as any, reject), reject);
                    break;
                default:
					reject(new Reply({
						"errorCode": ErrorCode.unknown,
						"message": "Not connected",
						"errorDetails": {
							"connection": state,
						},
					}));
                    break;
            }
        });
    }
    /**
     * Resets the keep-alive timer (to try and keep the firewall from disconnecting the underlying WebSocket).
     **/
    resetKeepAlive() {
        clearTimeout(this.#timerKeepAlive);
        this.#timerKeepAlive = this.keepAliveEnabled
            && this.#socketOperable
            ? setTimeout(
                () => this.send("noop"),
                TIMEOUT_NOOP
            )
            : 0;
        return Promise.resolve(this.#timerKeepAlive !== 0);
    }
}