import {
	ErrorCode,
	PayAssetBatchMerge,
	PayAssetDelete,
	PayAssetDispatchMerge,
	PayAssetGet,
	PayAssetListByCompany,
	PayAssetMerge,
	PayAssetMessageBatchMerge,
	PayAssetMessageDelete,
	PayAssetMessageGet,
	PayAssetMessageListByAsset,
	PayAssetMessageListByCompany,
	PayAssetMessageMerge,
	PayAssetMessageRestore,
	PayAssetReactivate,
	PayAssetRestore,
	PayAssetSuspend,
	PayBehaviourBatchMerge,
	PayBehaviourDelete,
	PayBehaviourGet,
	PayBehaviourListByCompany,
	PayBehaviourLogBatchDeleteByAsset,
	PayBehaviourLogBatchDeleteByBehaviour,
	PayBehaviourLogBatchDeleteByScript,
	PayBehaviourLogListByAsset,
	PayBehaviourLogListByBehaviour,
	PayBehaviourLogListByScript,
	PayBehaviourMerge,
	PayBehaviourRestore,
	PayBehaviourScriptDelete,
	PayBehaviourScriptGet,
	PayBehaviourScriptListByCompany,
	PayBehaviourScriptMerge,
	PayBehaviourScriptRestore,
	PayCompanyDelete,
	PayCompanyGeneralListByCompany,
	PayCompanyGet,
	PayCompanyMerge,
	PayCompanyResellerDelete,
	PayCompanyResellerGet,
	PayCompanyResellerMerge,
	PayCompanyResellerRestore,
	PayCompanyRestore,
	PayContactBatchDelete,
	PayContactBatchMerge,
	PayContactDelete,
	PayContactGet,
	PayContactListByCompany,
	PayContactMerge,
	PayContactRestore,
	PayDashcamGet,
	PayDashcamListByCompany,
	PayDashcamLiveListByCompany,
	PayDispatchJobBatchMerge,
	PayDispatchJobCancel,
	PayDispatchJobChange,
	PayDispatchJobDelete,
	PayDispatchJobGet,
	PayDispatchJobListByAsset,
	PayDispatchJobListByCompany,
	PayDispatchJobMerge,
	PayDispatchJobRestore,
	PayDispatchTaskBatchMerge,
	PayDispatchTaskDelete,
	PayDispatchTaskGet,
	PayDispatchTaskListByAsset,
	PayDispatchTaskListByCompany,
	PayDispatchTaskMerge,
	PayDispatchTaskRestore,
	PayDocumentDelete,
	PayDocumentGet,
	PayDocumentListByCompany,
	PayDocumentMerge,
	PayDocumentRestore,
	PayFormResultBatchMerge,
	PayFormResultDelete,
	PayFormResultGet,
	PayFormResultListByCompany,
	PayFormResultMerge,
	PayFormResultRestore,
	PayFormTemplateDelete,
	PayFormTemplateGet,
	PayFormTemplateListByCompany,
	PayFormTemplateMerge,
	PayFormTemplateRestore,
	PayIconDelete,
	PayIconGet,
	PayIconListByCompany,
	PayIconMerge,
	PayIconRestore,
	PayMachineDelete,
	PayMachineGet,
	PayMachineListByCompany,
	PayMachineMerge,
	PayMachineRestore,
	PayMaintenanceJobDelete,
	PayMaintenanceJobGet,
	PayMaintenanceJobListByCompany,
	PayMaintenanceJobMerge,
	PayMaintenanceJobRestore,
	PayMaintenanceScheduleDelete,
	PayMaintenanceScheduleGet,
	PayMaintenanceScheduleListByCompany,
	PayMaintenanceScheduleMerge,
	PayMaintenanceScheduleRestore,
	PayPictureDelete,
	PayPictureGet,
	PayPictureListByCompany,
	PayPictureMerge,
	PayPictureRestore,
	PayPlaceDelete,
	PayPlaceGet,
	PayPlaceListByCompany,
	PayPlaceMerge,
	PayPlaceRestore,
	PayProviderBatchDelete,
	PayProviderBatchMerge,
	PayProviderConfigBatchMerge,
	PayProviderConfigDelete,
	PayProviderConfigGet,
	PayProviderConfigListByCompany,
	PayProviderConfigMerge,
	PayProviderConfigRestore,
	PayProviderConfigurationBatchMerge,
	PayProviderConfigurationDelete,
	PayProviderConfigurationGet,
	PayProviderConfigurationListByCompany,
	PayProviderConfigurationMerge,
	PayProviderConfigurationRestore,
	PayProviderDelete,
	PayProviderGet,
	PayProviderListByCompany,
	PayProviderMerge,
	PayProviderRegistrationDelete,
	PayProviderRegistrationGet,
	PayProviderRegistrationListByCompany,
	PayProviderRegistrationMerge,
	PayProviderRestore,
	PayProviderScriptDelete,
	PayProviderScriptGet,
	PayProviderScriptListByCompany,
	PayProviderScriptMerge,
	PayProviderScriptRestore,
	PayReportResultDelete,
	PayReportResultGet,
	PayReportResultListByCompany,
	PayReportResultMerge,
	PayReportResultRestore,
	PayReportScheduleDelete,
	PayReportScheduleGet,
	PayReportScheduleListByCompany,
	PayReportScheduleMerge,
	PayReportScheduleRestore,
	PayReportTemplateDelete,
	PayReportTemplateGet,
	PayReportTemplateListByCompany,
	PayReportTemplateMerge,
	PayReportTemplateRestore,
	PaySelfContact,
	PaySelfGet,
	PaySelfLogin,
	PaySelfLogout,
	PaySelfPassword,
	PaySelfPreferences,
	PaySessionDelete,
	PaySessionListByCompany,
	PaySessionListByUser,
	PayUserDelete,
	PayUserGet,
	PayUserGroupDelete,
	PayUserGroupGet,
	PayUserGroupListByCompany,
	PayUserGroupMerge,
	PayUserGroupRestore,
	PayUserListByCompany,
	PayUserMerge,
	PayUserRestore,
	RepAssetBatchMerge,
	RepAssetDelete,
	RepAssetDispatchMerge,
	RepAssetGet,
	RepAssetListByCompany,
	RepAssetMerge,
	RepAssetMessageBatchMerge,
	RepAssetMessageDelete,
	RepAssetMessageGet,
	RepAssetMessageListByAsset,
	RepAssetMessageListByCompany,
	RepAssetMessageMerge,
	RepAssetSuspend,
	RepBehaviourBatchMerge,
	RepBehaviourDelete,
	RepBehaviourGet,
	RepBehaviourListByCompany,
	RepBehaviourLogBatchDeleteByAsset,
	RepBehaviourLogBatchDeleteByBehaviour,
	RepBehaviourLogBatchDeleteByScript,
	RepBehaviourLogListByAsset,
	RepBehaviourLogListByBehaviour,
	RepBehaviourLogListByScript,
	RepBehaviourMerge,
	RepBehaviourScriptDelete,
	RepBehaviourScriptGet,
	RepBehaviourScriptListByCompany,
	RepBehaviourScriptMerge,
	RepCompanyDelete,
	RepCompanyGeneralListByCompany,
	RepCompanyGet,
	RepCompanyMerge,
	RepCompanyResellerDelete,
	RepCompanyResellerGet,
	RepCompanyResellerMerge,
	RepContactBatchDelete,
	RepContactBatchMerge,
	RepContactDelete,
	RepContactGet,
	RepContactListByCompany,
	RepContactMerge,
	RepDashcamGet,
	RepDashcamListByCompany,
	RepDashcamLiveListByCompany,
	RepDispatchJobBatchMerge,
	RepDispatchJobDelete,
	RepDispatchJobGet,
	RepDispatchJobListByAsset,
	RepDispatchJobListByCompany,
	RepDispatchJobMerge,
	RepDispatchTaskBatchMerge,
	RepDispatchTaskDelete,
	RepDispatchTaskGet,
	RepDispatchTaskListByAsset,
	RepDispatchTaskListByCompany,
	RepDispatchTaskMerge,
	RepDocumentDelete,
	RepDocumentGet,
	RepDocumentListByCompany,
	RepDocumentMerge,
	RepFormResultBatchMerge,
	RepFormResultDelete,
	RepFormResultGet,
	RepFormResultListByCompany,
	RepFormResultMerge,
	RepFormTemplateDelete,
	RepFormTemplateGet,
	RepFormTemplateListByCompany,
	RepFormTemplateMerge,
	RepIconDelete,
	RepIconGet,
	RepIconListByCompany,
	RepIconMerge,
	Reply,
	RepMachineDelete,
	RepMachineGet,
	RepMachineListByCompany,
	RepMachineMerge,
	RepMaintenanceJobDelete,
	RepMaintenanceJobGet,
	RepMaintenanceJobListByCompany,
	RepMaintenanceJobMerge,
	RepMaintenanceScheduleDelete,
	RepMaintenanceScheduleGet,
	RepMaintenanceScheduleListByCompany,
	RepMaintenanceScheduleMerge,
	RepPictureDelete,
	RepPictureGet,
	RepPictureListByCompany,
	RepPictureMerge,
	RepPlaceDelete,
	RepPlaceGet,
	RepPlaceListByCompany,
	RepPlaceMerge,
	RepProviderBatchDelete,
	RepProviderBatchMerge,
	RepProviderConfigBatchMerge,
	RepProviderConfigDelete,
	RepProviderConfigGet,
	RepProviderConfigListByCompany,
	RepProviderConfigMerge,
	RepProviderConfigurationBatchMerge,
	RepProviderConfigurationDelete,
	RepProviderConfigurationGet,
	RepProviderConfigurationListByCompany,
	RepProviderConfigurationMerge,
	RepProviderDelete,
	RepProviderGet,
	RepProviderMerge,
	RepProviderRegistrationDelete,
	RepProviderRegistrationGet,
	RepProviderRegistrationListByCompany,
	RepProviderRegistrationMerge,
	RepProviderScriptDelete,
	RepProviderScriptGet,
	RepProviderScriptListByCompany,
	RepProviderScriptMerge,
	RepReportResultDelete,
	RepReportResultGet,
	RepReportResultListByCompany,
	RepReportResultMerge,
	RepReportScheduleDelete,
	RepReportScheduleGet,
	RepReportScheduleListByCompany,
	RepReportScheduleMerge,
	RepReportTemplateDelete,
	RepReportTemplateGet,
	RepReportTemplateListByCompany,
	RepReportTemplateMerge,
	RepSelfGet,
	RepSelfLogout,
	RepSelfPassword,
	RepSessionDelete,
	RepSessionListByCompany,
	RepSessionListByUser,
	RepUserDelete,
	RepUserGet,
	RepUserGroupDelete,
	RepUserGroupGet,
	RepUserGroupListByCompany,
	RepUserGroupMerge,
	RepUserListByCompany,
	RepUserMerge
} from '@trakit/commands';
import {
	email,
	expression,
	guid,
	int,
	JsonObject,
	Machine,
	nothing,
	serialization,
	SystemsOfUnits,
	Timezone,
	ulong,
	url,
	UserNotifications
} from '@trakit/objects';
import { RepProviderListByCompany } from '../../trakit-ts-commands/_publish/commands/Providers/Providers/Responses/RepProviderList';
import { TrakitCommander } from './TrakitCommander';


////#region Behaviours/Logs
///**
// * Finds the given company and removes all the logs returned using the filter argument.
// * @param {!number} companyId
// * @param {!function(trakit.fleetfreedom.BehaviourLog):boolean} filter
// **/
//function BEHAVIOUR_LOG_PURGE(companyId: ulong, filter) {
//	var company = COMPANIES.get(companyId: ulong);
//	if (company) {
//		company.behaviourLogs.filter(filter).forEach(function(log) {
//			company.removeBehaviourLog(log.id);
//		});
//	}
//}
///**
// * The name of the {@link trakit.fleetfreedom.BehaviourLog} type.
// * @const {string}
// **/
//var BEHAVIOUR_LOG_TYPE = "behaviourLog";
///**
// * The name of the {@link trakit.fleetfreedom.BehaviourLog} type.
// * @const {string}
// **/
//var BEHAVIOUR_LOG_TYPES = BEHAVIOUR_LOG_TYPE + "s";
///**
// * Name of the event fired when loading a list of logs by {@link trakit.fleetfreedom.Behaviour}.
// * @const {string}
// **/
//var BEHAVIOUR_LOG_BEHAVE_EVENT = BEHAVIOUR_LOG_TYPE + "BehaviourList";
///**
// * Name of the event fired when loading a list of logs by {@link trakit.fleetfreedom.BehaviourScript}.
// * @const {string}
// **/
//var BEHAVIOUR_LOG_SCRIPT_EVENT = BEHAVIOUR_LOG_TYPE + "BehaviourScriptList";
////#endregion Behaviours/Logs

/**
 * The base class used to help define interaction with all Trak-iT API services.
 */
export abstract class TrakitObjectCommander<TRequest> extends TrakitCommander<TRequest> {
	constructor(
		baseAddress?: URL | url | nothing,
		account?: RepSelfGet | { machine: { key: string } }
				| Machine | { key: string }
				| { ghostId: guid }
				| guid
				| nothing
	) {
		super(baseAddress, account);
	}
	
	//#region Self
	/**
	 * Requests the details of the {@link User} or {@link Machine} currently identified.
	 * @returns The account details or null.
	 */
	public async selfDetails(): Promise<RepSelfGet> {
		this.account = await this.command<RepSelfGet>(new PaySelfGet());
		this.setAuth(this.account);
		return this.account;
	}

	/**
	 * Sends a login command, and if successful, saves the ghostId as the authentication mechanism for all further requests.
	 * @param username Your email address.
	 * @param password Your password.
	 * @param userAgent Optional string to identify this software.
	 * @returns The response, which contains a SelfUser when successful.
	 */
	public async login(username: string, password: string, userAgent: string | null = null): Promise<RepSelfGet | null> {
		this.account = await this.command<RepSelfGet>(new PaySelfLogin({
			username: username,
			password: password,
			userAgent: userAgent,
		}));
		this.setAuth(this.account);
		return this.account;
	}
	/**
	 * Sends a logout command, and if successful, removes the current session using setAuth().
	 * @returns The logout response.
	 */
	public async logout(): Promise<RepSelfLogout> {
		const reply = this.command<RepSelfLogout>(new PaySelfLogout());
		this.setAuth();
		return reply;
	}

	/**
	 * Allows a {@link User} to update their own {@link Contact}. 
	 * If your {@link User} has no associated {@link Contact}, you will receive a {@link ErrorCode.contactNotFound} error.
	 * @param name
	 * @param notes
	 * @param otherNames
	 * @param emails
	 * @param phones
	 * @param addresses
	 * @param urls
	 * @param dates
	 * @param options
	 * @param roles
	 * @param pictures
	 * @returns The reply from the update contact command.
	 */
	public updateContact(
		name?: string,
		notes?: string,
		otherNames?: Map<string, string | null>,
		emails?: Map<string, string | null>,
		phones?: Map<string, ulong | null>,
		addresses?: Map<string, string | null>,
		urls?: Map<string, url | null>,
		dates?: Map<string, Date | null>,
		options?: Map<string, string | null>,
		roles?: string[],
		pictures?: ulong[],
	): Promise<Reply> {
		return this.command<Reply>(new PaySelfContact({
			contact: {
				name: name ?? null,
				notes: notes ?? null,
				otherNames: otherNames ?? null,
				emails: emails ?? null,
				phones: phones ?? null,
				addresses: addresses ?? null,
				urls: urls ?? null,
				dates: dates ?? null,
				options: options ?? null,
				roles: roles ?? null,
				pictures: pictures ?? null,
			} as JsonObject,
		}));
	}
	/**
	 * Allows a session {@link User} to change their own password.
	 * @param oldPassword Your current password, as verification that you are the account owner.
	 * @param newPassword Your new password must conform to your company's PasswordPolicy.
	 * @returns The password change response.
	 */
	public updatePassword(
		oldPassword: string,
		newPassword: string
	): Promise<RepSelfPassword> {
		return this.command<RepSelfPassword>(new PaySelfPassword({
			current: oldPassword,
			password: newPassword,
		}));
	}
	/**
	 * Allows a {@link User} to change their own preferences.
	 * @param language
	 * @param timezone
	 * @param notify
	 * @param formats
	 * @param measurements
	 * @param options
	 * @returns The reply from the update preferences command.
	 */
	public updatePreferences(
		language?: string,
		timezone?: Timezone | string,
		notify?: UserNotifications[] | JsonObject[],
		formats?: Map<string, string> | JsonObject,
		measurements?: Map<string, SystemsOfUnits> | JsonObject,
		options?: Map<string, string> | JsonObject
	): Promise<Reply> {
		return this.command<Reply>(new PaySelfPreferences({
			language: language ?? null,
			timezone: (timezone as Timezone)?.code ?? timezone ?? null,
			notify: notify?.map(n => (n as UserNotifications).toJSON?.() ?? n) ?? null,
			formats: formats instanceof Map
				? serialization.fromMap(formats) as JsonObject
				: formats ?? null,
			measurements: measurements instanceof Map
				? serialization.fromMap(measurements) as JsonObject
				: measurements ?? null,
			options: options instanceof Map
				? serialization.fromMap(options) as JsonObject
				: options ?? null,
		}));
	}
	//#endregion Self

	//#region Companies
	/**
	 * Retrieves a list of all companies in the tree for the given company.
	 * @expose
	 * @param {number=} id
	 * @param {ParamListConstraintsById=} constraints
	 * @return {!Promise<SyncMindflayer>}
	 **/
	listCompanies(id: ulong, constraints?: JsonObject) {
		return this.command<RepCompanyGeneralListByCompany>(new PayCompanyGeneralListByCompany({
			...constraints,
			company: { id },
		}));
	}
	/**
	 * Retrieves a given company from the server by its {@link trakit.fleetfreedom.Company#id}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getCompany(id: ulong) {
		return this.command<RepCompanyGet>(new PayCompanyGet({
			company: { id },
		}));
	}
	/**
	 * Merges a {@link trakit.fleetfreedom.Company}.
	 * @expose
	 * @param {!trakit.json.Company} json
	 * @return {!Promise<SyncMindflayer>}
	 **/
	mergeCompany(json: JsonObject) {
		return this.command<RepCompanyMerge>(new PayCompanyMerge({
			company: json,
		}));
	}
	/**
	 * Deletes a {@link trakit.fleetfreedom.Company}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	removeCompany(id: ulong) {
		return this.command<RepCompanyDelete>(new PayCompanyDelete({
			company: { id },
		}));
	}
	/**
	 * Restores a deleted {@link trakit.fleetfreedom.Company}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	restoreCompany(id: ulong) {
		return this.command<RepCompanyDelete>(new PayCompanyRestore({
			company: { id },
		}));
	}
	//#endregion Companies
	//#region Companies/Reseller
	/**
	 * Retrieves a given Reseller from the server by its {@link trakit.fleetfreedom.CompanyReseller#id}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getReseller(id: ulong) {
		return this.command<RepCompanyResellerGet>(new PayCompanyResellerGet({
			company: { id },
		}));
	}
	/**
	 * Merges a {@link trakit.fleetfreedom.CompanyReseller}.
	 * @expose
	 * @param {!trakit.json.CompanyReseller} json
	 * @return {!Promise<SyncMindflayer>}
	 **/
	mergeReseller(json: JsonObject) {
		return this.command<RepCompanyResellerMerge>(new PayCompanyResellerMerge({
			company: json,
		}));
	}
	/**
	 * Deletes a {@link trakit.fleetfreedom.CompanyReseller}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	removeReseller(id: ulong) {
		return this.command<RepCompanyResellerDelete>(new PayCompanyResellerDelete({
			company: { id },
		}));
	}
	/**
	 * Restores a deleted {@link trakit.fleetfreedom.CompanyReseller}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	restoreReseller(id: ulong) {
		return this.command<RepCompanyResellerDelete>(new PayCompanyResellerRestore({
			company: { id },
		}));
	}
	//#endregion Companies/Reseller
	
	//#region Contacts
	/**
	 * Retrieves a list of all Contacts in the given company.
	 * If a company is not given it will use the currently selected company.
	 * @expose
	 * @param {number=} companyId
	 * @param {ParamListConstraintsById=} constraints
	 * @return {!Promise<SyncMindflayer>}
	 **/
	listContacts(companyId: ulong, constraints?: JsonObject) {
		return this.command<RepContactListByCompany>(new PayContactListByCompany({
			...constraints,
			company: { id: companyId },
		}));
	}
	/**
	 * Retrieves a given contact from the server by its {@link trakit.fleetfreedom.Contact#id}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getContact(id: ulong) {
		return this.command<RepContactGet>(new PayContactGet({
			contact: { id },
		}));
	}
	/**
	 * Merges a {@link trakit.fleetfreedom.Contact}.
	 * @expose
	 * @param {!trakit.json.Contact} json
	 * @return {!Promise<SyncMindflayer>}
	 **/
	mergeContact(json: JsonObject) {
		return this.command<RepContactMerge>(new PayContactMerge({
			contact: json,
		}));
	}
	/**
	 * Deletes a {@link trakit.fleetfreedom.Contact}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	removeContact(id: ulong) {
		return this.command<RepContactDelete>(new PayContactDelete({
			contact: { id },
		}));
	}
	/**
	 * Restores a deleted {@link trakit.fleetfreedom.Contact}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	restoreContact(id: ulong) {
		return this.command<RepContactDelete>(new PayContactRestore({
			contact: { id },
		}));
	}
	/**
	 * Merges a batch of {@link trakit.fleetfreedom.Contact}s.
	 * @expose
	 * @param {!Array.<trakit.json.Contact>} array
	 * @return {!Promise<SyncMindflayer>}
	 **/
	multiMergeContact(array: JsonObject[]) {
		return this.command<RepContactBatchMerge>(new PayContactBatchMerge({
			contacts: array,
		}));
	}
	/**
	 * Merges a batch of {@link trakit.fleetfreedom.Contact}s.
	 * @expose
	 * @param {!Array.<trakit.json.Contact>} array
	 * @return {!Promise<SyncMindflayer>}
	 **/
	multiRemoveContact(array: JsonObject[]) {
		return this.command<RepContactBatchDelete>(new PayContactBatchDelete({
			contacts: array,
		}));
	}
	//#endregion Contacts
	//#region Users
	/**
	 * Retrieves a list of all Users in the given company.
	 * If a company is not given it will use the currently selected company.
	 * @expose
	 * @param {number=} companyId
	 * @param {ParamListConstraintsByString=} constraints
	 * @return {!Promise<SyncMindflayer>}
	 **/
	listUsers(companyId: ulong, constraints?: JsonObject) {
		return this.command<RepUserListByCompany>(new PayUserListByCompany({
			...constraints,
			company: { id: companyId },
		}));
	}
	/**
	 * Retrieves a given user from the server by its {@link trakit.fleetfreedom.User#id}.
	 * @expose
	 * @param {!string} login
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getUser(login: email) {
		return this.command<RepUserGet>(new PayUserGet({
			user: { login },
		}));
	}
	/**
	 * Merges an {@link trakit.fleetfreedom.User}.
	 * @expose
	 * @param {!trakit.json.User} json
	 * @return {!Promise<SyncMindflayer>}
	 **/
	mergeUser(json: JsonObject) {
		return this.command<RepUserMerge>(new PayUserMerge({
			user: json,
		}));
	}
	/**
	 * Deletes an {@link trakit.fleetfreedom.User}.
	 * @expose
	 * @param {!string} login
	 * @return {!Promise<SyncMindflayer>}
	 **/
	removeUser(login: email) {
		return this.command<RepUserDelete>(new PayUserDelete({
			user: { login },
		}));
	}
	/**
	 * Restores a deleted {@link trakit.fleetfreedom.User}.
	 * @expose
	 * @param {!string} login
	 * @return {!Promise<SyncMindflayer>}
	 **/
	restoreUser(login: email) {
		return this.command<RepUserDelete>(new PayUserRestore({
			user: { login },
		}));
	}
	//#endregion User
	//#region User Groups
	/**
	 * Retrieves a list of all User Groups in the given company.
	 * If a company is not given it will use the currently selected company.
	 * @expose
	 * @param {number=} companyId
	 * @param {ParamListConstraintsById=} constraints
	 * @return {!Promise<SyncMindflayer>}
	 **/
	listUserGroups(companyId: ulong, constraints?: JsonObject) {
		return this.command<RepUserGroupListByCompany>(new PayUserGroupListByCompany({
			...constraints,
			company: { id: companyId },
		}));
	}
	/**
	 * Retrieves a given group from the server by its {@link trakit.fleetfreedom.UserGroup#id}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getUserGroup(id: ulong) {
		return this.command<RepUserGroupGet>(new PayUserGroupGet({
			userGroup: { id },
		}));
	}
	/**
	 * Merges a {@link trakit.fleetfreedom.UserGroup}.
	 * @expose
	 * @param {!trakit.json.UserGroup} json
	 * @return {!Promise<SyncMindflayer>}
	 **/
	mergeUserGroup(json: JsonObject) {
		return this.command<RepUserGroupMerge>(new PayUserGroupMerge({
			userGroup: json,
		}));
	}
	/**
	 * Deletes a {@link trakit.fleetfreedom.UserGroup}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	removeUserGroup(id: ulong) {
		return this.command<RepUserGroupDelete>(new PayUserGroupDelete({
			userGroup: { id },
		}));
	}
	/**
	 * Restores a deleted {@link trakit.fleetfreedom.UserGroup}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	restoreUserGroup(id: ulong) {
		return this.command<RepUserGroupDelete>(new PayUserGroupRestore({
			userGroup: { id },
		}));
	}
	//#endregion User Groups
	//#region Machines
	/**
	 * Retrieves a list of all Machines in the given company.
	 * If a company is not given it will use the currently selected company.
	 * @expose
	 * @param {number=} companyId
	 * @param {ParamListConstraintsByString=} constraints
	 * @return {!Promise<SyncMindflayer>}
	 **/
	listMachines(companyId: ulong, constraints?: JsonObject) {
		return this.command<RepMachineListByCompany>(new PayMachineListByCompany({
			...constraints,
			company: { id: companyId },
		}));
	}
	/**
	 * Retrieves a given machine from the server by its {@link trakit.fleetfreedom.Machine#id}.
	 * @expose
	 * @param {!string} key
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getMachine(key: string) { 
		return this.command<RepMachineGet>(new PayMachineGet({
			machine: { id: key },
		}));
	}
	/**
	 * Merges an {@link trakit.fleetfreedom.Machine}.
	 * @expose
	 * @param {!trakit.json.Machine} json
	 * @return {!Promise<SyncMindflayer>}
	 **/
	mergeMachine(json: JsonObject) {
		return this.command<RepMachineMerge>(new PayMachineMerge({
			machine: json,
		}));
	}
	/**
	 * Deletes an {@link trakit.fleetfreedom.Machine}.
	 * @expose
	 * @param {!string} key
	 * @return {!Promise<SyncMindflayer>}
	 **/
	removeMachine(key: string) { 
		return this.command<RepMachineDelete>(new PayMachineDelete({
			machine: { id: key },
		}));
	}
	/**
	 * Restores a deleted {@link trakit.fleetfreedom.Machine}.
	 * @expose
	 * @param {!string} key
	 * @return {!Promise<SyncMindflayer>}
	 **/
	restoreMachine(key: string) { 
		return this.command<RepMachineDelete>(new PayMachineRestore({
			machine: { id: key },
		}));
	}
	//#endregion Machine
	//#region Sessions
	/**
	 * Retrieves a list of all Sessions in the given company.
	 * If a company is not given it will use the currently selected company.
	 * @expose
	 * @param {number=} companyId
	 * @return {!Promise<SyncMindflayer>}
	 **/
	listSessions(companyId: ulong, constraints?: JsonObject) {
		return this.command<RepSessionListByCompany>(new PaySessionListByCompany({
			...constraints,
			company: { id: companyId },
		}));
	}
	/**
	 * Retrieves a list of all Sessions in the given user.
	 * @expose
	 * @param {!string} login
	 * @return {!Promise<SyncMindflayer>}
	 **/
	listSessionsByUser(login: email, constraints?: JsonObject) {
		return this.command<RepSessionListByUser>(new PaySessionListByUser({
			...constraints,
			user: { login },
		}));
	}
	/**
	 * Deletes a {@link trakit.fleetfreedom.SessionFull}.
	 * @expose
	 * @param {!string} handle
	 * @return {!Promise<SyncMindflayer>}
	 **/
	killSession(handle: string) { 
		return this.command<RepSessionDelete>(new PaySessionDelete({
			session: { handle },
		}));
	}
	//#endregion Sessions

	//#region Icons
	/**
	 * Retrieves a list of all icons in the trunk for the given company.
	 * If a company is not given it will use the currently selected company.
	 * @expose
	 * @param {number=} companyId
	 * @param {ParamListConstraintsById=} constraints
	 * @return {!Promise<SyncMindflayer>}
	 **/
	listIcons(companyId: ulong, constraints?: JsonObject) {
		return this.command<RepIconListByCompany>(new PayIconListByCompany({
			...constraints,
			company: { id: companyId },
		}));
	}
	/**
	 * Retrieves a given icon from the server by its {@link trakit.fleetfreedom.Icon#id}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getIcon(id: ulong) {
		return this.command<RepIconGet>(new PayIconGet({
			icon: { id },
		}));
	}
	/**
	 * Merges a {@link trakit.fleetfreedom.Icon}.
	 * @expose
	 * @param {!trakit.json.Icon} json
	 * @return {!Promise<SyncMindflayer>}
	 **/
	mergeIcon(json: JsonObject) {
		return this.command<RepIconMerge>(new PayIconMerge({
			icon: json,
		}));
	}
	/**
	 * Deletes a {@link trakit.fleetfreedom.Icon}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	removeIcon(id: ulong) {
		return this.command<RepIconDelete>(new PayIconDelete({
			icon: { id },
		}));
	}
	/**
	 * Restores a deleted {@link trakit.fleetfreedom.Icon}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	restoreIcon(id: ulong) {
		return this.command<RepIconDelete>(new PayIconRestore({
			icon: { id },
		}));
	}
	//#endregion Icons
	//#region Pictures
	/**
	 * Retrieves a list of all pictures in the trunk for the given company.
	 * If a company is not given it will use the currently selected company.
	 * @expose
	 * @param {number=} companyId
	 * @param {ParamListConstraintsById=} constraints
	 * @return {!Promise<SyncMindflayer>}
	 **/
	listPictures(companyId: ulong, constraints?: JsonObject) {
		return this.command<RepPictureListByCompany>(new PayPictureListByCompany({
			...constraints,
			company: { id: companyId },
		}));
	}
	/**
	 * Retrieves a given picture from the server by its {@link trakit.fleetfreedom.Picture#id}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getPicture(id: ulong) {
		return this.command<RepPictureGet>(new PayPictureGet({
			picture: { id },
		}));
	}
	/**
	 * Merges a {@link trakit.fleetfreedom.Picture}.
	 * @expose
	 * @param {!trakit.json.Picture} json
	 * @return {!Promise<SyncMindflayer>}
	 **/
	mergePicture(json: JsonObject) {
		return this.command<RepPictureMerge>(new PayPictureMerge({
			picture: json,
		}));
	}
	/**
	 * Deletes a {@link trakit.fleetfreedom.Picture}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	removePicture(id: ulong) {
		return this.command<RepPictureDelete>(new PayPictureDelete({
			picture: { id },
		}));
	}
	/**
	 * Restores a deleted {@link trakit.fleetfreedom.Picture}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	restorePicture(id: ulong) {
		return this.command<RepPictureDelete>(new PayPictureRestore({
			picture: { id },
		}));
	}
	//#endregion Pictures
	//#region Documents
	/**
	 * Retrieves a list of all documents in the given company.
	 * If a company is not given it will use the currently selected company.
	 * @expose
	 * @param {number=} companyId
	 * @param {ParamListConstraintsById=} constraints
	 * @return {!Promise<SyncMindflayer>}
	 **/
	listDocuments(companyId: ulong, constraints?: JsonObject) {
		return this.command<RepDocumentListByCompany>(new PayDocumentListByCompany({
			...constraints,
			company: { id: companyId },
		}));
	}
	/**
	 * Retrieves a given document from the server by its {@link trakit.fleetfreedom.Document#id}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getDocument(id: ulong) {
		return this.command<RepDocumentGet>(new PayDocumentGet({
			document: { id },
		}));
	}
	/**
	 * Merges a {@link trakit.fleetfreedom.Document}.
	 * @expose
	 * @param {!trakit.json.Document} json
	 * @return {!Promise<SyncMindflayer>}
	 **/
	mergeDocument(json: JsonObject) {
		return this.command<RepDocumentMerge>(new PayDocumentMerge({
			document: json,
		}));
	}
	/**
	 * Deletes a {@link trakit.fleetfreedom.Document}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	removeDocument(id: ulong) {
		return this.command<RepDocumentDelete>(new PayDocumentDelete({
			document: { id },
		}));
	}
	/**
	 * Restores a deleted {@link trakit.fleetfreedom.Document}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	restoreDocument(id: ulong) {
		return this.command<RepDocumentDelete>(new PayDocumentRestore({
			document: { id },
		}));
	}
	//#endregion Documents
	//#region Forms/Templates
	/**
	 * Retrieves a list of all templates in the given company.
	 * If a company is not given it will use the currently selected company.
	 * @expose
	 * @param {number=} companyId
	 * @param {ParamListConstraintsById=} constraints
	 * @return {!Promise<SyncMindflayer>}
	 **/
	listFormTemplates(companyId: ulong, constraints?: JsonObject) {
		return this.command<RepFormTemplateListByCompany>(new PayFormTemplateListByCompany({
			...constraints,
			company: { id: companyId },
		}));
	}
	/**
	 * Retrieves a given template from the server by its {@link trakit.fleetfreedom.FormTemplate#id}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getFormTemplate(id: ulong) {
		return this.command<RepFormTemplateGet>(new PayFormTemplateGet({
			formTemplate: { id },
		}));
	}
	/**
	 * Merges a {@link trakit.fleetfreedom.FormTemplate}.
	 * @expose
	 * @param {!trakit.json.FormTemplate} json
	 * @return {!Promise<SyncMindflayer>}
	 **/
	mergeFormTemplate(json: JsonObject) {
		return this.command<RepFormTemplateMerge>(new PayFormTemplateMerge({
			formTemplate: json,
		}));
	}
	/**
	 * Deletes a {@link trakit.fleetfreedom.FormTemplate}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	removeFormTemplate(id: ulong) {
		return this.command<RepFormTemplateDelete>(new PayFormTemplateDelete({
			formTemplate: { id },
		}));
	}
	/**
	 * Restores a deleted {@link trakit.fleetfreedom.FormTemplate}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	restoreFormTemplate(id: ulong) {
		return this.command<RepFormTemplateDelete>(new PayFormTemplateRestore({
			formTemplate: { id },
		}));
	}
	//#endregion Forms/Templates
	//#region Forms/Results
	/**
	 * Retrieves a list of all form results in the given company.
	 * If a company is not given it will use the currently selected company.
	 * @expose
	 * @param {number=} companyId
	 * @param {ParamListConstraintsByDts=} constraints
	 * @return {!Promise<SyncMindflayer>}
	 **/
	listFormResults(companyId: ulong, constraints?: JsonObject) {
		return this.command<RepFormResultListByCompany>(new PayFormResultListByCompany({
			...constraints,
			company: { id: companyId },
		}));
	}
	/**
	 * Retrieves a given form result from the server by its {@link trakit.fleetfreedom.FormResult#id}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getFormResult(id: ulong) {
		return this.command<RepFormResultGet>(new PayFormResultGet({
			formResult: { id },
		}));
	}
	/**
	 * Merges a {@link trakit.fleetfreedom.FormResult}.
	 * @expose
	 * @param {!trakit.json.FormResult} json
	 * @return {!Promise<SyncMindflayer>}
	 **/
	mergeFormResult(json: JsonObject) {
		return this.command<RepFormResultMerge>(new PayFormResultMerge({
			formResult: json,
		}));
	}
	/**
	 * Merges a batch of {@link trakit.fleetfreedom.FormResult}s.
	 * @expose
	 * @param {!Array.<trakit.json.FormResult>} array
	 * @return {!Promise<SyncMindflayer>}
	 **/
	multiMergeFormResult(id: ulong) {
		return this.command<RepFormResultBatchMerge>(new PayFormResultBatchMerge({
			formResult: { id },
		}));
	}
	/**
	 * Deletes a {@link trakit.fleetfreedom.FormResult}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	removeFormResult(id: ulong) {
		return this.command<RepFormResultDelete>(new PayFormResultDelete({
			formResult: { id },
		}));
	}
	/**
	 * Restores a deleted {@link trakit.fleetfreedom.FormResult}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	restoreFormResult(id: ulong) {
		return this.command<RepFormResultDelete>(new PayFormResultRestore({
			formResult: { id },
		}));
	}
	//#endregion Forms/Results
	//#region Dashcams
	/**
	 * Retrieves a list of all dashcam-data in the given company.
	 * If a company is not given it will use the currently selected company.
	 * @expose
	 * @param {number=} companyId
	 * @param {ParamListConstraintsByDts=} constraints
	 * @return {!Promise<SyncMindflayer>}
	 **/
	listDashcamDatas(companyId: ulong, constraints?: JsonObject) {
		return this.command<RepDashcamListByCompany>(new PayDashcamListByCompany({
			...constraints,
			company: { id: companyId },
		}));
	}
	/**
	 * Retrieves a given dashcam-data from the server by its {@link trakit.json.DashcamData#guid}.
	 * @expose
	 * @param {!trakit.json.guid} guid
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getDashcamData(guid: guid) { 
		return this.command<RepDashcamGet>(new PayDashcamGet({
			dashcam: { guid },
		}));
	}
	/**
	 * Retrieves a list of all dashcam-data in the given company.
	 * If a company is not given it will use the currently selected company.
	 * @expose
	 * @param {number=} companyId
	 * @return {!Promise<SyncMindflayer>}
	 **/
	listDashcamLives(companyId: ulong, constraints?: JsonObject) {
		return this.command<RepDashcamLiveListByCompany>(new PayDashcamLiveListByCompany({
			...constraints,
			company: { id: companyId },
		}));
	}
	//#endregion Dashcams

	//#region Assets
	/**
	 * Retrieves a list of all Assets in the given company.
	 * If a company is not given it will use the currently selected company.
	 * @expose
	 * @param {number=} companyId
	 * @param {ParamListConstrainAsset=} constraints
	 * @return {!Promise<SyncMindflayer>}
	 **/
	listAssets(companyId: ulong, constraints?: JsonObject) {
		return this.command<RepAssetListByCompany>(new PayAssetListByCompany({
			...constraints,
			company: { id: companyId },
		}));
	}
	/**
	 * Retrieves a given asset from the server by its {@link trakit.fleetfreedom.Asset#id}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getAsset(id: ulong) {
		return this.command<RepAssetGet>(new PayAssetGet({
			asset: { id },
		}));
	}
	/**
	 * Merges an {@link trakit.fleetfreedom.Asset}.
	 * @expose
	 * @param {!trakit.json.Asset} json
	 * @return {!Promise<SyncMindflayer>}
	 **/
	mergeAsset(json: JsonObject) {
		return this.command<RepAssetMerge>(new PayAssetMerge({
			asset: json,
		}));
	}
	/**
	 * Merges a batch of {@link trakit.fleetfreedom.Asset}s.
	 * @expose
	 * @param {!Array.<trakit.json.Asset>} array
	 * @return {!Promise<SyncMindflayer>}
	 **/
	multiMergeAsset(id: ulong) {
		return this.command<RepAssetBatchMerge>(new PayAssetBatchMerge({
			asset: { id },
		}));
	}
	/**
	 * Deletes an {@link trakit.fleetfreedom.Asset}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	removeAsset(id: ulong) {
		return this.command<RepAssetDelete>(new PayAssetDelete({
			asset: { id },
		}));
	}
	/**
	 * Restores a deleted {@link trakit.fleetfreedom.Asset}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	restoreAsset(id: ulong) {
		return this.command<RepAssetDelete>(new PayAssetRestore({
			asset: { id },
		}));
	}
	/**
	 * Suspends an {@link trakit.fleetfreedom.Asset}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	suspendAsset(id: ulong) { 
		return this.command<RepAssetSuspend>(new PayAssetSuspend({
			asset: { id },
		}));
	}
	/**
	 * Reactivates an {@link trakit.fleetfreedom.Asset}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	reviveAsset(id: ulong) { 
		return this.command<RepAssetSuspend>(new PayAssetReactivate({
			asset: { id },
		}));
	}
	/**
	 * Searches all available companies for {@link trakit.fleetfreedom.Asset}s that match the given expression.
	 * @expose
	 * @param {!string} expression
	 * @param {ParamListConstraintsById=} constraints
	 * @return {!Promise<SyncMindflayer>}
	 **/
	searchAssets(expression: expression, constraints?: JsonObject) {
		//return INDFLAYER_SEARCH("asset", expression, null, constraints);
	};
	//#endregion Assets
	//#region Assets/Dispatch
	/**
	 * Updates the given asset's dispatch jobs and optimizes the steps based on back-end logic.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	mergeAssetDispatch(json: JsonObject) {
		return this.command<RepAssetDispatchMerge>(new PayAssetDispatchMerge({
			assetDispatch: json,
		}));
	}
	/**
	 * Optimizes the given asset's dispatch jobs and returns the new order and ETAs based on back-end logic.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	previewAssetDispatch(json: JsonObject) {
		//return CLIENT.medusa("assets/" + json["asset"]["id"] + "/dispatch/waypoints", "POST", json);
	};
	//#endregion Assets/Dispatch
	//#region Assets/DispatchTasks
	/**
	 * Retrieves a list of all dispatch tasks in the given company.
	 * If a company is not given it will use the currently selected company.
	 * @expose
	 * @param {number=} companyId
	 * @param {ParamListConstraintsByDts=} constraints
	 * @return {!Promise<SyncMindflayer>}
	 **/
	listDispatchTasks(companyId: ulong, constraints?: JsonObject) {
		return this.command<RepDispatchTaskListByCompany>(new PayDispatchTaskListByCompany({
			...constraints,
			company: { id: companyId },
		}));
	}
	/**
	 * Retrieves a list of all dispatch tasks for the given asset.
	 * @expose
	 * @param {!number} assetId
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getDispatchTasksByAsset(assetId: ulong, constraints?: JsonObject) { 
		return this.command<RepDispatchTaskListByAsset>(new PayDispatchTaskListByAsset({
			...constraints,
			asset: { id: assetId },
		}));
	}
	/**
	 * Retrieves a given dispatch task from the server by its {@link trakit.fleetfreedom.DispatchTask#id}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getDispatchTask(id: ulong) {
		return this.command<RepDispatchTaskGet>(new PayDispatchTaskGet({
			dispatchTask: { id },
		}));
	}
	/**
	 * Merges a {@link trakit.fleetfreedom.DispatchTask}.
	 * @expose
	 * @param {!trakit.json.DispatchTask} json
	 * @return {!Promise<SyncMindflayer>}
	 **/
	mergeDispatchTask(json: JsonObject) {
		return this.command<RepDispatchTaskMerge>(new PayDispatchTaskMerge({
			dispatchTask: json,
		}));
	}
	/**
	 * Merges a batch of {@link trakit.fleetfreedom.DispatchTask}s.
	 * @expose
	 * @param {!Array.<trakit.json.DispatchTask>} array
	 * @return {!Promise<SyncMindflayer>}
	 **/
	multiMergeDispatchTask(id: ulong) {
		return this.command<RepDispatchTaskBatchMerge>(new PayDispatchTaskBatchMerge({
			dispatchTask: { id },
		}));
	}
	/**
	 * Deletes a {@link trakit.fleetfreedom.DispatchTask}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	removeDispatchTask(id: ulong) {
		return this.command<RepDispatchTaskDelete>(new PayDispatchTaskDelete({
			dispatchTask: { id },
		}));
	}
	/**
	 * Restores a deleted {@link trakit.fleetfreedom.DispatchTask}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	restoreDispatchTask(id: ulong) {
		return this.command<RepDispatchTaskDelete>(new PayDispatchTaskRestore({
			dispatchTask: { id },
		}));
	}
	//#endregion Assets/DispatchTasks
	//#region Assets/DispatchJobs
	/**
	 * Retrieves a list of all dispatch jobs in the given company.
	 * If a company is not given it will use the currently selected company.
	 * @expose
	 * @param {number=} companyId
	 * @param {ParamListConstraintsByDts=} constraints
	 * @return {!Promise<SyncMindflayer>}
	 **/
	listDispatchJobs(companyId: ulong, constraints?: JsonObject) {
		return this.command<RepDispatchJobListByCompany>(new PayDispatchJobListByCompany({
			...constraints,
			company: { id: companyId },
		}));
	}
	/**
	 * Retrieves a list of all dispatch Jobs for the given asset.
	 * @expose
	 * @param {!number} assetId
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getDispatchJobsByAsset(assetId: ulong, constraints?: JsonObject) { 
		return this.command<RepDispatchJobListByAsset>(new PayDispatchJobListByAsset({
			...constraints,
			asset: { id: assetId },
		}));
	}
	/**
	 * Retrieves a given dispatch job from the server by its {@link trakit.fleetfreedom.DispatchJob#id}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getDispatchJob(id: ulong) {
		return this.command<RepDispatchJobGet>(new PayDispatchJobGet({
			dispatchJob: { id },
		}));
	}
	/**
	 * Merges a {@link trakit.fleetfreedom.DispatchJob}.
	 * @expose
	 * @param {!trakit.json.DispatchJob} json
	 * @return {!Promise<SyncMindflayer>}
	 **/
	mergeDispatchJob(json: JsonObject) {
		return this.command<RepDispatchJobMerge>(new PayDispatchJobMerge({
			dispatchJob: json,
		}));
	}
	/**
	 * Merges a batch of {@link trakit.fleetfreedom.DispatchJob}s.
	 * @expose
	 * @param {!Array.<trakit.json.DispatchJob>} array
	 * @return {!Promise<SyncMindflayer>}
	 **/
	multiMergeDispatchJob(id: ulong) {
		return this.command<RepDispatchJobBatchMerge>(new PayDispatchJobBatchMerge({
			dispatchJob: { id },
		}));
	}
	/**
	 * Deletes a {@link trakit.fleetfreedom.DispatchJob}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	removeDispatchJob(id: ulong) {
		return this.command<RepDispatchJobDelete>(new PayDispatchJobDelete({
			dispatchJob: { id },
		}));
	}
	/**
	 * Restores a deleted {@link trakit.fleetfreedom.DispatchJob}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	restoreDispatchJob(id: ulong) {
		return this.command<RepDispatchJobDelete>(new PayDispatchJobRestore({
			dispatchJob: { id },
		}));
	}
	/**
	 * Completes or progresses a {@link trakit.fleetfreedom.DispatchJob} (from the perspective of a driver, but by a dispatcher).
	 * @expose
	 * @param {!trakit.json.DispatchJob} json
	 * @return {!Promise<SyncMindflayer>}
	 **/
	changeDispatchJob(json: JsonObject) { 
		return this.command<RepDispatchJobMerge>(new PayDispatchJobChange({
			dispatchJob: json,
		}));
	}
	/**
	 * Cancels a {@link trakit.fleetfreedom.DispatchJob} and removes it from the dispatcher's and driver's view.
	 * @param {!trakit.json.DispatchJob} json
	 * @return {!Promise<SyncMindflayer>}
	 **/
	cancelDispatchJob(json: JsonObject) {
		return this.command<RepDispatchJobMerge>(new PayDispatchJobCancel({
			dispatchJob: json,
		}));
	}
	//#endregion Assets/DispatchJobs
	//#region Assets/Messages
	/**
	 * Retrieves a list of all messages in the given company.
	 * If a company is not given it will use the currently selected company.
	 * @expose
	 * @param {number=} companyId
	 * @param {ParamListConstraintsByDts=} constraints
	 * @return {!Promise<SyncMindflayer>}
	 **/
	listAssetMessages(companyId: ulong, constraints?: JsonObject) {
		return this.command<RepAssetMessageListByCompany>(new PayAssetMessageListByCompany({
			...constraints,
			company: { id: companyId },
		}));
	}
	/**
	 * Retrieves a list of all dispatch Jobs for the given asset.
	 * @expose
	 * @param {!number} assetId
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getAssetMessagesByAsset(assetId: ulong, constraints?: JsonObject) {
		return this.command<RepAssetMessageListByAsset>(new PayAssetMessageListByAsset({
			...constraints,
			asset: { id: assetId },
		}));
	}
	/**
	 * Retrieves a given message from the server by its {@link trakit.fleetfreedom.Message#id}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getAssetMessage(id: ulong) {
		return this.command<RepAssetMessageGet>(new PayAssetMessageGet({
			message: { id },
		}));
	}
	/**
	 * Merges a {@link trakit.fleetfreedom.Message}.
	 * @expose
	 * @param {!trakit.json.Message} json
	 * @return {!Promise<SyncMindflayer>}
	 **/
	mergeAssetMessage(json: JsonObject) {
		return this.command<RepAssetMessageMerge>(new PayAssetMessageMerge({
			assetMessage: json,
		}));
	}
	/**
	 * Merges a batch of {@link trakit.fleetfreedom.Message}s.
	 * @expose
	 * @param {!Array.<trakit.json.Message>} array
	 * @return {!Promise<SyncMindflayer>}
	 **/
	multiMergeAssetMessage(id: ulong) {
		return this.command<RepAssetMessageBatchMerge>(new PayAssetMessageBatchMerge({
			assetMessage: { id },
		}));
	}
	/**
	 * Deletes a {@link trakit.fleetfreedom.Message}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	removeAssetMessage(id: ulong) {
		return this.command<RepAssetMessageDelete>(new PayAssetMessageDelete({
			assetMessage: { id },
		}));
	}
	/**
	 * Restores a deleted {@link trakit.fleetfreedom.Message}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	restoreAssetMessage(id: ulong) {
		return this.command<RepAssetMessageDelete>(new PayAssetMessageRestore({
			assetMessage: { id },
		}));
	}
	//#endregion Assets/Messages

	//#region Places
	/**
	 * Retrieves a list of all places in the given company.
	 * If a company is not given it will use the currently selected company.
	 * @expose
	 * @param {number=} companyId
	 * @param {ParamListConstraintsById=} constraints
	 * @return {!Promise<SyncMindflayer>}
	 **/
	listPlaces(companyId: ulong, constraints?: JsonObject) {
		return this.command<RepPlaceListByCompany>(new PayPlaceListByCompany({
			...constraints,
			company: { id: companyId },
		}));
	}
	/**
	 * Retrieves a given place from the server by its {@link trakit.fleetfreedom.Place#id}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getPlace(id: ulong) {
		return this.command<RepPlaceGet>(new PayPlaceGet({
			place: { id },
		}));
	}
	/**
	 * Merges a {@link trakit.fleetfreedom.Place}.
	 * @expose
	 * @param {!trakit.json.Place} json
	 * @return {!Promise<SyncMindflayer>}
	 **/
	mergePlace(json: JsonObject) {
		return this.command<RepPlaceMerge>(new PayPlaceMerge({
			place: json,
		}));
	}
	/**
	 * Deletes a {@link trakit.fleetfreedom.Place}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	removePlace(id: ulong) {
		return this.command<RepPlaceDelete>(new PayPlaceDelete({
			place: { id },
		}));
	}
	/**
	 * Restores a deleted {@link trakit.fleetfreedom.Place}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	restorePlace(id: ulong) {
		return this.command<RepPlaceDelete>(new PayPlaceRestore({
			place: { id },
		}));
	}
	//#endregion Places

	//#region Providers
	/**
	 * Retrieves a list of all providers in the given company.
	 * If a company is not given it will use the currently selected company.
	 * @expose
	 * @param {number=} companyId
	 * @param {ParamListConstrainProvider=} constraints
	 * @return {!Promise<SyncMindflayer>}
	 **/
	listProviders(companyId: ulong, constraints?: JsonObject) {
		return this.command<RepProviderListByCompany>(new PayProviderListByCompany({
			...constraints,
			company: { id: companyId },
		}));
	}
	/**
	 * Retrieves a given provider from the server by its {@link trakit.fleetfreedom.Provider#id}.
	 * @expose
	 * @param {!string} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getProvider(id: string) {
		return this.command<RepProviderGet>(new PayProviderGet({
			provider: { id },
		}));
	}
	/**
	 * Merges an {@link trakit.fleetfreedom.Provider}.
	 * @expose
	 * @param {!trakit.json.Provider} json
	 * @return {!Promise<SyncMindflayer>}
	 **/
	mergeProvider(json: JsonObject) {
		return this.command<RepProviderMerge>(new PayProviderMerge({
			provider: json,
		}));
	}
	/**
	 * Merges a batch of {@link trakit.fleetfreedom.Provider}s.
	 * @expose
	 * @param {!Array.<trakit.json.Provider>} array
	 * @return {!Promise<SyncMindflayer>}
	 **/
	multiMergeProvider(array: JsonObject[]) {
		return this.command<RepProviderBatchMerge>(new PayProviderBatchMerge({
			providers: array,
		}));
	}
	/**
	 * Deletes a batch of {@link trakit.fleetfreedom.Provider}s.
	 * @expose
	 * @param {!Array.<trakit.json.Provider>} array
	 * @return {!Promise<SyncMindflayer>}
	 */
	multiRemoveProvider(array: JsonObject[]) { 
		return this.command<RepProviderBatchDelete>(new PayProviderBatchDelete({
			providers: array,
		}));
	}
	/**
	 * Deletes an {@link trakit.fleetfreedom.Provider}.
	 * @expose
	 * @param {!string} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	removeProvider(id: string) {
		return this.command<RepProviderDelete>(new PayProviderDelete({
			provider: { id },
		}));
	}
	/**
	 * Restores a deleted {@link trakit.fleetfreedom.Provider}.
	 * @expose
	 * @param {!string} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	restoreProvider(id: string) {
		return this.command<RepProviderDelete>(new PayProviderRestore({
			provider: { id },
		}));
	}
	///**
	// * Suspends an {@link trakit.fleetfreedom.Provider}.
	// * @expose
	// * @param {!string} id
	// * @return {!Promise<SyncMindflayer>}
	// **/
	//suspendProvider(id: string) {
	//	return this.command<RepProviderSuspend>(new PayProviderSuspend({
	//		provider: { id },
	//	}));
	//}
	///**
	// * Reactivates an {@link trakit.fleetfreedom.Provider}.
	// * @expose
	// * @param {!string} id
	// * @return {!Promise<SyncMindflayer>}
	// **/
	//reviveProvider(id: string) {
	//	return this.command<RepProviderSuspend>(new PayProviderReactivate({
	//		provider: { id },
	//	}));
	//}
	/**
	 * Searches all available companies for {@link trakit.fleetfreedom.Provider}s that match the given expression.
	 * @expose
	 * @param {!string} expression
	 * @param {ParamListConstraintsByString=} constraints
	 * @return {!Promise<SyncMindflayer>}
	 **/
	searchProviders(expression: expression, constraints?: JsonObject) {
		return //INDFLAYER_SEARCH("provider", expression, null, constraints);
	};
	//#endregion Provider
	//#region Providers/Scripts
	/**
	 * Retrieves a list of all Provider Scripts in the trunk for the given company.
	 * If a company is not given it will use the currently selected company.
	 * @expose
	 * @param {number=} companyId
	 * @param {ParamListConstraintsById=} constraints
	 * @return {!Promise<SyncMindflayer>}
	 **/
	listProviderScripts(companyId: ulong, constraints?: JsonObject) {
		return this.command<RepProviderScriptListByCompany>(new PayProviderScriptListByCompany({
			...constraints,
			company: { id: companyId },
		}));
	}
	/**
	 * Retrieves a given Provider Script from the server by its {@link trakit.fleetfreedom.ProviderScript#id}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getProviderScript(id: ulong) {
		return this.command<RepProviderScriptGet>(new PayProviderScriptGet({
			providerScript: { id },
		}));
	}
	/**
	 * Merges a {@link trakit.fleetfreedom.ProviderScript}.
	 * @expose
	 * @param {!trakit.json.ProviderScript} json
	 * @return {!Promise<SyncMindflayer>}
	 **/
	mergeProviderScript(json: JsonObject) {
		return this.command<RepProviderScriptMerge>(new PayProviderScriptMerge({
			providerScript: json,
		}));
	}
	/**
	 * Deletes a {@link trakit.fleetfreedom.ProviderScript}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	removeProviderScript(id: ulong) {
		return this.command<RepProviderScriptDelete>(new PayProviderScriptDelete({
			providerScript: { id },
		}));
	}
	/**
	 * Restores a deleted {@link trakit.fleetfreedom.ProviderScript}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	restoreProviderScript(id: ulong) {
		return this.command<RepProviderScriptDelete>(new PayProviderScriptRestore({
			providerScript: { id },
		}));
	}
	//#endregion Providers/Scripts
	//#region Providers/Configs
	/**
	 * Retrieves a list of all Provider Configs in the given company.
	 * If a company is not given it will use the currently selected company.
	 * @expose
	 * @param {number=} companyId
	 * @param {ParamListConstraintsById=} constraints
	 * @return {!Promise<SyncMindflayer>}
	 **/
	listProviderConfigs(companyId: ulong, constraints?: JsonObject) {
		return this.command<RepProviderConfigListByCompany>(new PayProviderConfigListByCompany({
			...constraints,
			company: { id: companyId },
		}));
	}
	/**
	 * Retrieves a given Provider Config from the server by its {@link trakit.fleetfreedom.ProviderConfig#id}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getProviderConfig(id: ulong) {
		return this.command<RepProviderConfigGet>(new PayProviderConfigGet({
			providerConfig: { id },
		}));
	}
	/**
	 * Merges a {@link trakit.fleetfreedom.ProviderConfig}.
	 * @expose
	 * @param {!trakit.json.ProviderConfig} json
	 * @return {!Promise<SyncMindflayer>}
	 **/
	mergeProviderConfig(json: JsonObject) {
		return this.command<RepProviderConfigMerge>(new PayProviderConfigMerge({
			providerConfig: json,
		}));
	}
	/**
	 * Merges a batch of {@link trakit.fleetfreedom.ProviderConfig}s.
	 * @expose
	 * @param {!Array.<trakit.json.ProviderConfig>} array
	 * @return {!Promise<SyncMindflayer>}
	 **/
	multiMergeProviderConfig(id: ulong) {
		return this.command<RepProviderConfigBatchMerge>(new PayProviderConfigBatchMerge({
			providerConfig: { id },
		}));
	}
	/**
	 * Deletes a {@link trakit.fleetfreedom.ProviderConfig}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	removeProviderConfig(id: ulong) {
		return this.command<RepProviderConfigDelete>(new PayProviderConfigDelete({
			providerConfig: { id },
		}));
	}
	/**
	 * Restores a deleted {@link trakit.fleetfreedom.ProviderConfig}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	restoreProviderConfig(id: ulong) {
		return this.command<RepProviderConfigDelete>(new PayProviderConfigRestore({
			providerConfig: { id },
		}));
	}
	//#endregion Providers/Configs
	//#region Providers/Configurations
	/**
	 * Retrieves a list of all Provider Configurations in the given company.
	 * If a company is not given it will use the currently selected company.
	 * @expose
	 * @param {number=} companyId
	 * @param {ParamListConstraintsById=} constraints
	 * @return {!Promise<SyncMindflayer>}
	 **/
	listProviderConfigurations(companyId: ulong, constraints?: JsonObject) {
		return this.command<RepProviderConfigurationListByCompany>(new PayProviderConfigurationListByCompany({
			...constraints,
			company: { id: companyId },
		}));
	}
	/**
	 * Retrieves a given Provider Configuration from the server by its {@link trakit.fleetfreedom.ProviderConfiguration#id}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getProviderConfiguration(id: ulong) {
		return this.command<RepProviderConfigurationGet>(new PayProviderConfigurationGet({
			providerConfiguration: { id },
		}));
	}
	/**
	 * Merges a {@link trakit.fleetfreedom.ProviderConfiguration}.
	 * @expose
	 * @param {!trakit.json.ProviderConfiguration} json
	 * @return {!Promise<SyncMindflayer>}
	 **/
	mergeProviderConfiguration(json: JsonObject) {
		return this.command<RepProviderConfigurationMerge>(new PayProviderConfigurationMerge({
			providerConfiguration: json,
		}));
	}
	/**
	 * Merges a batch of {@link trakit.fleetfreedom.ProviderConfiguration}s.
	 * @expose
	 * @param {!Array.<trakit.json.ProviderConfiguration>} array
	 * @return {!Promise<SyncMindflayer>}
	 **/
	multiMergeProviderConfiguration(id: ulong) {
		return this.command<RepProviderConfigurationBatchMerge>(new PayProviderConfigurationBatchMerge({
			providerConfiguration: { id },
		}));
	}
	/**
	 * Deletes a {@link trakit.fleetfreedom.ProviderConfiguration}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	removeProviderConfiguration(id: ulong) {
		return this.command<RepProviderConfigurationDelete>(new PayProviderConfigurationDelete({
			providerConfiguration: { id },
		}));
	}
	/**
	 * Restores a deleted {@link trakit.fleetfreedom.ProviderConfiguration}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	restoreProviderConfiguration(id: ulong) {
		return this.command<RepProviderConfigurationDelete>(new PayProviderConfigurationRestore({
			providerConfiguration: { id },
		}));
	}
	//#endregion Providers/Configurations
	//#region Providers/Registrations
	/**
	 * Retrieves a list of all Provider Registrations in the given company.
	 * If a company is not given it will use the currently selected company.
	 * @expose
	 * @param {number=} companyId
	 * @return {!Promise<SyncMindflayer>}
	 **/
	listProviderRegistration(companyId: ulong, constraints?: JsonObject) {
		return this.command<RepProviderRegistrationListByCompany>(new PayProviderRegistrationListByCompany({
			...constraints,
			company: { id: companyId },
		}));
	}
	/**
	 * Retrieves a given Provider Registration from the server by its {@link trakit.fleetfreedom.ProviderRegistration#id}.
	 * @expose
	 * @param {!number} code
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getProviderRegistration(code: int) { 
		return this.command<RepProviderRegistrationGet>(new PayProviderRegistrationGet({
			providerRegistration: { id: code },
		}));
	}
	/**
	 * Merges a {@link trakit.fleetfreedom.ProviderRegistration}.
	 * @expose
	 * @param {!trakit.json.ProviderRegistration} json
	 * @return {!Promise<SyncMindflayer>}
	 **/
	mergeProviderRegistration(json: JsonObject) {
		return this.command<RepProviderRegistrationMerge>(new PayProviderRegistrationMerge({
			providerRegistration: json,
		}));
	}
	/**
	 * Deletes a {@link trakit.fleetfreedom.ProviderRegistration}.
	 * @expose
	 * @param {!number} code
	 * @return {!Promise<SyncMindflayer>}
	 **/
	removeProviderRegistration(code: int) { 
		return this.command<RepProviderRegistrationDelete>(new PayProviderRegistrationDelete({
			providerRegistration: { id: code },
		}));
	}
	//#endregion Providers/Registrations

	//#region Behaviours
	/**
	 * Retrieves a list of all Behaviours in the given company.
	 * If a company is not given it will use the currently selected company.
	 * @expose
	 * @param {number=} companyId
	 * @param {ParamListConstraintsById=} constraints
	 * @return {!Promise<SyncMindflayer>}
	 **/
	listBehaviours(companyId: ulong, constraints?: JsonObject) {
		return this.command<RepBehaviourListByCompany>(new PayBehaviourListByCompany({
			...constraints,
			company: { id: companyId },
		}));
	}
	/**
	 * Retrieves a given behaviour from the server by its {@link trakit.fleetfreedom.Behaviour#id}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getBehaviour(id: ulong) {
		return this.command<RepBehaviourGet>(new PayBehaviourGet({
			behaviour: { id },
		}));
	}
	/**
	 * Merges a {@link trakit.fleetfreedom.Behaviour}.
	 * @expose
	 * @param {!trakit.json.Behaviour} json
	 * @return {!Promise<SyncMindflayer>}
	 **/
	mergeBehaviour(json: JsonObject) {
		return this.command<RepBehaviourMerge>(new PayBehaviourMerge({
			behaviour: json,
		}));
	}
	/**
	 * Merges a batch of {@link trakit.fleetfreedom.Behaviour}s.
	 * @expose
	 * @param {!Array.<trakit.json.Behaviour>} array
	 * @return {!Promise<SyncMindflayer>}
	 **/
	multiMergeBehaviour(id: ulong) {
		return this.command<RepBehaviourBatchMerge>(new PayBehaviourBatchMerge({
			behaviour: { id },
		}));
	}
	/**
	 * Deletes a {@link trakit.fleetfreedom.Behaviour}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	removeBehaviour(id: ulong) {
		return this.command<RepBehaviourDelete>(new PayBehaviourDelete({
			behaviour: { id },
		}));
	}
	/**
	 * Restores a deleted {@link trakit.fleetfreedom.Behaviour}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	restoreBehaviour(id: ulong) {
		return this.command<RepBehaviourDelete>(new PayBehaviourRestore({
			behaviour: { id },
		}));
	}
	//#endregion Behaviours
	//#region Behaviours/Scripts
	/**
	 * Retrieves a list of all behaviour scripts in the trunk for the given company.
	 * If a company is not given it will use the currently selected company.
	 * @expose
	 * @param {number=} companyId
	 * @param {ParamListConstraintsById=} constraints
	 * @return {!Promise<SyncMindflayer>}
	 **/
	listBehaviourScripts(companyId: ulong, constraints?: JsonObject) {
		return this.command<RepBehaviourScriptListByCompany>(new PayBehaviourScriptListByCompany({
			...constraints,
			company: { id: companyId },
		}));
	}
	/**
	 * Retrieves a given script from the server by its {@link trakit.fleetfreedom.Behaviour#id}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getBehaviourScript(id: ulong) {
		return this.command<RepBehaviourScriptGet>(new PayBehaviourScriptGet({
			behaviourScript: { id },
		}));
	}
	/**
	 * Merges a {@link trakit.fleetfreedom.Behaviour}.
	 * @expose
	 * @param {!trakit.json.Behaviour} json
	 * @return {!Promise<SyncMindflayer>}
	 **/
	mergeBehaviourScript(json: JsonObject) {
		return this.command<RepBehaviourScriptMerge>(new PayBehaviourScriptMerge({
			behaviourScript: json,
		}));
	}
	/**
	 * Deletes a {@link trakit.fleetfreedom.Behaviour}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	removeBehaviourScript(id: ulong) {
		return this.command<RepBehaviourScriptDelete>(new PayBehaviourScriptDelete({
			behaviourScript: { id },
		}));
	}
	/**
	 * Restores a deleted {@link trakit.fleetfreedom.Behaviour}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	restoreBehaviourScript(id: ulong) {
		return this.command<RepBehaviourScriptDelete>(new PayBehaviourScriptRestore({
			behaviourScript: { id },
		}));
	}
	//#endregion Behaviours/Scripts
	//#region Behaviours/Logs
	/**
	 * Retrieves a list of all BehaviourLogs in the given behaviour.
	 * If a company is not given it will use the currently selected company.
	 * @expose
	 * @param {!number} behaviourId
	 * @return {!Promise<SyncMindflayer>}
	 **/
	listBehaviourAssetLogs(behaviourId: ulong, constraints?: JsonObject) {
		return this.command<RepBehaviourLogListByAsset>(new PayBehaviourLogListByAsset({
			...constraints,
			behaviour: { id: behaviourId },
		}));
	}
	/**
	 * Deletes all the {@link trakit.fleetfreedom.BehaviourLog}s for the given behaviour.
	 * @expose
	 * @param {!number} behaviourId
	 * @return {!Promise<SyncMindflayer>}
	 **/
	clearBehaviourAssetLogs(behaviourId: ulong) {
		return this.command<RepBehaviourLogBatchDeleteByAsset>(new PayBehaviourLogBatchDeleteByAsset({
			behaviour: { id: behaviourId },
		}));
	}
	/**
	 * Retrieves a list of all BehaviourLogs in the given behaviour.
	 * If a company is not given it will use the currently selected company.
	 * @expose
	 * @param {!number} behaviourId
	 * @return {!Promise<SyncMindflayer>}
	 **/
	listBehaviourLogs(behaviourId: ulong, constraints?: JsonObject) {
		return this.command<RepBehaviourLogListByBehaviour>(new PayBehaviourLogListByBehaviour({
			...constraints,
			behaviour: { id: behaviourId },
		}));
	}
	/**
	 * Deletes all the {@link trakit.fleetfreedom.BehaviourLog}s for the given behaviour.
	 * @expose
	 * @param {!number} behaviourId
	 * @return {!Promise<SyncMindflayer>}
	 **/
	clearBehaviourLogs(behaviourId: ulong) {
		return this.command<RepBehaviourLogBatchDeleteByBehaviour>(new PayBehaviourLogBatchDeleteByBehaviour({
			behaviour: { id: behaviourId },
		}));
	}
	/**
	 * Retrieves a list of all BehaviourLogs in the given behaviour script.
	 * If a company is not given it will use the currently selected company.
	 * @expose
	 * @param {!number} scriptId
	 * @return {!Promise<SyncMindflayer>}
	 **/
	listBehaviourScriptLogs(scriptId: ulong, constraints?: JsonObject) {
		return this.command<RepBehaviourLogListByScript>(new PayBehaviourLogListByScript({
			...constraints,
			behaviourScript: { id: scriptId },
		}));
	}
	/**
	 * Deletes all the {@link trakit.fleetfreedom.BehaviourLog}s for the given behaviour script.
	 * @expose
	 * @param {!number} scriptId
	 * @return {!Promise<SyncMindflayer>}
	 **/
	clearBehaviourScriptLogs(scriptId: ulong, constraints?: JsonObject) {
		return this.command<RepBehaviourLogBatchDeleteByScript>(new PayBehaviourLogBatchDeleteByScript({
			...constraints,
			behaviourScript: { id: scriptId },
		}));
	}
	//#endregion Behaviours/Logs

	//#region Reports/Templates
	/**
	 * Retrieves a list of all Report Templates in the given company.
	 * If a company is not given it will use the currently selected company.
	 * @expose
	 * @param {number=} companyId
	 * @param {ParamListConstraintsById=} constraints
	 * @return {!Promise<SyncMindflayer>}
	 **/
	listReportTemplates(companyId: ulong, constraints?: JsonObject) {
		return this.command<RepReportTemplateListByCompany>(new PayReportTemplateListByCompany({
			...constraints,
			company: { id: companyId },
		}));
	}
	/**
	 * Retrieves a given template from the server by its {@link trakit.fleetfreedom.ReportTemplate#id}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getReportTemplate(id: ulong) {
		return this.command<RepReportTemplateGet>(new PayReportTemplateGet({
			reportTemplate: { id },
		}));
	}
	/**
	 * Merges a {@link trakit.fleetfreedom.ReportTemplate}.
	 * @expose
	 * @param {!trakit.json.ReportTemplate} json
	 * @return {!Promise<SyncMindflayer>}
	 **/
	mergeReportTemplate(json: JsonObject) {
		return this.command<RepReportTemplateMerge>(new PayReportTemplateMerge({
			reportTemplate: json,
		}));
	}
	/**
	 * Deletes a {@link trakit.fleetfreedom.ReportTemplate}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	removeReportTemplate(id: ulong) {
		return this.command<RepReportTemplateDelete>(new PayReportTemplateDelete({
			reportTemplate: { id },
		}));
	}
	/**
	 * Restores a deleted {@link trakit.fleetfreedom.ReportTemplate}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	restoreReportTemplate(id: ulong) {
		return this.command<RepReportTemplateDelete>(new PayReportTemplateRestore({
			reportTemplate: { id },
		}));
	}
	//#endregion Reports/Templates
	//#region Reports/Schedules
	/**
	 * Retrieves a list of all Report Schedules in the given company.
	 * If a company is not given it will use the currently selected company.
	 * @expose
	 * @param {number=} companyId
	 * @param {ParamListConstraintsById=} constraints
	 * @return {!Promise<SyncMindflayer>}
	 **/
	listReportSchedules(companyId: ulong, constraints?: JsonObject) {
		return this.command<RepReportScheduleListByCompany>(new PayReportScheduleListByCompany({
			...constraints,
			company: { id: companyId },
		}));
	}
	/**
	 * Retrieves a given schedule from the server by its {@link trakit.fleetfreedom.ReportSchedule#id}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getReportSchedule(id: ulong) {
		return this.command<RepReportScheduleGet>(new PayReportScheduleGet({
			reportSchedule: { id },
		}));
	}
	/**
	 * Merges a {@link trakit.fleetfreedom.ReportSchedule}.
	 * @expose
	 * @param {!trakit.json.ReportSchedule} json
	 * @return {!Promise<SyncMindflayer>}
	 **/
	mergeReportSchedule(json: JsonObject) {
		return this.command<RepReportScheduleMerge>(new PayReportScheduleMerge({
			reportSchedule: json,
		}));
	}
	/**
	 * Deletes a {@link trakit.fleetfreedom.ReportSchedule}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	removeReportSchedule(id: ulong) {
		return this.command<RepReportScheduleDelete>(new PayReportScheduleDelete({
			reportSchedule: { id },
		}));
	}
	/**
	 * Restores a deleted {@link trakit.fleetfreedom.ReportSchedule}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	restoreReportSchedule(id: ulong) {
		return this.command<RepReportScheduleDelete>(new PayReportScheduleRestore({
			reportSchedule: { id },
		}));
	}
	//#endregion Reports/Schedules
	//#region Reports/Results
	/**
	 * Retrieves a list of all Report Results in the given company.
	 * If a company is not given it will use the currently selected company.
	 * @expose
	 * @param {number=} companyId
	 * @param {ParamListConstraintsByDts=} constraints
	 * @return {!Promise<SyncMindflayer>}
	 **/
	listReportResults(companyId: ulong, constraints?: JsonObject) {
		return this.command<RepReportResultListByCompany>(new PayReportResultListByCompany({
			...constraints,
			company: { id: companyId },
		}));
	}
	/**
	 * Retrieves a given report from the server by its {@link trakit.fleetfreedom.ReportResult#id}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getReportResult(id: ulong) {
		return this.command<RepReportResultGet>(new PayReportResultGet({
			reportResult: { id },
		}));
	}
	/**
	 * Merges a {@link trakit.fleetfreedom.ReportResult}.
	 * @expose
	 * @param {!trakit.json.ReportResult} json
	 * @return {!Promise<SyncMindflayer>}
	 **/
	mergeReportResult(json: JsonObject) {
		return this.command<RepReportResultMerge>(new PayReportResultMerge({
			reportResult: json,
		}));
	}
	/**
	 * Deletes a {@link trakit.fleetfreedom.ReportResult}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	removeReportResult(id: ulong) {
		return this.command<RepReportResultDelete>(new PayReportResultDelete({
			reportResult: { id },
		}));
	}
	/**
	 * Restores a deleted {@link trakit.fleetfreedom.ReportResult}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	restoreReportResult(id: ulong) {
		return this.command<RepReportResultDelete>(new PayReportResultRestore({
			reportResult: { id },
		}));
	}
	//#endregion Reports/Results

	//#region Maintenance/Schedules
	/**
	 * Retrieves a list of all Maintenance Schedules in the given company.
	 * If a company is not given it will use the currently selected company.
	 * @expose
	 * @param {number=} companyId
	 * @param {ParamListConstraintsById=} constraints
	 * @return {!Promise<SyncMindflayer>}
	 **/
	listMaintenanceSchedules(companyId: ulong, constraints?: JsonObject) {
		return this.command<RepMaintenanceScheduleListByCompany>(new PayMaintenanceScheduleListByCompany({
			...constraints,
			company: { id: companyId },
		}));
	}
	/**
	 * Retrieves a given schedule from the server by its {@link trakit.fleetfreedom.MaintenanceSchedule#id}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getMaintenanceSchedule(id: ulong) {
		return this.command<RepMaintenanceScheduleGet>(new PayMaintenanceScheduleGet({
			maintenanceSchedule: { id },
		}));
	}
	/**
	 * Merges a {@link trakit.fleetfreedom.MaintenanceSchedule}.
	 * @expose
	 * @param {!trakit.json.MaintenanceSchedule} json
	 * @return {!Promise<SyncMindflayer>}
	 **/
	mergeMaintenanceSchedule(json: JsonObject) {
		return this.command<RepMaintenanceScheduleMerge>(new PayMaintenanceScheduleMerge({
			maintenanceSchedule: json,
		}));
	}
	/**
	 * Deletes a {@link trakit.fleetfreedom.MaintenanceSchedule}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	removeMaintenanceSchedule(id: ulong) {
		return this.command<RepMaintenanceScheduleDelete>(new PayMaintenanceScheduleDelete({
			maintenanceSchedule: { id },
		}));
	}
	/**
	 * Restores a deleted {@link trakit.fleetfreedom.MaintenanceSchedule}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	restoreMaintenanceSchedule(id: ulong) {
		return this.command<RepMaintenanceScheduleDelete>(new PayMaintenanceScheduleRestore({
			maintenanceSchedule: { id },
		}));
	}
	//#endregion Maintenance/Schedules
	//#region Maintenance/Jobs
	/**
	 * Retrieves a list of all Maintenance Jobs in the given company.
	 * If a company is not given it will use the currently selected company.
	 * @expose
	 * @param {number=} companyId
	 * @param {ParamListConstrainMaintenanceJob=} constraints
	 * @return {!Promise<SyncMindflayer>}
	 **/
	listMaintenanceJobs(companyId: ulong, constraints?: JsonObject) {
		return this.command<RepMaintenanceJobListByCompany>(new PayMaintenanceJobListByCompany({
			...constraints,
			company: { id: companyId },
		}));
	}
	/**
	 * Retrieves a given job from the server by its {@link trakit.fleetfreedom.MaintenanceJob#id}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getMaintenanceJob(id: ulong) {
		return this.command<RepMaintenanceJobGet>(new PayMaintenanceJobGet({
			maintenanceJob: { id },
		}));
	}
	/**
	 * Merges a {@link trakit.fleetfreedom.MaintenanceJob}.
	 * @expose
	 * @param {!trakit.json.MaintenanceJob} json
	 * @return {!Promise<SyncMindflayer>}
	 **/
	mergeMaintenanceJob(json: JsonObject) {
		return this.command<RepMaintenanceJobMerge>(new PayMaintenanceJobMerge({
			maintenanceJob: json,
		}));
	}
	/**
	 * Deletes a {@link trakit.fleetfreedom.MaintenanceJob}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	removeMaintenanceJob(id: ulong) {
		return this.command<RepMaintenanceJobDelete>(new PayMaintenanceJobDelete({
			maintenanceJob: { id },
		}));
	}
	/**
	 * Restores a deleted {@link trakit.fleetfreedom.MaintenanceJob}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	restoreMaintenanceJob(id: ulong) {
		return this.command<RepMaintenanceJobDelete>(new PayMaintenanceJobRestore({
			maintenanceJob: { id },
		}));
	}
	//#endregion Maintenance/Jobs
}