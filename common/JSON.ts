import { JSON_PARSE, KEYS } from "@objects/API/Constants";

/**
 * Parses the passed JSON string and returns the parsed value.
 * If there is an exception in parsing, the errorContainer is populated with all the details of the error and `undefined` is returned.
 * @param jsonString 
 * @param errorContainer 
 * @returns 
 */
export function JSON_PARSE_SAFE(jsonString: string, errorContainer: any): any | undefined {
    let json: any;
    try {
        json = JSON_PARSE(jsonString);
    } catch (error: SyntaxError | any) {
        if (errorContainer) {
            errorContainer["jsonString"] = jsonString;
            KEYS(error)
                .concat("name", "message")
                .filter((key, index, array) => array.indexOf(key) === index)
                .forEach(function (key) {
                    errorContainer[key] = error[key] || "";
                });
        }
    }
    return json;
}