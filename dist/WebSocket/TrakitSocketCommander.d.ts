import { Payload, Reply, RepSelfGet, RepSubscription, RepSubscriptionList, SubscriptionType } from "@trakit/commands";
import { guid, JsonObject, Machine, nothing, SyncName, ulong, url } from '@trakit/objects';
import { TrakitObjectCommander } from "../API/TrakitObjectCommander";
/**
 * Describes the state of the {@link TrakitSocketCommander}'s connection to the Trak-iT WebSocket service.
 */
export declare enum TrakitSocketStatus {
    /**
     * A connection is being established and is awaiting the initial {@link RepSelfGet|connectionResponse} message.
     */
    opening,
    /**
     * A connection is established and the {@link RepSelfGet|connectionResponse} message has been received.
     */
    open,
    /**
     * Either the client or the server has initiated a disconnection.
     */
    closing,
    /**
     * The underlying {@link WebSocket} connection has been terminated.
     */
    closed
}
/**
 * Uses Trak-iT's {@link WebSocket} service to access and manipulate Trak-iT API objects.
 */
export declare class TrakitSocketCommander extends TrakitObjectCommander<[string, JsonObject]> {
    #private;
    /**
     * Production RESTful service URL.
     * This service is covered by the SLA and should be used for serices and code running in your own production environment.
     * Both services access the same data-set, so be careful making changes as they will be reflected in production as well.
     */
    static readonly URI_PROD: url;
    /**
     * Testing or beta RESTful service URL.
     * This service is not covered by the SLA and should be used to test your own code before deployment.
     * Throttling of connections and commands is tighter to help you diagnose issues before switching to production.
     * Both services access the same data-set, so be careful making changes as they will be reflected in production as well.
     */
    static readonly URI_BETA: url;
    /**
     * A function that translates a WebSocket message name (such as `userGeneralMerged`) to the name of
     * the object {@link SyncName} being synced (such as {@link UserGeneral}), to account for some legacy
     * message names that don't follow the {name}{action} format rule.
     */
    static msgNameToSyncName(msgName: string): SyncName | nothing;
    /**
     * Timestamp recorded right after establishing a connection and receiving the `connectionResponse` message.
     */
    get lastConnected(): Date;
    /**
     * A timestamp from the last time we received any kind of message from the underlying WebSocket (requested or otherwise).
     * Does not reset when we send a message, only on receive.
     * This is used by the keep-alive process.
     */
    get lastReceived(): Date;
    /**
     * The name of the most recent message received by the underlying WebSocket.
     */
    get lastMessage(): string;
    /**
     * Timestamp recorded right after sending the most recent message.
     */
    get lastSent(): Date;
    /**
     * Returns a {@link TrakitSocketStatus} about the underlying WebSocket.
     * Also takes into account a null connection, and an open connection that has not yet received the first message.
     */
    get state(): TrakitSocketStatus;
    /**
     * True when the WebSocket is ready to send and receive messages.
     * This value can be false if the connection is established, but the account has not authenticated yet, or your password has expired.
     */
    get ready(): boolean;
    /**
     * Gets invoked any time the WebSocket connection is established and the `connectionResponse` message is received.
     */
    _handleOpen(this: TrakitSocketCommander, reply: RepSelfGet): any;
    /**
     * Gets invoked any time the WebSocket connection is closed.
     */
    _handleClose(this: TrakitSocketCommander, reply: Reply): void;
    /**
     * Gets invoked any time a message is received by the Trak-iT WebSocket connection.
     * This is useful for logging or debugging, but you should use the {@link onUpdate}, {@link onDelete},
     * and {@link onList} events to track changes to objects.
     */
    _handleMessage(this: TrakitSocketCommander, name: string, body: JsonObject): void;
    /**
     * Gets invoked any time an error occurs on the WebSocket.
     */
    _handleError(this: TrakitSocketCommander, reply: Reply): void;
    /**
     * Gets invoked any time a broadcast message is received on the WebSocket.
     */
    _handleBroadcast(this: TrakitSocketCommander, json: JsonObject): void;
    /**
     * Flag set to specifically allow automatic re-connection to Trak-iT's WebSocket.
     * This value is set to false in the message handler if the connectionResponse message does not have an errorCode zero.
     * Conversly, it is set to true if a login or password change is successful.
     */
    reconnectEnabled: boolean;
    /**
     * Flag set to specifically send "noop" messages on a timer to ensure the firewall doesn't prematurely kill the underlying WebSocket.
     */
    keepAliveEnabled: boolean;
    constructor(account?: RepSelfGet | {
        machine: {
            key: string;
        };
    } | Machine | {
        key: string;
    } | {
        ghostId: guid;
    } | guid | nothing, baseAddress?: URL | url | nothing);
    /**
     * Disconnects the underlying WebSocket, unbinds all event-handlers, and clears any circular binds.
     */
    dispose(): void;
    /**
     * Creates a new underlying WebSocket and returns a Promise that resolves when the connectionResponse message is received.
     * If the underlying WebSocket is not closed (as in, any state of openning or being closed), the returned Promise will be rejected.
     */
    open(): Promise<RepSelfGet>;
    /**
     * Closes the underlying WebSocket connection, and returns a Promise that resolves when the connection is confirmed to be closed.
     * If the underlying WebSocket is not open (as in, any state of openning or being closed), the returned Promise will be rejected.
     */
    close(): Promise<Reply>;
    /**
     * Creates a request object for the specified payload.
     * @param payload The payload to include in the request.
     * @returns A request object configured with the specified parameters.
     */
    requestCreate(payload: Payload): Promise<[string, JsonObject]>;
    /**
     * Sends a command and parameters to Trak-iT's WebSocket service.
     * If the underlying WebSocket is not open (as in, any state of openning or being closed), the returned Promise will be rejected.
     * IF the command is sent, and a response received, even an error, the Promise is resolved.
     * @param command	The name of the command to send.
     * @param params	Optional object or value for the command.
     * @returns 		A Promise which is resolved when a response is received, otherwise it is rejected.
     */
    requestRelay(request: [string, JsonObject]): Promise<JsonObject>;
    /**
     * Resets the keep-alive timer (to try and keep the firewall from disconnecting the underlying WebSocket).
     */
    resetKeepAlive(): Promise<boolean>;
    /**
     * Subscribes to the specified subscription types for the given company.
     * @param companyId
     * @param subscriptions
     * @returns
     */
    subscribe(companyId: ulong, subscriptions: SubscriptionType[]): Promise<RepSubscription>;
    /**
     * Unsubscribes from the specified subscription types for the given company.
     * @param companyId
     * @param subscriptions
     * @returns
     */
    unsubscribe(companyId: ulong, subscriptions: SubscriptionType[]): Promise<RepSubscription>;
    /**
     * Retrieves the list of active subscriptions for the current account.
     * @returns
     */
    listSubscriptions(): Promise<RepSubscriptionList>;
}
//# sourceMappingURL=TrakitSocketCommander.d.ts.map