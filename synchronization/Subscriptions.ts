import * as commands from "@trakit/commands";
import { Payload, Reply, SubscriptionType } from "@trakit/commands";
import { JsonObject, nothing, SyncName, url, utility } from "@trakit/objects";

/**
 * A mapping of object names to their required subscription types.
 */
export const OBJECT_SUBSCRIPTIONS: { [key in SyncName]: SubscriptionType[] } = {
	/* company */
	"Company": [
		SubscriptionType.companyGeneral,
		//SubscriptionType.companySettings,
		//SubscriptionType.companyDirectory,
		SubscriptionType.companyLabels,
		SubscriptionType.companyPolicies,
	],
	"CompanyGeneral": [
		SubscriptionType.companyGeneral,
	],
	//"CompanySettings": [
	//	SubscriptionType.companySettings,
	//],
	"CompanyDirectory": [
		//SubscriptionType.companyDirectory,
	],
	"CompanyStyle": [
		SubscriptionType.companyLabels,
	],
	"CompanyPolicy": [
		SubscriptionType.companyPolicies,
	],
	"CompanyReseller": [
		SubscriptionType.companyReseller,
	],
	/* accounts */
	"Contact": [
		SubscriptionType.contact,
	],
	"Machine": [
		SubscriptionType.machine,
	],
	"User": [
		SubscriptionType.userGeneral,
		SubscriptionType.userAdvanced,
	],
	"UserGeneral": [
		SubscriptionType.userGeneral,
	],
	"UserAdvanced": [
		SubscriptionType.userAdvanced,
	],
	"UserGroup": [
		SubscriptionType.userGroup,
	],
	"Session": [
		// not directly subscribable
	],
	/* file hosting */
	"Dashcam": [
		// not directly subscribable
	],
	//"DashcamLive": [
	//	SubscriptionType.dashcamLive,
	//],
	"Icon": [
		SubscriptionType.icon,
	],
	"Picture": [
		SubscriptionType.picture,
	],
	"Document": [
		SubscriptionType.document,
	],
	"FormTemplate": [
		SubscriptionType.formTemplate,
	],
	"FormResult": [
		SubscriptionType.formResult,
	],
	/* assets */
	"Asset": [
		SubscriptionType.assetGeneral,
		SubscriptionType.assetAdvanced,
		SubscriptionType.assetDispatch,
	],
	"AssetGeneral": [
		SubscriptionType.assetGeneral,
	],
	"AssetAdvanced": [
		SubscriptionType.assetAdvanced,
	],
	"AssetDispatch": [
		SubscriptionType.assetDispatch,
	],
	"AssetMessage": [
		SubscriptionType.assetMessage,
	],
	"AssetAlert": [
		// alert messages are sent by the server regardless of subscription
	],
	//	"AssetAlert",
	/* dispatch */
	"DispatchTask": [
		SubscriptionType.dispatchTask,
	],
	//"DispatchTemplate": [
	//	SubscriptionType.dispatchTemplate,
	//],
	"DispatchJob": [
		SubscriptionType.dispatchJob,
	],
	/* maintenance */
	"MaintenanceSchedule": [
		SubscriptionType.maintenanceSchedule,
	],
	"MaintenanceJob": [
		SubscriptionType.maintenanceJob,
	],
	/* places */
	"Place": [
		SubscriptionType.placeGeneral,
		//SubscriptionType.placeExtended,
	],
	//"PlaceGeneral": [
	//	SubscriptionType.placeGeneral,
	//],
	//"PlaceExtended": [
	//    SubscriptionType.placeExtended,
	//],
	/* behaviours */
	"BehaviourScript": [
		SubscriptionType.behaviourScript,
	],
	"Behaviour": [
		SubscriptionType.behaviour,
	],
	"BehaviourLog": [
		SubscriptionType.behaviourLog,
	],
	/* providers and configs */
	"Provider": [
		SubscriptionType.providerGeneral,
		SubscriptionType.providerAdvanced,
		SubscriptionType.providerControl,
	],
	"ProviderGeneral": [
		SubscriptionType.providerGeneral,
	],
	"ProviderAdvanced": [
		SubscriptionType.providerAdvanced,
	],
	"ProviderControl": [
		SubscriptionType.providerControl,
	],
	"ProviderConfiguration": [
		SubscriptionType.providerConfiguration,
	],
	"ProviderConfigurationType": [
		// obsolete and no longer updated
	],
	"ProviderScript": [
		SubscriptionType.providerScript,
	],
	"ProviderConfig": [
		SubscriptionType.providerConfig,
	],
	"ProviderRegistration": [
		SubscriptionType.providerRegistration,
	],
	/* reports */
	"ReportTemplate": [
		SubscriptionType.reportTemplate,
	],
	"ReportSchedule": [
		SubscriptionType.reportSchedule,
	],
	"ReportResult": [
		SubscriptionType.reportResult,
	],
	/* billing */
	"BillingProfile": [
		SubscriptionType.billingProfile,
	],
	"BillingReport": [
		SubscriptionType.billingReport,
	],
	"BillableHostingRule": [
		SubscriptionType.billingHosting,
	],
	"BillableHostingLicense": [
		SubscriptionType.billingLicense,
	],
};

/**
 * A mapping of object names to their component parts.
 */
export const OBJECT_COMPOUNDS: { [key in SyncName | string]: SyncName[] } = {
	"Company": [
		"CompanyGeneral",
		//"CompanySetting",
		"CompanyDirectory",
		"CompanyStyle",
		"CompanyPolicy",
	],
	"Asset": [
		"AssetGeneral",
		"AssetAdvanced",
		"AssetDispatch",
	],
	//"Place": [
	//	"PlaceGeneral",
	//	"PlaceExtended",
	//],
	"Provider": [
		"ProviderGeneral",
		"ProviderAdvanced",
		"ProviderControl",
	],
	"User": [
		"UserGeneral",
		"UserAdvanced",
	],
};

/**
 * A mapping of RESTful service routes to get things listed by company.
 **/
export const OBJECT_LIST_BY_COMPANY: { [key in SyncName]: url } = {
	/* company */
	"Company": "/companies/generals?parent={companyId}",
	"CompanyGeneral": "/companies/generals?parent={companyId}",
	//"CompanySettings": "/companies/settings?parent={companyId}",
	"CompanyDirectory": "/companies/directory?parent={companyId}",
	"CompanyStyle": "/companies/styles?parent={companyId}",
	"CompanyPolicy": "/companies/policies?parent={companyId}",
	"CompanyReseller": "/companies/resellers?parent={companyId}",
	/* accounts */
	"Contact": "/companies/{companyId}/contacts",
	"Machine": "/companies/{companyId}/machines",
	"User": "/companies/{companyId}/users",
	"UserGeneral": "/companies/{companyId}/users/generals",
	"UserAdvanced": "/companies/{companyId}/users/advanceds",
	"UserGroup": "/companies/{companyId}/users/groups",
	"Session": "/companies/{companyId}/users/sessions",
	/* file hosting */
	"Dashcam": "/companies/{companyId}/dashcams",
	["DashcamLive" as SyncName]: "/companies/{companyId}/dashcams/live",
	"Icon": "/companies/{companyId}/icons",
	"Picture": "/companies/{companyId}/pictures",
	"Document": "/companies/{companyId}/documents",
	"FormTemplate": "/companies/{companyId}/forms/templates",
	"FormResult": "/companies/{companyId}/forms",
	/* assets */
	"Asset": "/companies/{companyId}/assets",
	"AssetGeneral": "/companies/{companyId}/assets/generals",
	"AssetAdvanced": "/companies/{companyId}/assets/advanceds",
	"AssetDispatch": "/companies/{companyId}/assets/dispatches",
	"AssetMessage": "/companies/{companyId}/assets/messages",
	"AssetAlert": "/companies/{companyId}/assets/alerts",
	//	"AssetAlert",
	/* dispatch */
	"DispatchTask": "/companies/{companyId}/assets/dispatch/tasks",
	//"DispatchTemplate": "/companies/{companyId}/assets/dispatch/templates",
	"DispatchJob": "/companies/{companyId}/assets/dispatch/jobs",
	/* maintenance */
	"MaintenanceSchedule": "/companies/{companyId}/maintenance/schedules",
	"MaintenanceJob": "/companies/{companyId}/maintenance/jobs",
	/* places */
	"Place": "/companies/{companyId}/places",
	//"PlaceGeneral": "/companies/{companyId}/places",
	//"PlaceExtended": "/companies/{companyId}/places",
	/* behaviours */
	"Behaviour": "/companies/{companyId}/behaviours",
	"BehaviourScript": "/companies/{companyId}/behaviours/scripts",
	"BehaviourLog": "",	// not listable by company, but by Behaviour, BehaviourScript, and Asset
	/* providers and configs */
	"Provider": "/companies/{companyId}/providers",
	"ProviderGeneral": "/companies/{companyId}/providers/generals",
	"ProviderAdvanced": "/companies/{companyId}/providers/advanceds",
	"ProviderControl": "/companies/{companyId}/providers/controls",
	"ProviderConfiguration": "/companies/{companyId}/providers/configurations",
	"ProviderConfigurationType": "",	// not a company resource
	"ProviderScript": "/companies/{companyId}/providers/scripts",
	"ProviderConfig": "/companies/{companyId}/providers/configs",
	"ProviderRegistration": "/companies/{companyId}/providers/registrations",
	/* reports */
	"ReportTemplate": "/companies/{companyId}/reports/templates",
	"ReportSchedule": "/companies/{companyId}/reports/schedules",
	"ReportResult": "/companies/{companyId}/reports/results",
	/* billing */
	"BillingProfile": "/companies/{companyId}/billing/profiles",
	"BillingReport": "/companies/{companyId}/billing/profiles/reports",
	"BillableHostingRule": "",	// not listable by company, only by BillingProfile
	"BillableHostingLicense": "",	// not listable by company, only by BillingProfile
};

/**
 * A mapping of Trak-iT RESTful routes to get things listed by asset.
 **/
export const OBJECT_LIST_BY_ASSET: { [key: SyncName | string]: url } = {
	/* messaging */
	"AssetMessage": "/assets/{assetId}/messages",
	/* dispatch */
	"DispatchTask": "/assets/{assetId}/dispatch/tasks",
	"DispatchJob": "/assets/{assetId}/dispatch/jobs",
	/* file hosting */
	"FormResult": "/assets/{assetId}/forms",
	/* maintenance */
	"MaintenanceJob": "/assets/{assetId}/maintenance/jobs",
};

/**
 * A mapping of Trak-iT RESTful routes to get things listed by behaviour script.
 **/
export const OBJECT_LIST_BY_BEHAVIOUR_SCRIPT: { [key: SyncName | string]: url } = {
	"BehaviourLog": "/companies/{companyId}/behaviours/scripts/{scriptId}/logs",
	"Behaviour": "/companies/{companyId}/behaviours/scripts/{scriptId}/behaviours",
};

/**
 * A mapping of Trak-iT RESTful routes to get things listed by billing profile.
 **/
export const OBJECT_LIST_BY_BILLING_PROFILE: { [key: SyncName | string]: url } = {
	"BillingHosting": "/billing/profiles/{profileId}/rules",
	"BillingLicense": "/billing/profiles/{profileId}/licenses",
	"BillingReport": "/billing/profiles/{profileId}/reports",
	//"BillingMapCast": "",
	//"BillingRatePlan": "",
	//"BillingReseller": "",
	//"BillingSupport": "",
};

/**
 * A mapping of Trak-iT RESTful routes to get things listed by asset.
 **/
export const OBJECT_LIST_BY_USER: { [key: SyncName | string]: url } = {
	"Session": "/users/{userLogin}/sessions",
};

/**
 * Regex parser for socket message names (not command responses, those are handled by the {@link TrakitCommander.command} function).
 */
export const RESPONSE_MESSAGE_PARSER = /^(.+?)(Merged|Deleted|Suspended)$/;
/**
 * Translated type name to object name to account for some legacy message names.
 * @param typeName 
 * @returns 
 */
export function makeObjectName(typeName: string): SyncName {
	typeName = utility.capitalize(typeName);
	switch (typeName) {
		case "CompanyLabels":
			typeName = "CompanyStyle";
			break;
		case "CompanyPolicies":
			typeName = "CompanyPolicy";
			break;
		default:
			typeName = utility.singularize(typeName);
			break;
	}
	return typeName as SyncName;
}

/**
 * Factory to create Payload classes based on type name.
 * @param type		SyncName representing the type of the payload.
 * @param suffix	Optional suffix to append to the class name.  Defaults to "Get".
 * @returns 
 */
export function makePayloadClass(type: SyncName, suffix?: string | nothing): (new (json: JsonObject) => Payload) | nothing {
	const name = "Pay" + type + (suffix ?? "Get");
	return commands[name as keyof typeof commands] as new (json: JsonObject) => Payload;
}
/**
 * Factory to create Reply classes based on type name.
 * @param type		SyncName representing the type of the reply.
 * @param suffix	Optional suffix to append to the class name.  Defaults to "Get".
 * @returns 
 */
export function makeReplyClass(type: SyncName, suffix?: string | nothing): (new (json: JsonObject) => Reply) | nothing {
	const name = "Rep" + type + (suffix ?? "Get");
	return commands[name as keyof typeof commands] as new (json: JsonObject) => Reply;
}

/**
 * 
 * @param types 
 * @returns 
 */
export function SYNCS_TO_SUBS(types: SyncName[]): SubscriptionType[] {
	return types.reduce((acc, s) => acc.concat(OBJECT_SUBSCRIPTIONS[s] || []), [] as SubscriptionType[])
				.filter((sub, index, array) => array.indexOf(sub) === index); // make unique
}
/**
 * 
 * @param subscriptions 
 * @returns 
 */
export function SUBS_TO_SYNCS(subscriptions: SubscriptionType[]): SyncName[] {
	const requests: SyncName[] = [];
	// we start with the compound types
	for (const [type, children] of Object.entries(OBJECT_COMPOUNDS)) {
		const subs = children.map((child) => OBJECT_SUBSCRIPTIONS[child]).flat();
		if (subs.filter(sub => subscriptions.includes(sub)).length / subs.length >= 0.5) {
			requests.push(type as SyncName);
		}
	}
	// and then the simple types that are not part of compound classes
	for (const [type, subs] of Object.entries(OBJECT_SUBSCRIPTIONS)) {
		if (
			!OBJECT_COMPOUNDS[type]
			&& subs.some(sub => subscriptions.includes(sub))
		) {
			requests.push(type as SyncName);
		}
	}
	return requests;
}