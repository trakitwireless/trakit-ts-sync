import {
	Payload,
	Reply,
	RepSelfGet,
} from '@trakit/commands';
import {
	guid,
	Machine,
	nothing,
	url,
} from '@trakit/objects';

/**
 * The base class used to help define interaction with all Trak-iT API services.
 */
export abstract class TrakitCommander {
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
		if (this._sessionId) {
			query.set("ghostId", this._sessionId);
		}
		for (let [key, value] of query) {
			route.searchParams.append(key, value);
		}
		return route;
	}

	constructor(baseAddress?: url | nothing) {
		this.baseAddress = new URL(baseAddress || "");
	}

	//#region Authorization
	// saved API credentials when using a service account
	protected _machine?: Machine | null = null;
	// saved session identifier when using a user account
	protected _sessionId?: guid | null = null;
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
		this._machine = null;
		this._sessionId = null;
		if (typeof value === "string") {
			this._sessionId = value as guid;
		} else if (value instanceof Machine) {
			this._machine = value;
		} else if (value instanceof RepSelfGet) {
			this.setAuth(value.machine || value.ghostId);
		} else if ((value as any)?.key) {
			this.setAuth(new Machine(value));
		} else if ((value as any)?.machine?.key) {
			this.setAuth((value as any).machine as { key: string });
		} else if ((value as any)?.ghostId) {
			this.setAuth((value as any).ghostId as guid);
		}
	}
	//#endregion Authorization

	/**
	 * Sends a command to the underlying service, and returns a Promise that completes when a reply is received.
	 * @param payload   The payload to send to the service.
	 * @returns         A promise that resolves with the reply.
	 */
	abstract command<TReply extends Reply>(payload: Payload): Promise<TReply>;
}