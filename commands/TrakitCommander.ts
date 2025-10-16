import {
	ErrorCode,
	Payload,
	Reply,
	RepSelfGet,
} from '@trakit/commands';
import {
	guid,
	JsonObject,
	JsonValue,
	Machine,
	nothing,
	url,
} from '@trakit/objects';

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
			"message": ex.message,
			"stack": ex.stack ?? null,
			"value": response ?? null,
		}
	};
}

/**
 * The base class used to help define interaction with all Trak-iT API services.
 */
export abstract class TrakitCommander<TRequest> {
	/**
	 * Details of the {@link User} or {@link Machine} who is connected to the underlying Trak-iT API service.
	 */
	account!: RepSelfGet;
    
	/**
	 * {@link url} of the underlying Trak-iT API service.
	 */
	baseAddress: URL;
	/**
	 * Additional (optional) values added to the query-string of the connection request.
	 */
	readonly query = new Map<string, string>();
	/**
	 * Additional (optional) HTTP headers added to the connection request.
	 */
	readonly headers = new Map<string, string>();

	/**
	 * Returns the {@link baseAddress} with the appropriate path, query values.
	 * @param path  Optional path to append to the base address.
	 * @returns     The constructed URL string.
	 */
	protected createBaseUrl(path: string | null = null): URL {
		const route = new URL(path ?? "", this.baseAddress),
			query = new Map(this.query);
		for (const [key, value] of query) {
			route.searchParams.append(key, value);
		}
		return route;
	}

	constructor(baseAddress?: url | nothing, account?: RepSelfGet | nothing) {
		this.baseAddress = new URL(baseAddress || self.location?.origin);
		this.setAuth(account || new RepSelfGet);
	}

	//#region Authorization
	/**
	 * Sets the authentication mechanism using either a session id or a Machine object.
	 * @param value  The session id (string), {@link Machine} object, or {@link RepSelfGet} object.
	 */
	setAuth(
		value?: RepSelfGet
			| Machine
			| { key: string }
			| { ghostId: guid }
			| guid
			| nothing
	): void {
		if (value instanceof RepSelfGet) {
			this.account = value;
		} else {
			this.account.machine = null;
			this.account.ghostId = "";
			if (typeof value === "string") {
				this.account.ghostId = value as guid;
			} else if (value instanceof Machine) {
				this.account.machine = value;
			} else if ((value as any)?.key) {
				this.setAuth(new Machine(value));
			} else if ((value as any)?.machine?.key) {
				this.setAuth((value as any).machine as { key: string });
			} else if ((value as any)?.ghostId) {
				this.setAuth((value as any).ghostId as guid);
			}
		}
	}
	//#endregion Authorization

	/**
	 * Sends a command to the underlying service, and returns a Promise that completes when a reply is received.
	 * @param payload   The payload to send to the service.
	 * @returns         A promise that settles based on the underlying service's response.
	 */
	command<TReply extends Reply>(payload: Payload): Promise<TReply> {
		return new Promise(async (resolve, reject) => {
			let request: TRequest | null = null,
				response: any = null,
				reply: TReply | null = null;
			try {
				request = this._createRequest(payload);
			} catch (ex: Error | any) {
				response = createClientErrorResponse(ex);
			}
			try {
				response = response
					?? await this._relayRequest(request as TRequest);
			} catch (ex: Reply | Error | any) {
				reply = payload.createReply(
					ex instanceof Error
						? createClientErrorResponse(ex)
						: ex
				) as TReply;
			}
			try {
				reply = reply
					?? payload.createReply(response) as TReply;
			} catch (ex: Error | any) {
				reply = payload.createReply(createClientErrorResponse(ex, response)) as TReply;
			}
			(reply.errorCode === ErrorCode.success ? resolve : reject)(reply);
		});
	}

	/**
	 * Creates a request object to send to the underlying service.
	 * @param payload The payload to send to the underlying service.
	 * @returns       The request object to send to the underlying service.
	 */
	abstract _createRequest(payload: Payload): TRequest;
	/**
	 * Sends a request to the underlying service, and returns a Promise that completes when a reply is received.
	 * @param request	The request object to send to the service.
	 * @returns			A promise that resolves for any response, and rejects for client-side and transport errors.
	 */
	abstract _relayRequest(request: TRequest): Promise<any>;
}