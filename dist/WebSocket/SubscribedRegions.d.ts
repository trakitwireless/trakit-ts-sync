import { SubscriptionType } from "@trakit/commands";
/**
 * A class to contain all the subscriptions for a company.
 * This class also sets the expiration dates.
 * @constructor
 */
export declare class SubscribedRegions {
    #private;
    /**
     * Returns all the currently valid subscription types, even if they are marked to expire.
     */
    get regions(): SubscriptionType[];
    /**
     * Returns a list of subscription types that should be removed.
     */
    getExpired(): SubscriptionType[];
    /**
     * Returns a list of subscription types that were removed.
     */
    purgeExpired(): SubscriptionType[];
    /**
     * Returns a list of subscription types that will be removed eventually.
     */
    getExpiring(): SubscriptionType[];
    /**
     * Marks the given subscription type for expiration.
     * @param region
     * @param immediate	If true, the subscription type will be marked for immediate expiration.
     */
    expireRegion(region: SubscriptionType, immediate?: boolean): Date;
    /**
     * Marks the given subscription types for expiration.
     * @param regions
     * @param immediate	If true, the subscription types will be marked for immediate expiration.
     */
    expireRegions(regions: SubscriptionType[], immediate?: boolean): Date[];
    /**
     * Clears the expiration of the given subscription type.
     * @param region
     */
    preserveRegion(region: SubscriptionType): Date | null;
    /**
     * Clears the expiration of the given subscription types.
     * @param regions
     */
    preserveRegions(regions: SubscriptionType[]): (Date | null)[];
    /**
     * Removes all subscription types, and returns a list of those that were not going to expire.
     */
    reset(): SubscriptionType[];
}
//# sourceMappingURL=SubscribedRegions.d.ts.map