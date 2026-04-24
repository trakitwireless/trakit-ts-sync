import {
	ErrorCode,
	Payload,
	Reply,
	RepSelfGet
} from '@trakit/commands';
import {
	guid,
	JsonObject,
	Machine,
	nothing,
	url
} from '@trakit/objects';
import { createClientErrorResponse } from './Functions';

/**
 * The base class used to help define interaction with all Trak-iT API services.
 */
export abstract class TrakitBaseCommander<TRequest> {
	/**
	 * Details of the {@link User} or {@link Machine} who is connected to the underlying Trak-iT API service.
	 */
	account!: RepSelfGet;
	/**
	 * {@link url} of the underlying Trak-iT API service.
	 */
	baseAddress: URL | null;
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
	createBaseUrl(path?: URL | url | nothing): URL {
		const route = this.baseAddress
			? new URL(path ?? "", this.baseAddress)
			: new URL(path as url),
			query = new Map(this.query);
		for (const [key, value] of query) {
			route.searchParams.append(key, value);
		}
		return route;
	}

	constructor(
		account?: RepSelfGet | { machine: { key: string } }
			| Machine | { key: string }
			| { ghostId: guid }
			| guid
			| nothing,
		baseAddress?: URL | url | nothing,
	) {
		this.baseAddress = baseAddress
			? new URL(baseAddress)
			: null;
		this.setAuth(account);
	}

	//#region Authorization
	/**
	 * Sets the authentication mechanism using either a session id or a Machine object.
	 * @param account  The session id (string), {@link Machine} object, or {@link RepSelfGet} object.
	 */
	setAuth(
		account?: RepSelfGet | { machine: { key: string } }
			| Machine | { key: string }
			| { ghostId: guid }
			| guid
			| nothing
	): void {
		if (account instanceof RepSelfGet) {
			this.account = account;
		} else if (typeof account === "string") {
			this.setAuth({
				ghostId: account,
			});
		} else if (account instanceof Machine || (account as { key: string })?.key) {
			this.setAuth({
				machine: ((account as any).toJSON?.() ?? account) as { key: string },
			});
		} else if ((account as any)?.machine?.key || (account as any)?.ghostId) {
			this.setAuth(new RepSelfGet({
				errorCode: ErrorCode.success,
				message: `Authenticated via ${(account as any)?.machine?.key ? "Machine" : "Session"}`,
				...((account as any).toJSON?.() ?? account),
			}));
		} else {
			this.setAuth(new RepSelfGet);
		}
	}
	//#endregion Authorization

	/**
	 * A mapping of commands that are currently executing, to ensure that duplicate commands
	 * with the same payload are not sent to the underlying service multiple times concurrently.
	 */
	_commandPromises = new Map<string, Promise<Reply>>();

	/**
	 * Sends a command to the underlying service, and returns a Promise that completes when a reply is received.
	 * @param payload   The payload to send to the service.
	 * @returns         A promise that settles based on the underlying service's response.
	 */
	command<TReply extends Reply>(payload: Payload): Promise<TReply> {
		const payloadKey = payload.constructor.name + JSON.stringify(payload.toJSON());
		let payloadPromise = this._commandPromises.get(payloadKey);
		if (!payloadPromise) {
			this._commandPromises.set(payloadKey, payloadPromise = new Promise(async (resolve, reject) => {
				let request: TRequest | null = null,
					response: any = null,
					reply: TReply | null = null;
				try {
					request = await this.requestCreate(payload);
				} catch (ex: Error | any) {
					response = createClientErrorResponse(ex);
				}
				try {
					response = response
						?? (await this.requestRelay(request as TRequest));
				} catch (ex: Error | JsonObject | any) {
					reply = payload.createReply(
						ex instanceof Error
							? createClientErrorResponse(ex)
							: ex as JsonObject
					) as TReply;
				}
				try {
					reply = reply
						?? (payload.createReply(response) as TReply);
				} catch (ex: Error | any) {
					reply = payload.createReply(createClientErrorResponse(ex, response)) as TReply;
				}
				(reply.errorCode === ErrorCode.success ? resolve : reject)(reply);
				this._commandPromises.delete(payloadKey);
			}));
		}
		return payloadPromise as Promise<TReply>;
	}

	/**
	 * Creates a request object to send to the underlying service.
	 * @param payload The payload to send to the underlying service.
	 * @returns       The request object to send to the underlying service.
	 */
	abstract requestCreate(payload: Payload): Promise<TRequest>;
	/**
	 * Sends a request to the underlying service, and returns a Promise that completes when a reply is received.
	 * @param request	The request object to send to the service.
	 * @returns			A promise that resolves for any response, and rejects for client-side and transport errors.
	 */
	abstract requestRelay(request: TRequest): Promise<any>;
}