import { SubscriptionType } from "@trakit/commands";
import { SyncName } from "@trakit/objects";
/**
 * Regex parser for socket command response message names.
 */
export declare const MSG_RESPONSE: RegExp;
/**
 * Regex parser for socket message names (not command responses, those are handled by the {@link TrakitCommander.command} function).
 */
export declare const MSG_SYNC: RegExp;
/**
 * A mapping of object names to their required subscription types.
 */
export declare const OBJECT_SUBSCRIPTIONS: {
    [key in SyncName]: SubscriptionType[];
};
//# sourceMappingURL=Constants.d.ts.map