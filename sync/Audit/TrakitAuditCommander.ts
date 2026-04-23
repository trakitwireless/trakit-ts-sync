import {
	Payload,
	RepSelfGet
} from "@trakit/commands";
import {
	guid, JsonObject, Machine,
	nothing,
	url
} from "@trakit/objects";
import { fetchJsonObject } from "../API/Functions";
import { TrakitBaseCommander } from "../API/TrakitBaseCommander";
import { createCorsRequest, payloadToVerbRoute } from "../RESTful/Functions";

/**
 * Uses Trak-iT's RESTful service to access and manipulate Trak-iT API objects.
 */
export class TrakitAuditCommander extends TrakitBaseCommander<Request> {
	/**
	 * Production RESTful service URL.
	 * This service is covered by the SLA and should be used for serices and code running in your own production environment.
	 * Both services access the same data-set, so be careful making changes as they will be reflected in production as well.
	 */
	static readonly URI_PROD: url = "https://audit.trakit.ca/";
	/**
	 * Testing or beta RESTful service URL.
	 * This service is not covered by the SLA and should be used to test your own code before deployment.
	 * Throttling of connections and commands is tighter to help you diagnose issues before switching to production.
	 * Both services access the same data-set, so be careful making changes as they will be reflected in production as well.
	 */
	static readonly URI_BETA: url = "https://gloomhands.trakit.ca/";

	constructor(
		account?: RepSelfGet | { machine: { key: string } }
			| Machine | { key: string }
			| { ghostId: guid }
			| guid
			| nothing,
		baseAddress?: URL | url | nothing,
	) {
		super(account, baseAddress ?? TrakitAuditCommander.URI_PROD);
		//this.headers.set("Content-Type", "application/json");
	}

	/**
	 * Creates a request object for the specified HTTP method and body.
	 * @param payload 
	 * @returns A {@link Request} object configured with the specified parameters.
	 */
	override requestCreate(payload: Payload): Promise<Request> {
		const [_, path] = payloadToVerbRoute(payload);
		return createCorsRequest(
			this.account,
			this.createBaseUrl(path),
			"GET",
			null,
			this.headers
		);
	}
	/**
	 * Sends the given request to Trak-iT's RESTful API and awaits a result.
	 * @param request.path	Relative path to the resource being accessed.
	 * @param request.verb	HTTP method to use for the request.
	 * @param request.body	Optional JSON body to send with the request.
	 * @returns				A promise that resolves with the JSON response from the server.
	 */
	override requestRelay(request: Request): Promise<JsonObject> {
		return fetchJsonObject(request);
	}
}