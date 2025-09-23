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
		this.headers.set("Content-Type", "application/json");
	}

	//createRequest(payload: Payload): Request {




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
	//}
	createRequest(path: url, method: HttpMethod, body: any): Request {
		const route = this.createBaseUrl(path),
			headers = new Map(this.headers),
			init: any = {
				method,
			};
		if (body && method !== "GET") {
			init.body = JSON.stringify(body);
		}
		if (this._machine) {
			headers.set("Authorization", "HMAC256 " + this._machine.createHmacSignature(
				route,
				method,
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
	 * 
	 * @param payload 
	 */
	override command<TReply extends Reply>(payload: Payload): Promise<TReply> {
		return new Promise(async (resolve, reject) => {
			try {
				const path = "",// to be built from payload.getNameParts()
					method = "GET",// to be built from payload.getNameParts()
					body = payload.toJSON(),
					response = await this.send(path, method, body),
					reply = payload.createReply(response) as TReply;
				(reply.errorCode === ErrorCode.success ? resolve : reject)(reply);
			} catch (ex) {
				reject(new Reply({
					"errorCode": ErrorCode.service,
					"message": "Client exception",
					"errorDetails": ex,
				}));
			}
		});
	}

	/**
	 * Sends the given request to Trak-iT's RESTful API and awaits a result.
	 * @param path		Relative path to the resource being accessed.
	 * @param method	HTTP method to use for the request.
	 * @param body		Optional JSON body to send with the request.
	 * @returns			A promise that resolves with the JSON response from the server.
	 */
	send(path: url, method: HttpMethod = "GET", body?: any): Promise<any> {
		return new Promise(async (resolve, reject) => {
			try {
				const request = this.createRequest(path, method, body),
					response = await fetch(request);
				resolve(await response.json());
			} catch (ex) {
				reject({
					"errorCode": ErrorCode.unknown,
					"message": "Client exception",
					"errorDetails": ex,
				});
			}
		});
	}
}