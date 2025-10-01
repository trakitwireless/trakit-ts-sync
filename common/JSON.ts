import { JsonValue } from "@trakit/objects";

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