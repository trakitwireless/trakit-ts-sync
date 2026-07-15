import { datetime, nothing, uint, ulong } from "@trakit/objects";
/**
 * Defines constraints for querying audit data, including time range, version range, and result limit.
 */
export type AuditConstraints = {
    /**
     * The earliest timestamp for the audit data to be retrieved.
     * If specified, only audit entries after this date will be included.
     */
    after?: Date | datetime;
    /**
     * The latest timestamp for the audit data to be retrieved.
     * If specified, only audit entries before this date will be included.
     */
    before?: Date | datetime;
    /**
     * The lowest {@link BaseComponent.v|version key} for the audit data to be retrieved.
     * In rare cases, multiple events can happen at the same moment,
     * and to avoid missing or duplicating data, you should also specify
     * the {@link BaseComponent.v|version key} which is incremented for each event.
     */
    lowest?: uint | nothing;
    /**
     * The highest {@link BaseComponent.v|version key} for the audit data to be retrieved.
     * In rare cases, multiple events can happen at the same moment,
     * and to avoid missing or duplicating data, you should also specify
     * the {@link BaseComponent.v|version key} which is incremented for each event.
     */
    highest?: uint | nothing;
    /**
     * The maximum number of audit entries to retrieve.
     * Each object type has its own default value for this limit,
     * which can be overridden by specifying a different value here.
     */
    limit?: ulong | nothing;
};
//# sourceMappingURL=AuditConstraints.d.ts.map