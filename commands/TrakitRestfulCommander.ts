import {
	ErrorCode,
	IPayListByAsset,
	IPayListByBillingProfile,
	IPayListByCompany,
	IPayListByDate,
	IPayListById,
	IPayListByKey,
	IPayListByLabels,
	IPayListByReferences,
	IPayListByUser,
	IPaySingle,
	Payload,
	Reply,
} from "@trakit/commands";
import {
	nothing,
	url,
	utility,
 } from "@trakit/objects";
import { TrakitObjectCommander } from "./TrakitObjectCommander";
import { SUBSCRIPTION_LIST_BY_ASSET, SUBSCRIPTION_LIST_BY_BILLING_PROFILE, SUBSCRIPTION_LIST_BY_COMPANY } from "common/Subscriptions";

/**
 * The HTTP verbs supported by the Trak-iT RESTful API.
 */
type HttpVerb = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

/**
 * Creates a standardized error response.
 * @param ex The error to include in the response.
 * @returns A standardized error response object.
 */
function createClientErrorResponse(ex: any): any {
	return {
		"errorCode": ErrorCode.unknown,
		"message": "Client exception",
		"errorDetails": ex instanceof Error
			? {
				"kind": "stack",
				"message": ex.message,
				"stack": ex.stack,
			}
			: {
				"kind": "externals",
				"errors": [JSON.stringify(ex)],
			},
	}
}

/**
 * Splits Pascal-case words into their components.
 */
const SPLITTER = /[A-Z][a-z]+/;

/**
 * 
 */
export class TrakitRestfulCommander extends TrakitObjectCommander {
	/**
	 * Production RESTful service URL.
	 * This service is covered by the SLA and should be used for serices and code running in your own production environment.
	 * Both services access the same data-set, so be careful making changes as they will be reflected in production as well.
	 */
	static readonly URI_PROD: url = "https://rest.trakit.ca/";
	/**
	 * Testing or beta RESTful service URL.
	 * This service is not covered by the SLA and should be used to test your own code before deployment.
	 * Throttling of connections and commands is tighter to help you diagnose issues before switching to production.
	 * Both services access the same data-set, so be careful making changes as they will be reflected in production as well.
	 */
	static readonly URI_BETA: url = "https://mindflayer.trakit.ca/";

	constructor(baseAddress: url | nothing) {
		super(baseAddress || TrakitRestfulCommander.URI_PROD);
		this.headers.set("Content-Type", "application/json");
	}

	/**
	 * Gets the appropriate HTTP verb and route for the given payload.
	 * @param payload	The payload to analyze.
	 * @returns A tuple containing the HTTP verb and route.
	 */
	getVerbRoute(payload: Payload): [HttpVerb, string] {
		let verb: HttpVerb = "GET",
			route = "",
			query = "";
		const action = payload.getAction();
		switch (action.object) {
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
											.map(utility.plural)
											.join("/");
				/*
				"Get"
				| "List"
				| "Merge"
				| "Delete"
				| "Restore"
				| "Suspend"
				| "Reactivate"
				 */
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
									route = action.object in SUBSCRIPTION_LIST_BY_BILLING_PROFILE
										? SUBSCRIPTION_LIST_BY_BILLING_PROFILE[action.object as keyof typeof SUBSCRIPTION_LIST_BY_BILLING_PROFILE].replace("{profileId}", (payload as any).billingProfile.id)
										: `billing/profiles/${(payload as any as IPayListByBillingProfile).billingProfile.id}/${route}`;
									break;
								case "BillingProfile":	// IPayListByBillingProfile
									route = action.object in SUBSCRIPTION_LIST_BY_BILLING_PROFILE
										? SUBSCRIPTION_LIST_BY_BILLING_PROFILE[action.object as keyof typeof SUBSCRIPTION_LIST_BY_BILLING_PROFILE].replace("{profileId}", (payload as any).billingProfile.id)
										: `billing/profiles/${(payload as any as IPayListByBillingProfile).billingProfile.id}/${route}`;
									break;
								case "Company":	// IPayListByCompany
									route = action.object in SUBSCRIPTION_LIST_BY_COMPANY
										? SUBSCRIPTION_LIST_BY_COMPANY[action.object as keyof typeof SUBSCRIPTION_LIST_BY_COMPANY].replace("{companyId}", (payload as any).company.id)
										: `companies/${(payload as any as IPayListByCompany).company.id}/${route}`;
									break;
								case "Asset":	// IPayListByAsset
									route = action.object in SUBSCRIPTION_LIST_BY_ASSET
										? SUBSCRIPTION_LIST_BY_ASSET[action.object as keyof typeof SUBSCRIPTION_LIST_BY_ASSET].replace("{assetId}", (payload as any).asset.id)
										: `assets/${(payload as any as IPayListByAsset).asset.id}/${route}`;
									break;
								case "User":	// IPayListByUser
									route = `users/${encodeURIComponent((payload as any as IPayListByUser).user.login)}/${route}`;
									break;
							}
							// type IPayListByDate
							if (utility.isntNaN((payload as any as IPayListByDate)?.after?.valueOf())) {
								query += "&after=" + encodeURIComponent(((payload as any as IPayListByDate).after as Date).toISOString());
							}
							if (utility.isntNaN((payload as any as IPayListByDate)?.before?.valueOf())) {
								query += "&before=" + encodeURIComponent(((payload as any as IPayListByDate).before as Date).toISOString());
							}
							// type IPayListById
							if (utility.isntNaN((payload as any as IPayListById)?.lowest)) {
								query += "&lowest=" + (payload as any as IPayListById).lowest;
							}
							if (utility.isntNaN((payload as any as IPayListById)?.highest)) {
								query += "&highest=" + (payload as any as IPayListById).highest;
							}
							//// type IPayListByKey
							if ((payload as any as IPayListByKey)?.first) {
								query += "&first=" + (payload as any as IPayListByKey).first;
							}
							if ((payload as any as IPayListByKey)?.last) {
								query += "&last=" + (payload as any as IPayListByKey).last;
							}
							// type IPayListByLabels
							if ((payload as any as IPayListByLabels)?.labels?.length) {
								query += "&labels=" + encodeURIComponent((payload as any as IPayListByLabels).labels.join(","));
							}
							// type IPayListByReferences
							if ((payload as any as IPayListByReferences)?.references?.size) {
								query += "&" + ((payload as any as IPayListByReferences).references as Map<string, string>)
									.entries()
									.map(([k, v]) => encodeURIComponent(k) + "=" + encodeURIComponent(v))
									.toArray()
									.join("&");
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
		if (query.length) route += route.includes("?") ? query : "?" + + query.substring(1);
		return [verb, route];
	}

	/**
	 * Creates a request object for the specified HTTP method and body.
	 * @param path The URL path for the request.
	 * @param verb The HTTP method to use (GET, POST, etc.).
	 * @param body The request body to include (if applicable).
	 * @returns A Request object configured with the specified parameters.
	 */
	createRequest(path: url, verb: HttpVerb, body: any): Request {
		const route = this.createBaseUrl(path),
			headers = new Map(this.headers),
			init: any = {
				method: verb,
			};
		if (body && verb !== "GET") {
			init.body = JSON.stringify(body);
		}
		if (this._machine) {
			headers.set("Authorization", "HMAC256 " + this._machine.createHmacSignature(
				route,
				verb,
				(init.body ?? "").length,
				new Date
			));
		}
		if (headers.size > 0) {
			init.headers = {};
			for (const [key, value] of headers) {
				init.headers[key] = value;
			}
		}
		return new Request(route, init);
	}

	/**
	 * Sends a command to the underlying service, and returns a Promise that completes when a reply is received.
	 * @param payload   The payload to send to the service.
	 * @returns         A promise that resolves with the reply.
	 */
	override command<TReply extends Reply>(payload: Payload): Promise<TReply> {
		return new Promise(async (resolve, reject) => {
			let verb: HttpVerb,
				path: string,
				body: any,
				reply: TReply | null = null;
			try {
				[verb, path] = this.getVerbRoute(payload);
				body = payload.toJSON();
			} catch (ex: Error | any) {
				verb = "GET";
				path = "";
				reply = payload.createReply(createClientErrorResponse(ex)) as TReply;
			}
			if (!reply) {
				try {
					reply = payload.createReply(await this.send(path, verb, body)) as TReply;
				} catch (ex: Reply | any) {
					reply = payload.createReply(ex) as TReply;
				}
			}
			(reply.errorCode === ErrorCode.success ? resolve : reject)(reply);
		});
	}

	/**
	 * Sends the given request to Trak-iT's RESTful API and awaits a result.
	 * @param path	Relative path to the resource being accessed.
	 * @param verb	HTTP method to use for the request.
	 * @param body	Optional JSON body to send with the request.
	 * @returns		A promise that resolves with the JSON response from the server.
	 */
	send(path: url, verb: HttpVerb = "GET", body?: any): Promise<any> {
		return new Promise(async (resolve, reject) => {
			try {
				const request = this.createRequest(path, verb, body),
					response = await fetch(request);
				resolve(await response.json());
			} catch (ex: Error | any) {
				reject(createClientErrorResponse(ex));
			}
		});
	}
}