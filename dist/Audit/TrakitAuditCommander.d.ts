import { Payload, RepAssetAdvancedAudit, RepSelfGet } from "@trakit/commands";
import { AssetAdvanced, guid, JsonObject, Machine, nothing, ulong, url } from "@trakit/objects";
import { TrakitBaseCommander } from "../API/TrakitBaseCommander";
import { AuditConstraints } from "./AuditConstraints";
/**
 * Uses Trak-iT's RESTful service to access and manipulate Trak-iT API objects.
 */
export declare class TrakitAuditCommander extends TrakitBaseCommander<Request> {
    /**
     * Production RESTful service URL.
     * This service is covered by the SLA and should be used for serices and code running in your own production environment.
     * Both services access the same data-set, so be careful making changes as they will be reflected in production as well.
     */
    static readonly URI_PROD: url;
    /**
     * Testing or beta RESTful service URL.
     * This service is not covered by the SLA and should be used to test your own code before deployment.
     * Throttling of connections and commands is tighter to help you diagnose issues before switching to production.
     * Both services access the same data-set, so be careful making changes as they will be reflected in production as well.
     */
    static readonly URI_BETA: url;
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
     * Creates a request object for the specified HTTP method and body.
     * @param payload
     * @returns A {@link Request} object configured with the specified parameters.
     */
    requestCreate(payload: Payload): Promise<Request>;
    /**
     * Sends the given request to Trak-iT's RESTful API and awaits a result.
     * @param request.path	Relative path to the resource being accessed.
     * @param request.verb	HTTP method to use for the request.
     * @param request.body	Optional JSON body to send with the request.
     * @returns				A promise that resolves with the JSON response from the server.
     */
    requestRelay(request: Request): Promise<JsonObject>;
    /**
     *
     * @param asset
     * @returns
     */
    beginAssetAdvanced(asset: AssetAdvanced, limit?: ulong | nothing): Promise<RepAssetAdvancedAudit>;
    /**
     *
     * @param assetId
     * @param constraints
     * @returns
     */
    auditAssetAdvanced(assetId: ulong, constraints?: AuditConstraints): Promise<RepAssetAdvancedAudit>;
}
//# sourceMappingURL=TrakitAuditCommander.d.ts.map