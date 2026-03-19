import {
	Payload,
	RepSelfGet
} from "@trakit/commands";
import {
	guid, JsonObject, Machine,
	nothing,
	url
} from "@trakit/objects";
import { createClientErrorResponse } from "../API/Functions";
import { TrakitObjectCommander } from "../API/TrakitObjectCommander";
import {
	HttpVerb
} from "./Constants";
import { makeVerbRoute } from "./Functions";

/**
 * Uses Trak-iT's RESTful service to access and manipulate Trak-iT API objects.
 */
export class TrakitRestfulCommander extends TrakitObjectCommander<Request> {
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

	constructor(
		account?: RepSelfGet | { machine: { key: string } }
			| Machine | { key: string }
			| { ghostId: guid }
			| guid
			| nothing,
		baseAddress?: URL | url | nothing,
	) {
		super(account, baseAddress ?? TrakitRestfulCommander.URI_PROD);
		//this.headers.set("Content-Type", "application/json");
	}

	/**
	 * Gets the appropriate HTTP verb and route for the given payload.
	 * @param payload	The payload to analyze.
	 * @returns A tuple containing the HTTP verb and route.
	 */
	static readonly getVerbRoute = (payload: Payload): [HttpVerb, string] => makeVerbRoute(payload);

	/**
	 * Creates a request object for the specified HTTP method and body.
	 * @param payload 
	 * @returns A {@link Request} object configured with the specified parameters.
	 */
	override async _createRequest(payload: Payload): Promise<Request> {
		const [verb, path] = makeVerbRoute(payload),
			body = payload.toJSON(),
			route = this.createBaseUrl(path),
			headers = new Map(this.headers),
			init: RequestInit = {
				method: verb,
				cache: "no-store",
				mode: "cors",
				credentials: "omit",
			};
		if (body && verb !== "GET") {
			init.body = JSON.stringify(body);
		}
		if (this.account.machine) {
			headers.set(
				"Authorization",
				this.account.machine.secret?.length
					? "HMAC256 " + btoa(
						this.account.machine.key
						+ ":"
						+ (await this.account.machine.createHmacSignature(
							route,
							verb,
							(init.body as string)?.length ?? 0,
							new Date
						))
					)
					: "Machine " + btoa(
						this.account.machine.key
					)
			);
		} else if (this.account.ghostId) {
			headers.set(
				"Authorization",
				"Bearer " + this.account.ghostId
			);
		}
		if (headers.size > 0) {
			init.headers = new Headers([...headers.entries()]);
		}
		return new Request(route, init);
	}
	/**
	 * Sends the given request to Trak-iT's RESTful API and awaits a result.
	 * @param request.path	Relative path to the resource being accessed.
	 * @param request.verb	HTTP method to use for the request.
	 * @param request.body	Optional JSON body to send with the request.
	 * @returns				A promise that resolves with the JSON response from the server.
	 */
	override _relayRequest(request: Request): Promise<JsonObject> {
		return new Promise(async (resolve, reject) => {
			try {
				const response = await fetch(request);
				resolve((await response.json()) as JsonObject);
			} catch (ex: Error | any) {
				reject(createClientErrorResponse(ex));
			}
		});
	}
}