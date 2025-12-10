import { SubscriptionType } from "@trakit/commands";
import { SyncName, url } from "@trakit/objects";

/**
 * Names of objects that span multiple regions (in serialized order).
 */
export const SUBSCRIPTION_SPLITS: { [key in SyncName | string]: SubscriptionType[] } = {
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
	//"CompanyDirectory": [
	//	SubscriptionType.companyDirectory,
	//],
	"CompanyStyles": [
		SubscriptionType.companyLabels,
	],
	"CompanyPolicies": [
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
	/* file hosting */
	//"DashcamData": [
	//	SubscriptionType.dashcamData,
	//],
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
 * A mapping of RESTful service routes to get things listed by company.
 **/
export const SUBSCRIPTION_LIST_BY_COMPANY: { [key in SyncName|string]: url } = {
	/* company */
	"Company": "/companies/generals?parent={companyId}",
	"CompanyGeneral": "/companies/generals?parent={companyId}",
	//"CompanySettings": "/companies/settings?parent={companyId}",
	"CompanyDirectory": "/companies/directory?parent={companyId}",
	"CompanyStyles": "/companies/styles?parent={companyId}",
	"CompanyPolicies": "/companies/policies?parent={companyId}",
	"CompanyReseller": "/companies/resellers?parent={companyId}",
	/* accounts */
	"Contact": "/companies/{companyId}/contacts",
	"Machine": "/companies/{companyId}/machines",
	"User": "/companies/{companyId}/users",
	"UserGeneral": "/companies/{companyId}/users/generals",
	"UserAdvanced": "/companies/{companyId}/users/advanceds",
	"UserGroup": "/companies/{companyId}/users/groups",
	/* file hosting */
	"Dashcam": "/companies/{companyId}/dashcams",
	"DashcamLive": "/companies/{companyId}/dashcams/live",
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
	//	"AssetAlert",
	/* dispatch */
	"DispatchTask": "/companies/{companyId}/assets/dispatch/tasks",
	"DispatchTemplate": "/companies/{companyId}/assets/dispatch/templates",
	"DispatchJob": "/companies/{companyId}/assets/dispatch/jobs",
	/* maintenance */
	"MaintenanceSchedule": "/companies/{companyId}/maintenance/schedules",
	"MaintenanceJob": "/companies/{companyId}/maintenance/jobs",
	/* places */
	"Place": "/companies/{companyId}/places",
	"PlaceGeneral": "/companies/{companyId}/places",
	//"PlaceExtended": "/companies/{companyId}/places",
	/* behaviours */
	"BehaviourScript": "/companies/{companyId}/behaviours/scripts",
	"Behaviour": "/companies/{companyId}/behaviours",
	//"BehaviourLog": "",
	/* providers and configs */
	"Provider": "/companies/{companyId}/providers",
	"ProviderGeneral": "/companies/{companyId}/providers/generals",
	"ProviderAdvanced": "/companies/{companyId}/providers/advanceds",
	"ProviderControl": "/companies/{companyId}/providers/controls",
	"ProviderConfiguration": "/companies/{companyId}/providers/configurations",
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
};

/**
 * A mapping of Trak-iT RESTful routes to get things listed by asset.
 **/
export const SUBSCRIPTION_LIST_BY_ASSET: { [key: string]: url } = {
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
export const SUBSCRIPTION_LIST_BY_BEHAVIOUR_SCRIPT: { [key: string]: url } = {
	"BehaviourLog": "/companies/{companyId}/behaviours/scripts/{scriptId}/logs",
	"Behaviour": "/companies/{companyId}/behaviours/scripts/{scriptId}/behaviours",
};

/**
 * A mapping of Trak-iT RESTful routes to get things listed by billing profile.
 **/
export const SUBSCRIPTION_LIST_BY_BILLING_PROFILE: { [key: string]: url } = {
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
export const SUBSCRIPTION_LIST_BY_USER: { [key: string]: url } = {
	"Session": "/users/{userLogin}/sessions",
};