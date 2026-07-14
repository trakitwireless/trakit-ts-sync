import {
	PayAssetAdvancedAudit,
	Payload,
	RepAssetAdvancedAudit,
	RepSelfGet
} from "@trakit/commands";
import {
	AssetAdvanced,
	datetime,
	guid,
	JsonObject,
	Machine,
	nothing,
	uint,
	ulong,
	url,
} from "@trakit/objects";
import {
	requestCreateCommander,
	requestRelayCorsJson,
} from "../API/Functions";
import { TrakitBaseCommander } from "../API/TrakitBaseCommander";

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
		return requestCreateCommander(this, payload);
	}
	/**
	 * Sends the given request to Trak-iT's RESTful API and awaits a result.
	 * @param request.path	Relative path to the resource being accessed.
	 * @param request.verb	HTTP method to use for the request.
	 * @param request.body	Optional JSON body to send with the request.
	 * @returns				A promise that resolves with the JSON response from the server.
	 */
	override requestRelay(request: Request): Promise<JsonObject> {
		return requestRelayCorsJson(request);
	}

	//override command<TReply extends Reply>(payload: Payload): Promise<TReply> {
	//	// TODO: check if it's already saved and just return that?
	//	// TODO: save it somehow so we don't re-poll all the time?
	//	return super.command<TReply>(payload);
	//}

	//#region Assets/Advanced
	/**
	 * 
	 * @param asset 
	 * @returns 
	 */
	pollAssetAdvanced(asset: AssetAdvanced, limit?: ulong | nothing) {
		return this.pageAssetAdvanced(asset.id, {
			before: asset.position?.date
				?? [...asset.attributes.values()].reduce(
					(latest, attr) => attr.dts > latest ? attr.dts : latest,	// in case the server timestamp is out of sync with the client
					new Date
				),
			highest: asset.v[0],
			limit,
		});
	}
	/**
	 * 
	 * @param id 
	 * @param constraints.after
	 * @param constraints.before
	 * @param constraints.lowest
	 * @param constraints.highest
	 * @param constraints.limit
	 * @returns 
	 */
	pageAssetAdvanced(id: ulong, constraints?: {
		after?: Date | datetime;
		before?: Date | datetime;
		lowest?: uint | nothing;
		highest?: uint | nothing;
		limit?: ulong | nothing;
	}) {
		return this.command<RepAssetAdvancedAudit>(new PayAssetAdvancedAudit({
			...constraints as JsonObject,
			asset: { id },
		}));
	}
	//#endregion Assets/Advanced
}