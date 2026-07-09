import { SubscriptionType } from "@trakit/commands";
import { nothing } from "@trakit/objects";

/**
 * The amount of time (in milliseconds) to wait before automatically removing a region subscription.
 */
const SubscribedRegions_EXPIRE_TIMEOUT = 5 * 60 * 1000;	// 5 minutes
/**
 * A class to contain all the subscriptions for a company.
 * This class also sets the expiration dates.
 * @constructor
 */
export class SubscribedRegions {
	/**
	 * A dictionary of subscription type to expiry date.
	 * The expiry date is when the subscription type is due to be removed.
	 * Dictionary{trakit.socket.SubscriptionType, ExpiryDate?}
	 */
	#regions: Map<SubscriptionType, Date | null> = new Map;
	/**
	 * Returns all the currently valid subscription types, even if they are marked to expire.
	 */
	get regions(): SubscriptionType[] { return [...this.#regions.keys()]; }

	/**
	 * Returns a list of subscription types that should be removed.
	 */
	getExpired(): SubscriptionType[] {
		const now = new Date,
			regions: SubscriptionType[] = [];
		for (const [region, expiry] of this.#regions) {
			if (expiry && expiry < now) {
				regions.push(region);
			}
		}
		return regions;
	}
	/**
	 * Returns a list of subscription types that were removed.
	 */
	purgeExpired(): SubscriptionType[] {
		const regions = this.getExpired();
		regions.forEach(r => this.#regions.delete(r));
		return regions;
	}
	/**
	 * Returns a list of subscription types that will be removed eventually.
	 */
	getExpiring(): SubscriptionType[] {
		const regions: SubscriptionType[] = [];
		for (const [region, expiry] of this.#regions) {
			if (expiry) {
				regions.push(region);
			}
		}
		return regions;
	}
	/**
	 * Sets the given expiry date for the given subscription type.
	 * @param region
	 * @param date
	 */
	#setExpiry(region: SubscriptionType, date?: Date | nothing): Date | null {
		date = date || null;
		this.#regions.set(region, date);
		return date;
	}
	/**
	 * Marks the given subscription type for expiration.
	 * @param region	
	 * @param immediate	If true, the subscription type will be marked for immediate expiration.
	 */
	expireRegion(region: SubscriptionType, immediate: boolean = false): Date {
		const nowMs = immediate
			? 0
			: (new Date).valueOf();
		return this.#setExpiry(
			region,
			new Date(nowMs + SubscribedRegions_EXPIRE_TIMEOUT)
		) as Date;
	}
	/**
	 * Marks the given subscription types for expiration.
	 * @param regions
	 * @param immediate	If true, the subscription types will be marked for immediate expiration.
	 */
	expireRegions(regions: SubscriptionType[], immediate: boolean = false): Date[] {
		return regions.map(region => this.expireRegion(region, immediate));
	}
	/**
	 * Clears the expiration of the given subscription type.
	 * @param region
	 */
	preserveRegion(region: SubscriptionType): Date | null {
		const expiry = this.#regions.get(region);
		this.#setExpiry(region);
		return expiry || null;
	}
	/**
	 * Clears the expiration of the given subscription types.
	 * @param regions
	 */
	preserveRegions(regions: SubscriptionType[]): (Date | null)[] {
		return regions.map(region => this.preserveRegion(region));
	}

	/**
	 * Removes all subscription types, and returns a list of those that were not going to expire.
	 */
	reset(): SubscriptionType[] {
		const regions: SubscriptionType[] = [];
		for (const [region, expiry] of this.#regions) {
			if (!expiry) {
				regions.push(region);
			}
		}
		this.#regions.clear();
		return regions;
	}
}