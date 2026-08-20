import {
    BaseComponent,
    datetime,
    IIdUlong,
    nothing,
    uint,
    ulong,
} from "@trakit/objects";

/**
 * Defines constraints for querying audit data, including time range, version range, and result limit.
 */
export interface AuditConstraints {
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
	 * The lowest {@link BaseComponent.v|version} of the audit data to be retrieved.
	 * In rare cases, multiple events can happen at the same moment,
	 * and to avoid missing or duplicating data, you should also specify
	 * the {@link BaseComponent.v|version} which is incremented for each event.
	 */
	min?: uint | nothing;
	/**
	 * The highest {@link BaseComponent.v|version} of the audit data to be retrieved.
	 * In rare cases, multiple events can happen at the same moment,
	 * and to avoid missing or duplicating data, you should also specify
	 * the {@link BaseComponent.v|version} which is incremented for each event.
	 */
	max?: uint | nothing;
	/**
	 * The maximum number of audit entries to retrieve.
	 * Each object type has its own default value for this limit,
	 * which can be overridden by specifying a different value here.
	 */
	limit?: ulong | nothing;
}

/**
 * When listing audit data for objects based on a specified owner, there are a couple extra options to assist with accurate pagination.
 */
export interface AuditIdOwnerConstraints extends AuditConstraints {
	/**
	 * The lowest {@link IIdUlong.id} of the audit data to be retrieved.
	 */
	lowest?: ulong | nothing;
	/**
	 * The highest {@link IIdUlong.id} of the audit data to be retrieved.
	 */
	highest?: ulong | nothing;
};
///**
// * When listing audit data for objects based on a specified owner, there are a couple extra options to assist with accurate pagination.
// */
//export interface AuditStringOwnerConstraints extends AuditConstraints {
//	/**
//	 * The first {@link BaseComponent.getKey} alphabetically of the audit data to be retrieved.
//	 */
//	first?: string | nothing;
//	/**
//	 * The last {@link BaseComponent.getKey} alphabetically of the audit data to be retrieved.
//	 */
//	last?: string | nothing;
//};