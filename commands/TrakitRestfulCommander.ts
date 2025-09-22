import { ErrorCode, Payload, Reply, TrakitObjectCommander } from "@trakit/commands";
import { nothing, url } from "@trakit/objects";

/**
 * The HTTP methods supported by the Trak-iT RESTful API.
 */
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

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
	}

	createRequest(payload: Payload): Request {




		// return [this.createBaseUrl(), {
		// 	method,
		// 	headers: {
		// 		"Content-Type": "application/json",
		// 		"Authorization": `Bearer ${this.token}`
		// 	},
		// 	body: method === "GET"
		// 		? undefined
		// 		: JSON.stringify(payload)
		// }];
	}

	/**
	 * 
	 * @param payload 
	 */
	override command<TReply extends Reply>(payload: Payload): Promise<TReply>
	command<TReply extends Reply>(path: url, method?: HttpMethod, payload?: any): Promise<TReply>
	command<TReply extends Reply>(pathOrPayload: any, method: HttpMethod = "GET", payload: any = null): Promise<TReply> {
		if (pathOrPayload instanceof Payload) {
			return this.command("path", "GET", payload);
		} else {
			return new Promise(async (resolve, reject) => {
				try {
					const request = this.createRequest(payload),
						response = await fetch(request),
						json = await response.json();
					if (json["errorCode"] === 0) {
						const reply = this.getReplyType() as typeof Reply;
						resolve(new reply(json));
					} else {
						reject(new Reply(json));
					}
				} catch (ex) {
					reject(new Reply({
						"errorCode": ErrorCode.service,
						"message": "Client exception",
						"errorDetails": ex,
					}));
				}
			});
		}
	}
}