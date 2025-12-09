import { SubscriptionType } from "@trakit/commands";
import { classes, nothing } from "@trakit/objects";
import { SUBSCRIPTION_SPLITS } from "./Subscriptions";

/**
 * The amount of time (in milliseconds) to wait before automatically removing a region subscription.
 **/
const SynchronizedClasses_EXPIRE_TIMEOUT = 5 * 60 * 1000;	// 5 minutes
/**
 * A class to contain all the subscriptions for a company.
 * This class also sets the expiration dates.
 * @constructor
 **/
export class SynchronizedClasses {
    /**
     * A dictionary of subscription type to expiry date.
     * The expiry date is when the subscription type is due to be removed.
     * Dictionary{trakit.socket.SubscriptionType, ExpiryDate?}
     **/
    #types: Map<classes, Date | null> = new Map;
    /**
     * Returns all the currently valid subscription types, even if they are marked to expire.
     **/
    get types(): classes[] { return [...this.#types.keys()]; }

    /**
     * Returns a list of subscription types that should be removed.
     * When the `purge` argument is true, it will also remove the region from the subscription type dictionary,
     * that way it will no longer be listed as an active subscription, or as expired.
     **/
	getExpiredTypes(): classes[] {
		const now = new Date,
			types: classes[] = [];
		for (let [type, expiry] of this.#types) {
			if (expiry && expiry < now) {
				types.push(type);
			}
		}
		return types;
	}
    /**
     * Returns a list of subscription types that should be removed.
     * When the `purge` argument is true, it will also remove the region from the subscription type dictionary,
     * that way it will no longer be listed as an active subscription, or as expired.
     **/
	purgeExpiredTypes(): classes[] {
		const types = this.getExpiredTypes();
		types.forEach(r => this.#types.delete(r));
		return types;
	}
    /**
     * Returns a list of subscription types that will be removed eventually.
     **/
    getExpiringTypes(): classes[] {
        const types: classes[] = [];
        for (let [type, expiry] of this.#types) {
            if (expiry) {
                types.push(type);
            }
        }
        return types;
	}

	/**
	 * 
	 * @returns 
	 */
	getExpiredSubscriptions(): SubscriptionType[] {
		const subscriptions: SubscriptionType[] = [];
		this.getExpiredTypes().forEach(type => subscriptions.push(...SUBSCRIPTION_SPLITS[type]));
		return subscriptions;
	}
	
    /**
     * Sets the given expiry date for the given subscription type.
     * @param type
     * @param date
     **/
    #setExpiry(type: classes, date?: Date | nothing): Date | nothing {
        date = date || null;
        this.#types.set(type, date);
        return date;
    }
    /**
     * Marks the given subscription type for expiration.
     * @param type
     **/
    addExpiry(type: classes): Date {
        return this.#setExpiry(type, new Date((new Date).valueOf() + SynchronizedClasses_EXPIRE_TIMEOUT)) as Date;
    }
    /**
     * Marks the given subscription types for expiration.
     * @param types
     **/
    addExpiries(types: classes[]): Date[] {
        return types.map(type => this.addExpiry(type));
    }
    /**
     * Clears the expiration of the given subscription type.
     * @param type
     **/
    removeExpiry(type: classes): Date | null {
        const expiry = this.#types.get(type);
        this.#setExpiry(type);
        return expiry || null;
    }
    /**
     * Clears the expiration of the given subscription types.
     * @param types
     **/
    removeExpiries(types: classes[]): (Date | null)[] {
        return types.map(type => this.removeExpiry(type));
    }

    /**
     * Removes all subscription types, and returns a list of those that were not going to expire.
     **/
    reset(): classes[] {
        const types: classes[] = [];
        for (let [type, expiry] of this.#types) {
            if (!expiry) {
                types.push(type);
            }
        }
        this.#types.clear();
        return types;
    }
}