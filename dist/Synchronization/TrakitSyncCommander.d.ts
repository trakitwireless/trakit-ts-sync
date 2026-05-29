import { Payload, Reply, RepSelfGet, RepSubscription, RepSubscriptionList, SubscriptionType } from "@trakit/commands";
import { guid, Machine, nothing, SyncName, ulong, url } from '@trakit/objects';
import { TrakitObjectCommander } from "../API/TrakitObjectCommander";
import { TrakitRestfulCommander } from "../RESTful/TrakitRestfulCommander";
import { TrakitSocketCommander, TrakitSocketStatus } from "../WebSocket/TrakitSocketCommander";
/**
 * This is the class which does the work in the background {@link Worker} for the {@link SyncClient}.
 * It handles synchronizing regions, maintaining a connection to Trak-iT's WebSocket, and send HTTP requests to Trak-iT's RESTful service.
 * This class also maintains a queue of up-going messages.
 */
export declare class TrakitSyncCommander extends TrakitObjectCommander<any> {
    #private;
    /**
     * The Trak-iT WebSocket's main connection.
     */
    protected _socket: TrakitSocketCommander;
    /**
     * The Trak-iT RESTful service.
     */
    protected _rest: TrakitRestfulCommander;
    /**
     * Indicates whether the Trak-iT WebSocket is currently connected.
     */
    get socketOnline(): boolean;
    /**
     * Details of the underlying Trak-iT WebSocket service.
     */
    get socketDetails(): {
        state: TrakitSocketStatus;
        ready: boolean;
        lastConnected: Date;
        lastSent: Date;
        lastReceived: Date;
        lastMessage: string;
    };
    /**
     * URL of the underlying Trak-iT WebSocket service.
     */
    get socketAddress(): URL | null;
    set socketAddress(value: URL);
    /**
     * URL of the underlying Trak-iT RESTful service.
     */
    get restAddress(): URL | null;
    set restAddress(value: URL);
    constructor(account?: RepSelfGet | {
        machine: {
            key: string;
        };
    } | Machine | {
        key: string;
    } | {
        ghostId: guid;
    } | guid | nothing, restAddress?: URL | url | nothing, socketAddress?: URL | url | nothing);
    /**
     * Disposes of the Trak-iT WebSocket connection, and cleans up references.
     */
    dispose(): void;
    /**
     * @inheritDoc
     */
    setAuth(account?: RepSelfGet | {
        machine: {
            key: string;
        };
    } | Machine | {
        key: string;
    } | {
        ghostId: guid;
    } | guid | nothing): void;
    /**
     * Overridden to route commands to either the Trak-iT WebSocket or RESTful service based on the type of action.
     * @inheritdoc
     */
    command<TReply extends Reply>(payload: Payload): Promise<TReply>;
    /**
     * Overridden to throw an error if used; it shouldn't be in use because of the {@link command} override.
     * @inheritdoc
     */
    requestCreate(payload: Payload): any;
    /**
     * Overridden to throw an error if used; it shouldn't be in use because of the {@link command} override.
     * @inheritdoc
     */
    requestRelay(request: Payload): Promise<any>;
    /**
     * Sends a command specifically to the Trak-iT RESTful service.
     * @param payload
     * @returns
     */
    rest<TReply extends Reply>(payload: Payload): Promise<TReply>;
    /**
     * Sends a command specifically to the Trak-iT WebSocket service.
     * @param payload
     * @returns
     */
    socket<TReply extends Reply>(payload: Payload): Promise<TReply>;
    /**
     * Checks if the given {@link types} are currently synchronized for the given {@param companyId}.
     * @param companyId
     * @param types
     * @returns
     */
    isSynced(companyId: ulong, types: SyncName[]): boolean;
    /**
     * Retrieves the list of currently synchronized regions for the given {@param companyId}.
     * @param companyId
     * @param includeExpiring
     * @returns
     */
    getSyncs(companyId: ulong, includeExpiring?: boolean): SyncName[];
    /**
     * Begins synchronizing the given regions.
     * If all regions are in-sync, the returned Promise is resolved immediately.
     * Otherwise it sends a subscribe command to the Trak-iT WebSocket for any out-of-sync regions,
     * and when the subscribe is resolved, it sends commands to list the objects for the requested {@param types} (except Company, which is not listed, but "getted").
     * @param companyId
     * @param types
     */
    sync(companyId: ulong, types: SyncName[]): Promise<Reply[]>;
    /**
     * Adds the {@param types} to the list of expiring subscriptions.
     * The process is not immediate, but happens after a timeout.
     * This allows the service to re-request sync on a region, like when switching sections.
     * @param companyId
     * @param types
     */
    desync(companyId: ulong, types: SyncName[]): SubscriptionType[];
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
//# sourceMappingURL=TrakitSyncCommander.d.ts.map