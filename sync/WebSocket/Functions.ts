import { Payload } from "@trakit/commands";
import { utility } from "@trakit/objects";

/**
 * Returns a WebSocket command name based on the {@link Payload} type.
 * @param payload The payload being sent.
 * @returns The corresponding WebSocket command name.
 */
export function makeCommandName(payload: Payload): string {
	const action = payload.getAction(),
		error = new Error("no command supported for " + payload.constructor.name, { cause: action });
	switch (action.object as string) {
		case "Subscription":
			switch (action.kind) {
				case "Merge":
					return "subscribe";
				case "Delete":
					return "unsubscribe";
				case "List":
					return "getSubscriptionsList";
				default:
					throw error;
			}
		case "Self":
			switch (action.filter) {
				case "Get":
					return "getSessionDetails";
				case "Login":
				case "Logout":
					return action.filter.toLowerCase();
				case "Contact":
				case "Password":
				case "Preferences":
				case "State":
					return "updateOwn" + action.filter;
				default:
					throw error;
			}
		case "Session":
			switch (action.kind) {
				case "Get":
				case "List":
					break;  // fall through to default
				case "Delete":
					return "killSession";
				default:
				case "Merge":
				case "Restore":
				case "Suspend":
				case "Reactivate":
					throw error;
			}
			break;
		case "DispatchJob":
			switch (action.filter) {
				case "Cancel":
				case "Change":
					return action.kind.toLocaleLowerCase() + action.object;
			}
	}
	switch (action.kind) {
		case "Get":
		case "Merge":
		case "Restore":
		case "Suspend":
			return action.kind.toLocaleLowerCase() + action.object;
		case "Delete":
			return "remove" + action.object;
		case "Reactivate":
			return "revive" + action.object;
		case "List":
			return "get" + utility.pluralize(action.object) + "List"
				+ (
					(action.filter || "Company") != "Company"
						? "By" + action.filter
						: ""
				);
		default:
			throw error;
	}
}
