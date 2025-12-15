import { SubscriptionType } from "@trakit/commands";
import { SyncName } from "@trakit/objects";
import { OBJECT_COMPOUNDS } from "../API/Constants";
import { OBJECT_SUBSCRIPTIONS } from "../WebSocket/Constants";

/**
 * 
 * @param types 
 * @returns 
 */
export function SYNCS_TO_SUBS(types: SyncName[]): SubscriptionType[] {
	return types.reduce((acc, s) => acc.concat(OBJECT_SUBSCRIPTIONS[s] || []), [] as SubscriptionType[])
				.filter((sub, index, array) => array.indexOf(sub) === index); // make unique
}
/**
 * 
 * @param subscriptions 
 * @returns 
 */
export function SUBS_TO_SYNCS(subscriptions: SubscriptionType[]): SyncName[] {
	const requests: SyncName[] = [];
	// we start with the compound types
	for (const [type, children] of Object.entries(OBJECT_COMPOUNDS)) {
		const subs = children.map((child) => OBJECT_SUBSCRIPTIONS[child]).flat();
		if (subs.filter(sub => subscriptions.includes(sub)).length / subs.length >= 0.5) {
			requests.push(type as SyncName);
		}
	}
	// and then the simple types that are not part of compound classes
	for (const [type, subs] of Object.entries(OBJECT_SUBSCRIPTIONS)) {
		if (
			!OBJECT_COMPOUNDS[type]
			&& subs.some(sub => subscriptions.includes(sub))
		) {
			requests.push(type as SyncName);
		}
	}
	return requests;
}