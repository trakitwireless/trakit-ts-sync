import { Payload, Reply, RepSelfGet } from "@trakit/commands";
import { codified, email, guid, JsonObject, JsonValue, nothing, SyncName, ulong } from "@trakit/objects";
import { HttpVerb } from "../RESTful/Constants";
import { TrakitBaseCommander } from "./TrakitBaseCommander";
/**
 * Splits Pascal-case words into their components.
 */
export declare const SPLITTER: RegExp;
/**
 * Creates a standardized error response.
 * @param ex The error to include in the response.
 * @returns A standardized error response object.
 */
export declare function createClientErrorResponse(ex: Error, response?: JsonValue): JsonObject;
/**
 * Returns the name of the identifying key for the given Trak-iT Object type.
 * @param type
 * @returns
 */
export declare function getJsonKeyName(type: SyncName): "login" | "code" | "handle" | "key" | "guid" | "id";
/**
 * Returns the value of the identifying key for the given Trak-iT Object.
 * @param json
 * @param type
 * @returns
 */
export declare function getJsonKeyValue(json: JsonObject, type: SyncName): ulong | guid | email | codified | string;
/**
 * Translated type name to object name to account for some legacy message names.
 * @param typeName
 * @returns
 */
export declare function makeObjectName(typeName: string): SyncName;
/**
 * Factory to create Payload classes based on type name.
 * @param type		SyncName representing the type of the payload.
 * @param suffix	Optional suffix to append to the class name.  Defaults to "Get".
 * @returns
 */
export declare function makePayloadClass(type: SyncName, suffix?: string | nothing): (new (json: JsonObject) => Payload) | nothing;
/**
 * Factory to create Reply classes based on type name.
 * @param type		SyncName representing the type of the reply.
 * @param suffix	Optional suffix to append to the class name.  Defaults to "Get".
 * @returns
 */
export declare function makeReplyClass(type: SyncName, suffix?: string | nothing): (new (json: JsonObject) => Reply) | nothing;
/**
 * Gets the appropriate HTTP verb and route for the given payload.
 * @param payload	The payload being sent.
 * @returns			A tuple containing the HTTP verb and route.
 */
export declare function makeVerbRoute(payload: Payload): [HttpVerb, string];
/**
 * Constructs a CORS request for the given commander and payload.
 * @param commander
 * @param payload
 * @returns
 */
export declare function requestCreateCommander(commander: TrakitBaseCommander<Request>, payload: Payload): Promise<Request>;
/**
 * Constructs a CORS request for a Trak-iT API endpoint with the given account and request details.
 * This method handles authentication headers based on the account's Machine or User's credentials.
 * @param account
 * @param route
 * @param verb
 * @param body
 * @param defaultHeaders
 * @returns
 */
export declare function requestCreateCors(account: RepSelfGet, route: URL, verb?: HttpVerb, body?: BodyInit | null, defaultHeaders?: Map<string, string> | null): Promise<Request>;
/**
 * Issues a fetch request and returns the response.
 * If the fetch fails, returns a standardized error response object.
 * @param request
 * @returns
 */
export declare function requestRelayCors(request: Request): Promise<Response>;
/**
 * Issues a fetch request and returns the response as a {@link JsonObject}.
 * If the fetch fails, returns a standardized error response object.
 * @param request
 * @returns
 */
export declare function requestRelayCorsJson(request: Request): Promise<JsonObject>;
/**
 * Utility function to get a value from a Map by key, or create and set it using a factory function if it doesn't exist.
 * @param map The Map to get/set the value from/in.
 * @param key The key to look up in the Map.
 * @param factory A function that takes the key and returns a value to set if the key is not already in the Map.
 * @returns The existing or newly created value associated with the key in the Map.
 */
export declare function MAP_GET_OR_SET<TKey>(map: Map<TKey, any>, key: TKey, factory: (key: TKey) => any): any;
//# sourceMappingURL=Functions.d.ts.map