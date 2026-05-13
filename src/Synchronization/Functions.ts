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
	for (const [type, children] of Object.entries(OBJECT_COMPOUNDS) as [SyncName, SyncName[]][]) {
		const subs = children.map((child) => OBJECT_SUBSCRIPTIONS[child]).flat();
		if (subs.filter(sub => subscriptions.includes(sub)).length / subs.length >= 0.5) {
			requests.push(type);
		}
	}
	const skips = requests.reduce((acc, type) => acc.concat([type], OBJECT_COMPOUNDS[type]), [] as SyncName[]);
	for (const [type, subs] of Object.entries(OBJECT_SUBSCRIPTIONS) as [SyncName, SubscriptionType[]][]) {
		if (
			!skips.includes(type)
			&& subs.some(sub => subscriptions.includes(sub))
		) {
			requests.push(type);
		}
	}
	return requests;
}