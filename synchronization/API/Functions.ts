import { ErrorCode } from "@trakit/commands";
import { JsonObject, JsonValue } from "@trakit/objects";

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