import { RepSelfGet } from "@commands/Accounts/Self/Responses/RepSelfGet";
import { Payload } from "@commands/API/Requests/Payload";
import { ErrorDetail } from "@commands/API/Responses/Errors/ErrorDetail";
import { Reply } from "@commands/API/Responses/Reply";
import { CLEAR_TIMER, JSON_PARSE, JSON_STRINGIFY, MIN, SET_TIMER } from "@objects/API/Constants";
import { ID } from "@objects/API/Functions";
import { TrakitSocketStatus } from "./TrakitSocketStatus";
import { ErrorCode } from "@commands/API/Responses/Errors/ErrorCode";
import { SelfMachine } from "@commands/Accounts/Self/Responses/Content/SelfMachine";
import { SelfUserGeneral } from "@commands/Accounts/Self/Responses/Content/SelfUserGeneral";
import { SelfUserAdvanced } from "@commands/Accounts/Self/Responses/Content/SelfUserAdvanced";
import { SelfUser } from "@commands/Accounts/Self/Responses/Content/SelfUser";

/**
 * Production {@link WebSocket} service URL.
 * This service is covered by the SLA and should be used for serices and code running in your own production environment.
 * Both services access the same data-set, so be careful making changes as they will be reflected in production as well.
 */
export const URI_PROD = "wss://socket.trakit.ca/";  
/**
 * Testing or beta {@link WebSocket} service URL.
 * This service is covered by the SLA and should be used for serices and code running in your own production environment.
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
 * Uses Trak-iT's {@link WebSocket} service to access and manipulate all Trak-iT API Objects.
 **/
export class TrakitSocket {
    /**
     * Trak-iT's WebSocket URL.
     **/
    url: string;
    /**
     * Your session id.
     **/
    ghostId: string;
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
     */
    account!: RepSelfGet;
    /**
     * A timestamp from the last time we received any kind of message from the underlying WebSocket (requested or otherwise).
     * Does not reset when we send a message, only on receive.
     * This is used by the keep-alive process.
     **/
    lastReceived: Date = new Date(NaN);
    /**
     * The name of the most recent message received by the underlying WebSocket.
     **/
    lastMessageName: string = "";

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

    //#region Internal WebSocket control
    /**
     * Counter used to correlate requests to responses.
     **/
    #requestId: number = 0;
    /**
     * A collection of pending command Promises.
     * Each key is a reqId (except for connection and disconnection) and each value is a function invoked with a {@link Reply} object.
     **/
    #requests: Map<string | number, (response: Reply) => void> = new Map();
    
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
        CLEAR_TIMER(this.#timerKeepAlive);
        CLEAR_TIMER(this.#timerReconnect);
        this.#socketReady = false;
        this.#delayReconnect = this.#delayReconnect
            ? this.#delayReconnect * 2
            : this.lastReceived
                ? new Date().valueOf() - this.lastReceived.valueOf()
                : 5000;
        const reconnectTimeout = MIN(this.#delayReconnect, TIMEOUT_MAX_RECONNECT),
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
            if (key = ID(key)) response["reqId"] = key;
            settler(response);
        });

        delete response["reqId"];
        response.errorCode = ErrorCode.unknown;
        this.onClose?.(response);

        // start reconnect timer
        this.#timerReconnect = this.reconnectEnabled
            && this.#socketOperable
            ? SET_TIMER(
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
        this.lastReceived = new Date;

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
        const msgContent = JSON_PARSE(event.data.substring(msgName.length + 1));

        // first, set this value
        this.lastMessageName = msgName;
        switch (msgName) {
            case "connectionResponse":
                this.ghostId = (msgContent as RepSelfGet).ghostId || "";
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
                this.account = msgContent as RepSelfGet;
                this.ghostId = this.account.ghostId || "";
                this.#socketOperable = this.account.errorCode === 0
                    && !this.account.user?.passwordExpired;
                break;
            case "updateOwnPasswordResponse":
                this.#socketOperable = msgContent["errorCode"] === 0;
                break;
            case "sessionMachineMerged":
                this.account.machine = new SelfMachine(msgContent);
                break;
            case "sessionGeneralMerged":
                (this.account.user as SelfUser).general = new SelfUserGeneral(msgContent);
                break;
            case "sessionAdvancedMerged":
                (this.account.user as SelfUser).advanced = new SelfUserAdvanced(msgContent);
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
     * @type {!number}
     **/
    #timerKeepAlive: number = 0;
    //#endregion Keep-Alive

    constructor(url: string, ghostId?: string | null) {
        this.url = url || URI_PROD;
        this.ghostId = ghostId || "";
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
        CLEAR_TIMER(this.#timerReconnect);
        this.#timerReconnect = 0;
        return new Promise<Reply>((resolve, reject) => {
            const state = this.state;
            switch (state) {
                case TrakitSocketStatus.closed:
                    const reqId = CMD_CONNECTION;
                    this.#socket = new WebSocket(this.url.replace(/\/+$/, '') + "/?ghostId=" + this.ghostId);
                    this.#socket.onopen = (ev) => this.#socketOpen(ev);
                    this.#socket.onclose = (ev) => this.#socketClose(ev);
                    this.#requests.set(reqId, (response: Reply) => {
                        this.#requests.delete(reqId);
                        (response.errorCode === 0 ? resolve : reject)(response);
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
     * @this {TrakitSocket}
     * @return {Promise}
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
                        (response["errorCode"] === 0 ? resolve : reject)(response);
                    });
                    this.#socket.close(1000, "Bye!");
                    break;
                default:
                    reject({
                        "errorCode": ErrorCode.unknown,
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
     * @param command		The name of the command to send.
     * @param params		Optional object or value for the command.
     **/
    send(command: string, params?: Payload) {
        return new Promise<Reply>((resolve, reject) => {
            // get the socket state inside the resolver because it could be invoked multiple times.
            const state = this.state;
            switch (state) {
                case TrakitSocketStatus.open:
                    const reqId = ++this.#requestId,
                        settler = (response: Reply) => {
                            CLEAR_TIMER(timer);
                            this.#requests.delete(reqId);
                            (response["errorCode"] === 0 ? resolve : reject)(response);
                        },
                        timer = SET_TIMER(
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
                    this.#socket.send(command + " " + JSON_STRINGIFY(params));
                    this.resetKeepAlive();
                    break;
                case TrakitSocketStatus.closed:
                    this.open().then(() => this.send(command, params).then(resolve, reject), reject);
                    break;
                default:
                    reject({
                        "errorCode": ErrorCode.unknown,
                        "message": "Not connected",
                        "errorDetails": {
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
    resetKeepAlive() {
        CLEAR_TIMER(this.#timerKeepAlive);
        this.#timerKeepAlive = this.keepAliveEnabled
            && this.#socketOperable
            ? SET_TIMER(
                () => this.send("noop"),
                TIMEOUT_NOOP
            )
            : 0;
        return Promise.resolve(this.#timerKeepAlive !== 0);
    }
}