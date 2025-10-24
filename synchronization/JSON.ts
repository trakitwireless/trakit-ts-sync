import { classes, email, guid, JsonObject, JsonValue, ulong } from "@trakit/objects";

/**
 * Parses the passed JSON string and returns the parsed value.
 * If there is an exception in parsing, the Error is populated with all the details of the error and `undefined` is returned.
 * @param json 
 * @returns 
 */
export function JSON_PARSE_SAFE(json: string): [JsonValue, SyntaxError | null] {
	try {
		return [JSON.parse(json), null];
	} catch (ex: SyntaxError | any) {
		return [null, ex as SyntaxError];
	}
}

/**
 * Returns the name of the identifying key for the given Trak-iT Object type.
 * @param type 
 * @returns 
 */
export function syncKeyName(type: classes) {
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
 * @param obj 
 * @param type 
 * @returns 
 */
export function syncKey(obj: JsonObject, type: classes): ulong | string | guid | email {
	return obj[syncKeyName(type)] as ulong | string | guid | email;
}