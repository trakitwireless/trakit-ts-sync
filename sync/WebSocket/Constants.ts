import { SubscriptionType } from "@trakit/commands";
import { SyncName } from "@trakit/objects";

/**
 * Regex parser for socket command response message names.
 */
export const MSG_RESPONSE = /get([A-Za-z]+?)(List)?(By[A-Za-z]+)?Response$/;
/**
 * Regex parser for socket message names (not command responses, those are handled by the {@link TrakitCommander.command} function).
 */
export const MSG_SYNC = /^(.+?)(Merged|Deleted|Suspended)$/;

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
		SubscriptionType.userAuthentication,
		//SubscriptionType.userState,
	],
	"UserGeneral": [
		SubscriptionType.userGeneral,
	],
	"UserAdvanced": [
		SubscriptionType.userAdvanced,
	],
	"UserAuthentication": [
		SubscriptionType.userAuthentication,
	],
	"UserState": [
		SubscriptionType.userState,
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
