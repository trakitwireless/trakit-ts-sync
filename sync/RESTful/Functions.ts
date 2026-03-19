import {
	IPayListByAsset,
	IPayListByBillingProfile,
	IPayListByCompany,
	IPayListByLabels,
	IPayListByReferences,
	IPayListByUser,
	IPaySingle,
	PayListByDate,
	PayListById,
	PayListByKey, Payload
} from "@trakit/commands";
import { utility } from "@trakit/objects";
import {
	HttpVerb,
	OBJECT_LIST_BY_ASSET,
	OBJECT_LIST_BY_BILLING_PROFILE,
	OBJECT_LIST_BY_COMPANY,
} from "./Constants";

/**
 * Splits Pascal-case words into their components.
 */
const SPLITTER = /[A-Z][a-z]+/;

/**
 * Gets the appropriate HTTP verb and route for the given payload.
 * @param payload	The payload being sent.
 * @returns			A tuple containing the HTTP verb and route.
 */
export function makeVerbRoute(payload: Payload): [HttpVerb, string] {
	let verb: HttpVerb = "GET",
		route = "",
		query = new URLSearchParams;
	const action = payload.getAction();
	switch (action.object as string) {
		case "Self":
			if (action.kind == "Get") {
				verb = "GET";
				route = "self";
			} else {
				verb = "POST";
				route = "self/" + action.filter.toLowerCase();
			}
			break;
		case "Subscription":
			throw new Error(action.object + " only supported by TrakitSocketCommander", { cause: action });
		case "DispatchJob":
			switch (action.filter) {
				case "Cancel":
					verb = !action.batch ? "POST" : "PATCH";
					route += "/cancel";
					break;
				case "Change":
					verb = !action.batch ? "PUT" : "PATCH";
					break;
			}
		// no break => fall through to default for DispatchJob where filter is not Cancel or Change
		default:
			route = [...action.object.match(SPLITTER) as string[]]
				.map(s => utility.pluralize(s.toLowerCase()))
				.join("/");
			if (action.batch) {
				verb = "PATCH";
				switch (action.kind) {
					case "Get":
					case "List":
						verb = "GET";
						break;
					case "Merge":
						break;
					case "Delete":
						verb = "DELETE";
						break;
					case "Restore":
						route += "/restore";
						break;
					case "Suspend":
						route += "/suspend";
						break;
					case "Reactivate":
						route += "/revive";
						break;
				}
			} else {
				if ((payload as any).getKey) {
					route += "/" + (payload as any as IPaySingle).getKey();
				}
				switch (action.kind) {
					case "Get":
						//verb = "GET";
						break;
					case "List":
						//verb = "GET";
						switch (action.filter) {
							case "BillingProfile":	// IPayListByBillingProfile
								route = action.object in OBJECT_LIST_BY_BILLING_PROFILE
									? OBJECT_LIST_BY_BILLING_PROFILE[action.object as keyof typeof OBJECT_LIST_BY_BILLING_PROFILE].replace("{profileId}", (payload as any).billingProfile.id)
									: `billing/profiles/${(payload as any as IPayListByBillingProfile).billingProfile.id}/${route}`;
								break;
							case "BillingProfile":	// IPayListByBillingProfile
								route = action.object in OBJECT_LIST_BY_BILLING_PROFILE
									? OBJECT_LIST_BY_BILLING_PROFILE[action.object as keyof typeof OBJECT_LIST_BY_BILLING_PROFILE].replace("{profileId}", (payload as any).billingProfile.id)
									: `billing/profiles/${(payload as any as IPayListByBillingProfile).billingProfile.id}/${route}`;
								break;
							case "Company":	// IPayListByCompany
								route = action.object in OBJECT_LIST_BY_COMPANY
									? OBJECT_LIST_BY_COMPANY[action.object as keyof typeof OBJECT_LIST_BY_COMPANY].replace("{companyId}", (payload as any).company.id)
									: `companies/${(payload as any as IPayListByCompany).company.id}/${route}`;
								break;
							case "Asset":	// IPayListByAsset
								route = action.object in OBJECT_LIST_BY_ASSET
									? OBJECT_LIST_BY_ASSET[action.object as keyof typeof OBJECT_LIST_BY_ASSET].replace("{assetId}", (payload as any).asset.id)
									: `assets/${(payload as any as IPayListByAsset).asset.id}/${route}`;
								break;
							case "User":	// IPayListByUser
								route = `users/${encodeURIComponent((payload as any as IPayListByUser).user.login)}/${route}`;
								break;
						}
						// type IPayListByDate
						if (utility.isntNaN((payload as any as PayListByDate)?.after?.valueOf())) {
							query.set("after", ((payload as any as PayListByDate).after as Date).toISOString());
						}
						if (utility.isntNaN((payload as any as PayListByDate)?.before?.valueOf())) {
							query.set("before", ((payload as any as PayListByDate).before as Date).toISOString());
						}
						// type IPayListById
						if (utility.isntNaN((payload as any as PayListById)?.lowest)) {
							query.set("lowest", (payload as any as PayListById).lowest as any as string);
						}
						if (utility.isntNaN((payload as any as PayListById)?.highest)) {
							query.set("highest", (payload as any as PayListById).highest as any as string);
						}
						//// type IPayListByKey
						if ((payload as any as PayListByKey)?.first) {
							query.set("first", (payload as any as PayListByKey).first as string);
						}
						if ((payload as any as PayListByKey)?.last) {
							query.set("last", (payload as any as PayListByKey).last as string);
						}
						// type IPayListByLabels
						if ((payload as any as IPayListByLabels)?.labels?.length) {
							query.set("labels", (payload as any as IPayListByLabels).labels.join(","));
						}
						// type IPayListByReferences
						if ((payload as any as IPayListByReferences)?.references?.size) {
							for (const [k, v] of (payload as any as IPayListByReferences).references.entries()) {
								query.set(k, v);
							}
						}
						break;
					case "Merge":
						verb = "POST";
						break;
					case "Delete":
						verb = "DELETE";
						break;
					case "Restore":
						verb = "PATCH";
						route += "/restore";
						break;
					case "Suspend":
						verb = "PATCH";
						route += "/suspend";
						break;
					case "Reactivate":
						verb = "PATCH";
						route += "/revive";
						break;
				}
				break;
			}
	}
	return [
		verb,
		query.size
			? route + "?" + query.toString()
			: route
	];
}