import { SyncName, url } from "@trakit/objects";

/**
 * The HTTP verbs supported by the Trak-iT RESTful API.
 */
export type HttpVerb = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

/**
 * A mapping of RESTful service routes to get things listed by company.
 */
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
	"UserAuthentication": "/companies/{companyId}/users/authentications",
	"UserState": "/companies/{companyId}/users/states",
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
 */
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
 */
export const OBJECT_LIST_BY_BEHAVIOUR_SCRIPT: { [key: SyncName | string]: url } = {
	"BehaviourLog": "/companies/{companyId}/behaviours/scripts/{scriptId}/logs",
	"Behaviour": "/companies/{companyId}/behaviours/scripts/{scriptId}/behaviours",
};

/**
 * A mapping of Trak-iT RESTful routes to get things listed by billing profile.
 */
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
 */
export const OBJECT_LIST_BY_USER: { [key: SyncName | string]: url } = {
	"Session": "/users/{userLogin}/sessions",
};
