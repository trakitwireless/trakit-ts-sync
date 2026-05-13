import { Payload, Reply, RepSelfGet } from '@trakit/commands';
import { guid, Machine, nothing, url } from '@trakit/objects';
/**
 * The base class used to help define interaction with all Trak-iT API services.
 */
export declare abstract class TrakitBaseCommander<TRequest> {
    /**
     * Details of the {@link User} or {@link Machine} who is connected to the underlying Trak-iT API service.
     */
    account: RepSelfGet;
    /**
     * {@link url} of the underlying Trak-iT API service.
     */
    baseAddress: URL | null;
    /**
     * Additional (optional) values added to the query-string of the connection request.
     */
    readonly query: Map<string, string>;
    /**
     * Additional (optional) HTTP headers added to the connection request.
     */
    readonly headers: Map<string, string>;
    /**
     * Returns the {@link baseAddress} with the appropriate path, query values.
     * @param path  Optional path to append to the base address.
     * @returns     The constructed URL string.
     */
    createBaseUrl(path?: URL | url | nothing): URL;
    constructor(account?: RepSelfGet | {
        machine: {
            key: string;
        };
    } | Machine | {
        key: string;
    } | {
        ghostId: guid;
    } | guid | nothing, baseAddress?: URL | url | nothing);
    /**
     * Sets the authentication mechanism using either a session id or a Machine object.
     * @param account  The session id (string), {@link Machine} object, or {@link RepSelfGet} object.
     */
    setAuth(account?: RepSelfGet | {
        machine: {
            key: string;
        };
    } | Machine | {
        key: string;
    } | {
        ghostId: guid;
    } | guid | nothing): void;
    /**
     * Counter used to correlate requests to responses.
     */
    protected _commandId: number;
    /**
     * A mapping of commands that are currently executing, to ensure that duplicate commands
     * with the same payload are not sent to the underlying service multiple times concurrently.
     */
    protected _commandPromises: Map<string, Promise<Reply>>;
    /**
     * Sends a command to the underlying service, and returns a Promise that completes when a reply is received.
     * @param payload   The payload to send to the service.
     * @returns         A promise that settles based on the underlying service's response.
     */
    command<TReply extends Reply>(payload: Payload): Promise<TReply>;
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
//# sourceMappingURL=TrakitBaseCommander.d.ts.map