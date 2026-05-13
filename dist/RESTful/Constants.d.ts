import { SyncName, url } from "@trakit/objects";
/**
 * The HTTP verbs supported by the Trak-iT RESTful API.
 */
export type HttpVerb = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
/**
 * A mapping of RESTful service routes to get things listed by company.
 */
export declare const OBJECT_LIST_BY_COMPANY: {
    [key in SyncName]: url;
};
/**
 * A mapping of Trak-iT RESTful routes to get things listed by asset.
 */
export declare const OBJECT_LIST_BY_ASSET: {
    [key: SyncName | string]: url;
};
/**
 * A mapping of Trak-iT RESTful routes to get things listed by behaviour script.
 */
export declare const OBJECT_LIST_BY_BEHAVIOUR_SCRIPT: {
    [key: SyncName | string]: url;
};
/**
 * A mapping of Trak-iT RESTful routes to get things listed by billing profile.
 */
export declare const OBJECT_LIST_BY_BILLING_PROFILE: {
    [key: SyncName | string]: url;
};
/**
 * A mapping of Trak-iT RESTful routes to get things listed by asset.
 */
export declare const OBJECT_LIST_BY_USER: {
    [key: SyncName | string]: url;
};
//# sourceMappingURL=Constants.d.ts.map