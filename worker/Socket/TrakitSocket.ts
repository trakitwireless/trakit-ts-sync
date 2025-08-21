import { RepSelfGet } from "@commands/Accounts/Self/Responses/RepSelfGet";
import { Payload } from "@commands/API/Requests/Payload";
import { ErrorDetail } from "@commands/API/Responses/Errors/ErrorDetail";
import { Reply } from "@commands/API/Responses/Reply";
import { CLEAR_TIMER, JSON_PARSE, JSON_STRINGIFY, MIN, SET_TIMER } from "@objects/API/Constants";
import { ID } from "@objects/API/Functions";

/**
 * Maximum time (in milliseconds) to wait before givin up on a command.
 * @const {number}
 **/
const TrakitSocket_COMMAND_TIMEOUT = 120 * 1000;
/**
 * Maximum time (in milliseconds) to wait before trying to re-connect to Trak-iT's WebSocket.
 * @const {number}
 **/
const TrakitSocket_RECONNECT_MAXWAIT = 300 * 1000;
/**
 * Callback used in the re-connect timer to try and re-open the underlying WebSocket.
 **/
function TrakitSocket_RECONNECT(kraken: TrakitSocket) {
    return kraken.open();
}
/**
 * Amount of time (in milliseconds) to let the underlying WebSocket idle before sending a noop command.
 * @const {!number}
 **/
const TrakitSocket_NOOP_TIMEOUT = (300 - 1) * 1000;	// the -1 is to make sure the firewall doesn't close the connection first.
/**
 * Callback used in the keep-alive timer to try and keep the firewall from disconnecting the underlying WebSocket.
 **/
function TrakitSocket_NOOP(kraken: TrakitSocket) {
    return kraken.send("noop");
}


export const TrakitSocket_cmd_connection = "connection";
export const TrakitSocket_cmd_disconnection = "disconnection";


/**
 * Handler for when the underlying WebSocket connection opens.
 * This handler will reset the keep-alive and re-connect timers, as well as bind message and error handlers (the socket only has open/close hadlers when constructed)
 * It does not fire the "connection" event, or mark the TrakitSocket as ready, as those things are handled in the onmessage handler.
 * @this {TrakitSocket}
 * @param {Event} event
 **/
function TrakitSocket_onOpen(this: TrakitSocket, event: Event) {
    this.__wss.onopen = null;
    this.__wss.onmessage = this.__onMessage;
    this.__wss.onerror = this.__onError;
    this.__delayReconnect = 0;
}
/**
 * This is a generic "error" handler for the underlying WebSocket.
 * Since WebSocket errors are generic and thrown without any detail (at least none dcumented), I'm not sure what good this thing will do.
 * @this {TrakitSocket}
 * @param {Event} event
 **/
function TrakitSocket_onError(this: TrakitSocket, event: Event | { "message": string }) {
    this.onError?.({
        "errorCode": 2,// ErrorCode.service
        "message": (event as { message: string }).message || "WebSocket error",
    } as Reply);
}
/**
 * Handler for when the underlyng WebSocket connection is severed.
 * Will first find all pending command promise settlers and invoke them.
 * A special case is made for the disconnection Promise and it is marked as successful (if it exists).
 * This also fires the "disconnection" event, and starts the re-connect timer.
 * @this {TrakitSocket}
 * @param {CloseEvent} event
 **/
function TrakitSocket_onClose(this: TrakitSocket, event: CloseEvent) {
    CLEAR_TIMER(this.__timerKeepAlive);
    CLEAR_TIMER(this.__timerReconnect);
    this.__ready = false;
    this.__delayReconnect = this.__delayReconnect
        ? this.__delayReconnect * 2
        : this.lastReceived
            ? new Date().valueOf() - this.lastReceived.valueOf()
            : 5000;
    const reconnectTimeout = MIN(this.__delayReconnect, TrakitSocket_RECONNECT_MAXWAIT),
        errorDetails: ErrorDetail = {
            "code": event.code,
            "reason": event.reason,
            "wasClean": event.wasClean,
            "reconnect": this.reconnectEnabled,
            "retry": new Date().valueOf() + reconnectTimeout,
        },
        response: Reply = {
            "reqId": undefined,
            "errorCode": 1,    // ErrorCode.unknown
            "message": "Disconnected",
            "errorDetails": errorDetails,
        };

    // cancel all commands
    this.__settlers.forEach((settler, key) => {
        response.errorCode = key === "disconnection" ? 0 : 1;
        if (key = ID(key)) response["reqId"] = key;
        else delete response["reqId"];
        settler(response);
    });

    response.errorCode = 1;
    delete response["reqId"];
    this.onClose?.(response);

    // start reconnect timer
    this.__timerReconnect = this.reconnectEnabled
        && this.__operable
        ? SET_TIMER(
            TrakitSocket_RECONNECT,
            reconnectTimeout,
            this
        )
        : 0;

    (this.__wss as WebSocket | null) = null;
    this.__wss.onopen =
        this.__wss.onerror =
        this.__wss.onclose =
        this.__wss.onmessage = null;
}
/**
 * Handler for when the underlyng WebSocket receives a message.
 * Each message is formatted as {messageName}(space){JSON Object}.
 * Some specific messages (such as connection, getSessionDetails, login, logout, noop, sessionEnded, and updateOwnPassword) are handled with special cases.
 * After special handling, a "message" event is (optionally, depending on the message name) fired, then the Promise resolver (if it exists) is invoked.
 * This handler also fires the "connection" event, not the onopen handler.
 * @this {TrakitSocket}
 * @param {MessageEvent} event
 **/
function TrakitSocket_onMessage(this: TrakitSocket, event: MessageEvent) {
    this.lastReceived = new Date;

    /**
     * Will fire an event of the message name when true (default).
     * This value is only set to false for "noopResponse".
     * @type {!boolean}
     **/
    let msgEvent = true;
    /**
     * The name of the message received by the underlying WebSocket.
     * This value is only changed for the "connectionResponse" to "connection" to properly fire that event.
     * @type {!string}
     **/
    const msgName = event["data"].before(" ");
    /**
     * The JSON parsed from the message received by the underlying WebSocket.
     * @type {!Object}
     **/
    const msgContent = JSON_PARSE(event["data"].after(" "));

    // first, set this value
    this.lastMessageName = msgName;
    switch (msgName) {
        case "connectionResponse":
            this.__ready = true;
            this.ghostId = (msgContent as RepSelfGet).ghostId || "";
            this.__operable = msgContent["errorCode"] === 0;
            this.__settlers.get(TrakitSocket_cmd_connection)?.apply(msgContent);	// Promise is settled here, not below
            this.onOpen?.(msgContent);		// then we fire event here, not below
            msgEvent = false;	// because we are firing the "connection" event instead of the "message" event at the end.
            break;
        case "loginResponse":
        case "getSessionDetailsResponse":
            this.ghostId = (msgContent as RepSelfGet).ghostId || "";
            this.__operable = msgContent.errorCode === 0
                && (msgContent as RepSelfGet).user.passwordExpired === false;
            break;
        case "updateOwnPasswordResponse":
            this.__operable = msgContent.errorCode === 0;
            break;
        case "noopResponse":
            msgEvent = false;
            break;
        case "logoutResponse":
        case "sessionEnded":
            this.close();
            break;
    }

    /**
     * The function that will settle (resolve or reject) the Promise for the pending command.
     * @type {function(trakit.json.BaseResponse)}
     **/
    const settler = this.__settlers.get(msgContent["reqId"]);
    if (settler) settler(msgContent);

    // fire event
    if (msgEvent) {
        this.onMessage?.(msgName, msgContent);
    }

    // lastly, reset keep-alive process
    // because, the __operable is only set to true during the switch/case, and this will only re-activate if it's true
    this.resetKeepAlive();
}

/**
 * Defines {@link TrakitSocket} connection states.
 */
export enum TrakitSocketState {
	opening,
	open,
	closing,
	closed,
    unknown,
}

/**
 * Promise-based WebSocket wrapper designed specifically to work with Trak-iT's WebSocket service.
 * @constructor
 * @extends trakit.fleetfreedom.MVCObject
 * @param {!string} url
 * @param {string=} ghostId
 **/
export class TrakitSocket {
    /**
     * Trak-iT's WebSocket URL.
     * @type {!string}
     **/
    url: string;
    /**
     * Your session id.
     * @type {!string}
     **/
    ghostId: string;
    /**
     * Marked true after connectionResponse message.
     * Marked false on disconnection from the underlyng WebSocket.
     * @type {!boolean}
     **/
    __ready: boolean = false;
    /**
     * When true, it means the underlyng WebSocket is connected for a valid session.
     * When false, the re-connect process will not function, nor will the "noop" keep-alive messages be sent.
     * @type {!boolean}
     **/
    __operable: boolean = true;	// defualt true, so that the first connection will auto-reconnect.
    /**
     * Underlying WebSocket.
     * @type {WebSocket}
     **/
    __wss!: WebSocket;
    /**
     * Bound "open" event handler for the WebSocket.
     **/
    __onOpen: ((this: WebSocket, event: Event) => any) | null;
    /**
     * Bound "error" event handler for the WebSocket.
     **/
    __onError: ((this: WebSocket, event: Event) => any) | null;
    /**
     * Bound "close" event handler for the WebSocket.
     **/
    __onClose: ((this: WebSocket, event: CloseEvent) => any) | null;
    /**
     * Bound "message" event handler for the WebSocket.
     **/
    __onMessage: ((this: WebSocket, event: MessageEvent) => any) | null;

    /**
     * A collection of pending command Promise settlers.
     * Each key is a reqId (except for connection and disconnection) and each value is a function invoked with a {@link trakit.json.BaseResponse} object.
     * Dictionary{reqId, function(trakit.json.BaseResponse)}
     * @type {!Object.<string, Function>}
     **/
    __settlers!: Map<string | number, Function>;
    /**
     * Counter used to correlate requests to responses.
     * @type {!number}
     **/
    reqId: number = 0;
    /**
     * Returns a {@link trakit.fleetfreedom.SocketState} about the underlying WebSocket.
     * Also takes into account a null connection, and an open connection that has not yet received the first message.
     * Complex getter defined on this class' prototype.
     * @type {!trakit.fleetfreedom.SocketState}
     **/
    get state(): TrakitSocketState {
        switch (this.__wss?.readyState ?? 3) {
            case WebSocket.CONNECTING: return TrakitSocketState.opening;
            case WebSocket.OPEN: return !this.__ready ? TrakitSocketState.opening : TrakitSocketState.open;
            case WebSocket.CLOSING: return TrakitSocketState.closing;
            case WebSocket.CLOSED: return TrakitSocketState.closed;
            default: return TrakitSocketState.unknown;
        }
    }

    /**
     * Flag set to specifically allow automatic re-connection to Trak-iT's WebSocket.
     * This value is set to false in the message handler if the connectionResponse message does not have an errorCode zero.
     * Conversly, it is set to true if a login or password change is successful.
     * @type {!boolean}
     **/
    reconnectEnabled: boolean = true;
    /**
     * The amount of time (in milliseconds) to wait before trying to re-connect.
     * This time doubles with every attempt, and maxes out at {@link TrakitSocket_RECONNECT_MAXWAIT}.
     * @type {!number}
     **/
    __delayReconnect: number = 0;
    /**
     * Handle for the timer associated with performing the waiting operation.
     * @type {!number}
     **/
    __timerReconnect: number = 0;

    /**
     * Flag set to specifically send "noop" messages on a timer to ensure the firewall doesn't prematurely kill the underlying WebSocket.
     * @type {!boolean}
     **/
    keepAliveEnabled: boolean = true;
    /**
     * A timestamp from the last time we received any kind of message from the underlying WebSocket (requested or otherwise).
     * Does not reset when we send a message, only on receive.
     * This is used by the keep-alive process.
     * @type {!Date}
     **/
    lastReceived: Date = new Date(0);
    /**
     * The name of the most recent message received by the underlying WebSocket.
     * @type {!string}
     **/
    lastMessageName: string = "";
    /**
     * Handle for the timer associated with performing the keep-alive operation.
     * @type {!number}
     **/
    __timerKeepAlive: number = 0;

    /**
     * Gets invoked any time the WebSocket connection is opened.
     */
    onOpen: ((this: TrakitSocket, message: Reply) => any) | null = null;
    /**
     * Gets invoked any time the WebSocket connection is closed.
     */
    onClose: ((this: TrakitSocket, message: Reply) => any) | null = null;
    /**
     * Gets invoked any time a message is received from the WebSocket.
     */
    onMessage: ((this: TrakitSocket, name: string, message: any) => any) | null = null;
    /**
     * Gets invoked any time an error occurs on the WebSocket.
     */
    onError: ((this: TrakitSocket, message: Reply) => any) | null = null;

    constructor(url: string, ghostId?: string | null) {
        this.url = url;
        this.ghostId = ghostId || "";

        this.__settlers = new Map();
        this.__onOpen = TrakitSocket_onOpen.bind(this);
        this.__onError = TrakitSocket_onError.bind(this);
        this.__onMessage = TrakitSocket_onMessage.bind(this);
        this.__onClose = TrakitSocket_onClose.bind(this);
    }
    /**
     * Disconnects the underlying WebSocket, unbinds all event-handlers, and clears any circular binds.
     */
    dispose(): void {
        const kraken = this;
        kraken.__operable = false;	// prevent re-connect
        kraken.close().finally(function () {
            (kraken.__wss as WebSocket | null) =
                (kraken.__settlers as Map<string | number, Function> | null) =
                kraken.__onOpen =
                kraken.__onClose =
                kraken.__onError =
                kraken.__onMessage = null;
        });
    }

    /**
     * Creates a new underlying WebSocket and returns a Promise that resolves when the connectionResponse message is received.
     * If the underlying WebSocket is not closed (as in, any state of openning or being closed), the returned Promise will be rejected.
     **/
    open(): Promise<Reply> {
        const kraken = this;
        CLEAR_TIMER(kraken.__timerReconnect);
        kraken.__timerReconnect = 0;
        return new Promise(function (resolve, reject) {
            const state = kraken.state;
            switch (state) {
                case TrakitSocketState.closed:
                    const reqId = TrakitSocket_cmd_connection,	// not a reqId
                        settler = function (response: Reply) {
                            kraken.__settlers.delete(reqId);
                            (response["errorCode"] === 0 ? resolve : reject)(response);
                        };
                    kraken.__wss = new WebSocket(kraken.url.replace(/\/+$/, '') + "/?ghostId=" + kraken.ghostId);
                    kraken.__wss.onopen = kraken.__onOpen;
                    kraken.__wss.onclose = kraken.__onClose;
                    kraken.__settlers.set(reqId, settler);
                    break;
                default:
                    reject({
                        "errorCode": 1, // ErrorCode.unknown
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
     * @this {TrakitSocket}
     * @return {Promise}
     **/
    close(): Promise<Reply> {
        const kraken = this;
        return new Promise(function (resolve, reject) {
            const state = kraken.state;
            switch (state) {
                case TrakitSocketState.open:
                    const reqId = "disconnection",	// not a reqId
                        settler = function (response: Reply) {
                            kraken.__settlers.delete(reqId);
                            (response["errorCode"] === 0 ? resolve : reject)(response);
                        };
                    kraken.reconnectEnabled = false;
                    kraken.__settlers.set(reqId, settler);
                    kraken.__wss.close(1000, "bye!");
                    break;
                default:
                    reject({
                        "errorCode": 1, // ErrorCode.unknown
                        "message": "WebSocket not open",
                        "errorDetails": {
                            "connection": state,
                        },
                    });
                    break;
            }
        });
    }
    /**
     * Sends a command and parameters to Trak-iT's WebSocket.
     * If the underlying WebSocket is not open (as in, any state of openning or being closed), the returned Promise will be rejected.
     * @this {TrakitSocket}
     * @param {!string} command		The name of the command to send.
     * @param {Object=} params		Optional object or value for the command.
     * @param {number=} retries		Optional number of attempts to resend this command upon reconnection.
     * @return {Promise}
     **/
    send(command: string, params?: Payload, retries?: number): Promise<Reply> {
        const kraken = this;
        let attempt = Number(retries) || 0;
        return new Promise(function (resolve, reject) {
            // get the socket state inside the resolver because it could be invoked multiple times.
            const state = kraken.state;
            switch (state) {
                case TrakitSocketState.open:
                    const reqId = ++kraken.reqId,
                        settler = function (response: Reply) {
                            CLEAR_TIMER(timer);
                            kraken.__settlers.delete(reqId);
                            (response["errorCode"] === 0 ? resolve : reject)(response);
                        },
                        timer = SET_TIMER(
                            settler,
                            TrakitSocket_COMMAND_TIMEOUT,
                            {
                                "reqId": reqId,
                                "errorCode": 1, // ErrorCode.unknown
                                "message": "Command timeout",
                            }
                        );
                    params = params || {} as Payload;
                    params.reqId = reqId;
                    kraken.__settlers.set(reqId, settler);
                    kraken.__wss.send(command + " " + JSON_STRINGIFY(params));
                    kraken.resetKeepAlive();
                    break;
                default:
                    if (attempt > 0) {
                        const onOpen = kraken.onOpen;
                        kraken.onOpen = function (message) {
                            kraken.onOpen = onOpen; // restore the original handler
                            kraken.onOpen?.(message);
                            kraken.send(command, params, attempt).then(resolve, reject);
                        };
                        if (state === TrakitSocketState.closed) kraken.open();
                        attempt--;
                    } else {
                        reject({
                            "errorCode": 1, // ErrorCode.unknown
                            "message": "Not connected",
                            "errorDetails": {
                                "connection": state,
                                "retries": retries || 0,
                            },
                        });
                    }
                    break;
            }
        });
    }
    /**
     * Resets the keep-alive timer, and returns a resolved Promise.
     * @this {TrakitSocket}
     * @return {Promise}
     **/
    resetKeepAlive(): Promise<void> {
        CLEAR_TIMER(this.__timerKeepAlive);
        this.__timerKeepAlive = this.keepAliveEnabled
            && this.__operable
            ? SET_TIMER(
                TrakitSocket_NOOP,
                TrakitSocket_NOOP_TIMEOUT,
                this
            )
            : 0;
        return Promise.resolve();
    }
}