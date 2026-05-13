import { RepSelfGet } from '@trakit/commands';
import { codified, email, guid, IRequestable, SyncName, ulong } from '@trakit/objects';
import { TrakitObjectCommander } from "./TrakitObjectCommander";
/**
 * Function signature for event handlers used by {@link TrakitObjectCommander} and child classes.
 * The `this` context is set to the `TrakitObjectCommander` instance that emitted the event,
 * allowing handlers to access its methods and properties directly.
 */
export type TrakitEventHandler = (this: TrakitObjectCommander<any>, event: TrakitEvent) => unknown;
/**
 * Base class for all Trak-iT events.
 */
export declare abstract class TrakitEvent {
    /**
     * The name of the event being raised.
     */
    readonly type: string;
    constructor(type: string);
}
/**
 * Base class for all Trak-iT synchronization events.
 * Used for listing objects, getting single objects, as well as updates and deletions.
 */
export declare abstract class TrakitEventSync extends TrakitEvent {
    /**
     * The type of object(s) being synchronized.
     */
    readonly kind: SyncName;
    /**
     * The {@link Company.id} for which the synchronization is occurring.
     */
    readonly companyId: ulong;
    constructor(type: string, kind: SyncName, companyId: ulong);
}
/**
 * Event raised when the Trak-iT account information is updated.
 */
export declare class TrakitEventAccount extends TrakitEvent {
    /**
     * The updated account information retrieved from the Trak-iT service.
     */
    readonly account: RepSelfGet;
    constructor(type: string, account: RepSelfGet);
}
/**
 * Event raised when all objects for a given {@link Company} are retrieved from a Trak-iT service.
 * This is the equivalent of a "replace all" operation, and is used to synchronize local objects with the server.
 */
export declare class TrakitEventList extends TrakitEventSync {
    /**
     * The list of objects retrieved from the Trak-iT service for the specified {@link Company}.
     */
    readonly objects: IRequestable[];
    constructor(type: string, kind: SyncName, companyId: ulong, objects: IRequestable[]);
}
/**
 * Event raised when a single object for a given {@link Company} is updated.
 */
export declare class TrakitEventUpdate extends TrakitEventSync {
    /**
     * The object retrieved from the Trak-iT service for the specified {@link Company}.
     */
    readonly object: IRequestable;
    constructor(type: string, kind: SyncName, companyId: ulong, object: IRequestable);
}
/**
 * Event raised when a single object for a given {@link Company} is deleted.
 */
export declare class TrakitEventDelete extends TrakitEventSync {
    /**
     * The unique identifier of the object deleted from the Trak-iT service.
     */
    readonly key: ulong | guid | email | codified | string;
    constructor(type: string, kind: SyncName, companyId: ulong, key: ulong | guid | email | codified | string);
}
//# sourceMappingURL=Events.d.ts.map