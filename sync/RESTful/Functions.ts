import {
	IPayListByAsset,
	IPayListByBillingProfile,
	IPayListByCompany,
	IPayListByLabels,
	IPayListByReferences,
	IPayListByUser,
	IPaySingle,
	PayloadListByDate,
	PayloadListById,
	PayloadListByKey, Payload,
	RepSelfGet
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
export function payloadToVerbRoute(payload: Payload): [HttpVerb, string] {
	const action = payload.getAction();
	let verb: HttpVerb = "GET",
		query = new URLSearchParams,
		route = [...action.object.match(SPLITTER) as string[]]
			.map(s => utility.pluralize(s.toLowerCase()))
			.join("/");
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
				if ((payload as any as IPaySingle).getKey) {
					route = utility.isCompounded(action.object)
						? route.replace("/", "/" + (payload as any as IPaySingle).getKey() + "/")
						: route + "/" + (payload as any as IPaySingle).getKey();
				}
				switch (action.kind) {
					case "Get":
						//verb = "GET";
						break;
					case "List":
						//verb = "GET";
						switch (action.filter) {
							case "Asset":	// IPayListByAsset
								route = action.object in OBJECT_LIST_BY_ASSET
									? OBJECT_LIST_BY_ASSET[action.object as keyof typeof OBJECT_LIST_BY_ASSET].replace("{assetId}", (payload as any).asset.id)
									: `assets/${(payload as any as IPayListByAsset).asset.id}/${route}`;
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
							case "User":	// IPayListByUser
								route = `users/${encodeURIComponent((payload as any as IPayListByUser).user.login)}/${route}`;
								break;
						}
						// type IPayListByDate
						if (utility.isntNaN((payload as any as PayloadListByDate)?.after?.valueOf())) {
							query.set("after", ((payload as any as PayloadListByDate).after as Date).toISOString());
						}
						if (utility.isntNaN((payload as any as PayloadListByDate)?.before?.valueOf())) {
							query.set("before", ((payload as any as PayloadListByDate).before as Date).toISOString());
						}
						// type IPayListById
						if (utility.isntNaN((payload as any as PayloadListById)?.lowest)) {
							query.set("lowest", (payload as any as PayloadListById).lowest as any as string);
						}
						if (utility.isntNaN((payload as any as PayloadListById)?.highest)) {
							query.set("highest", (payload as any as PayloadListById).highest as any as string);
						}
						//// type IPayListByKey
						if ((payload as any as PayloadListByKey)?.first) {
							query.set("first", (payload as any as PayloadListByKey).first as string);
						}
						if ((payload as any as PayloadListByKey)?.last) {
							query.set("last", (payload as any as PayloadListByKey).last as string);
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

/**
 * Constructs a CORS request for a Trak-iT API endpoint with the given account and request details.
 * This method handles authentication headers based on the account's Machine or User's credentials.
 * @param account 
 * @param route 
 * @param verb 
 * @param body 
 * @param defaultHeaders 
 * @returns 
 */
export async function createCorsRequest(
	account: RepSelfGet,
	route: URL,
	verb: HttpVerb = "GET",
	body: BodyInit | null = null,
	defaultHeaders: Map<string, string> | null = null
): Promise<Request> {
	const headers = new Map(defaultHeaders),
		init: RequestInit = {
			method: verb,
			cache: "no-store",
			mode: "cors",
			credentials: "omit",
		};
	if (body && verb !== "GET") {
		init.body = body;
	}
	if (account.machine) {
		headers.set(
			"Authorization",
			account.machine.secret?.length
				? "HMAC256 " + btoa(
					account.machine.key
					+ ":"
					+ (await account.machine.createHmacSignature(
						route,
						verb,
						(init.body as string)?.length ?? 0,
						new Date
					))
				)
				: "Machine " + btoa(
					account.machine.key
				)
		);
	} else if (account.ghostId) {
		headers.set(
			"Authorization",
			"Bearer " + account.ghostId
		);
	}
	if (headers.size > 0) {
		init.headers = new Headers([...headers.entries()]);
	}
	return new Request(route, init);
}