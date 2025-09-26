import { nothing } from "@trakit/objects";

/**
 * Parses the passed JSON string and returns the parsed value.
 * If there is an exception in parsing, the errorContainer is populated with all the details of the error and `undefined` is returned.
 * @param json 
 * @returns 
 */
export function JSON_PARSE_SAFE(json: string): [boolean, any | nothing, SyntaxError | nothing] {
	try {
		return [true, JSON.parse(json), null];
	} catch (ex: SyntaxError | any) {
		return [false, null, ex as SyntaxError];
	}
}