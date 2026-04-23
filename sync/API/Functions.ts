import * as commands from "@trakit/commands";
import { ErrorCode, IPayListByAsset, IPayListByBillingProfile, IPayListByCompany, IPayListByLabels, IPayListByReferences, IPayListByUser, IPaySingle, Payload, PayloadListByDate, PayloadListById, PayloadListByKey, Reply, RepSelfGet } from "@trakit/commands";
import { codified, email, guid, JsonObject, JsonValue, nothing, SyncName, ulong, utility } from "@trakit/objects";
import { HttpVerb, OBJECT_LIST_BY_ASSET, OBJECT_LIST_BY_BILLING_PROFILE, OBJECT_LIST_BY_COMPANY } from "../RESTful/Constants";

/**
 * Splits Pascal-case words into their components.
 */
export const SPLITTER = /[A-Z][a-z]+/;

/**
 * Creates a standardized error response.
 * @param ex The error to include in the response.
 * @returns A standardized error response object.
 */
export function createClientErrorResponse(ex: Error, response?: JsonValue): JsonObject {
	return {
		"errorCode": ErrorCode.unknown,
		"message": "Client exception",
		"errorDetails": {
			"kind": "stack",
			"message": ex?.message ?? "Unknonwn error",
			"stack": ex?.stack ?? null,
			"value": response ?? null,
		}
	};
}

/**
 * Returns the name of the identifying key for the given Trak-iT Object type.
 * @param type 
 * @returns 
 */
export function getJsonKeyName(type: SyncName) {
	switch (type) {
		case "User":
		case "UserGeneral":
		case "UserAdvanced":
			return "login";
		case "ProviderRegistration":
			return "code";
		case "Session":
			return "handle";
		case "Machine":
			return "key";
		case "Dashcam":
			return "guid";
		default:
			return "id";
	}
}
/**
 * Returns the value of the identifying key for the given Trak-iT Object.
 * @param json 
 * @param type 
 * @returns 
 */
export function getJsonKeyValue(json: JsonObject, type: SyncName): ulong | guid | email | codified | string {
	return json[getJsonKeyName(type)] as ulong | guid | email | codified | string;
}


/**
 * Translated type name to object name to account for some legacy message names.
 * @param typeName 
 * @returns 
 */
export function makeObjectName(typeName: string): SyncName {
	typeName = utility.capitalize(typeName);
	switch (typeName) {
		case "CompanyLabels":
			typeName = "CompanyStyle";
			break;
		default:
			typeName = utility.singularize(typeName);
			break;
	}
	return typeName as SyncName;
}

/**
 * Factory to create Payload classes based on type name.
 * @param type		SyncName representing the type of the payload.
 * @param suffix	Optional suffix to append to the class name.  Defaults to "Get".
 * @returns 
 */
export function makePayloadClass(type: SyncName, suffix?: string | nothing): (new (json: JsonObject) => Payload) | nothing {
	const name = "Pay" + type + (suffix ?? "Get");
	return commands[name as keyof typeof commands] as new (json: JsonObject) => Payload;
}
/**
 * Factory to create Reply classes based on type name.
 * @param type		SyncName representing the type of the reply.
 * @param suffix	Optional suffix to append to the class name.  Defaults to "Get".
 * @returns 
 */
export function makeReplyClass(type: SyncName, suffix?: string | nothing): (new (json: JsonObject) => Reply) | nothing {
	const name = "Rep" + type + (suffix ?? "Get");
	return commands[name as keyof typeof commands] as new (json: JsonObject) => Reply;
}

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
export async function makeCorsRequest(
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
/**
 * Issues a fetch request and returns the response as a {@link JsonObject}.
 * If the fetch fails, returns a standardized error response object.
 * @param request 
 * @returns 
 */
export async function fetchJsonObject(request: Request): Promise<JsonObject> {
	try {
		return (await (await fetch(request)).json()) as JsonObject;
	} catch (ex: Error | any) {
		throw createClientErrorResponse(ex);
	}
}