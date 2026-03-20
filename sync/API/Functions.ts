import * as commands from "@trakit/commands";
import { ErrorCode, Payload, Reply } from "@trakit/commands";
import { codified, email, guid, JsonObject, JsonValue, nothing, SyncName, ulong, utility } from "@trakit/objects";

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
			"message": ex?.message ?? "Unknonwn error",
			"stack": ex?.stack ?? null,
			"value": response ?? null,
		}
	};
}

/**
 * Returns the name of the identifying key for the given Trak-iT Object type.
 * @param type 
 * @returns 
 */
export function getJsonKeyName(type: SyncName) {
	switch (type) {
		case "User":
		case "UserGeneral":
		case "UserAdvanced":
			return "login";
		case "ProviderRegistration":
			return "code";
		case "Session":
			return "handle";
		case "Machine":
			return "key";
		case "Dashcam":
			return "guid";
		default:
			return "id";
	}
}
/**
 * Returns the value of the identifying key for the given Trak-iT Object.
 * @param json 
 * @param type 
 * @returns 
 */
export function getJsonKeyValue(json: JsonObject, type: SyncName): ulong | guid | email | codified | string {
	return json[getJsonKeyName(type)] as ulong | guid | email | codified | string;
}


/**
 * Translated type name to object name to account for some legacy message names.
 * @param typeName 
 * @returns 
 */
export function makeObjectName(typeName: string): SyncName {
	typeName = utility.capitalize(typeName);
	switch (typeName) {
		case "CompanyLabels":
			typeName = "CompanyStyle";
			break;
		default:
			typeName = utility.singularize(typeName);
			break;
	}
	return typeName as SyncName;
}

/**
 * Factory to create Payload classes based on type name.
 * @param type		SyncName representing the type of the payload.
 * @param suffix	Optional suffix to append to the class name.  Defaults to "Get".
 * @returns 
 */
export function makePayloadClass(type: SyncName, suffix?: string | nothing): (new (json: JsonObject) => Payload) | nothing {
	const name = "Pay" + type + (suffix ?? "Get");
	return commands[name as keyof typeof commands] as new (json: JsonObject) => Payload;
}
/**
 * Factory to create Reply classes based on type name.
 * @param type		SyncName representing the type of the reply.
 * @param suffix	Optional suffix to append to the class name.  Defaults to "Get".
 * @returns 
 */
export function makeReplyClass(type: SyncName, suffix?: string | nothing): (new (json: JsonObject) => Reply) | nothing {
	const name = "Rep" + type + (suffix ?? "Get");
	return commands[name as keyof typeof commands] as new (json: JsonObject) => Reply;
}

/**
 * Issues a fetch request and returns the response as a {@link JsonObject}.
 * If the fetch fails, returns a standardized error response object.
 * @param request 
 * @returns 
 */
export async function fetchJsonObject(request: Request): Promise<JsonObject> {
	try {
		return (await (await fetch(request)).json()) as JsonObject;
	} catch (ex: Error | any) {
		throw createClientErrorResponse(ex);
	}
}