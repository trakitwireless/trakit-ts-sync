import { Payload, RepAssetAdvancedGet, RepAssetAdvancedListByCompany, RepAssetBatchMerge, RepAssetDelete, RepAssetDispatchMerge, RepAssetGeneralGet, RepAssetGeneralListByCompany, RepAssetGet, RepAssetListByCompany, RepAssetMerge, RepAssetMessageBatchMerge, RepAssetMessageDelete, RepAssetMessageGet, RepAssetMessageListByAsset, RepAssetMessageListByCompany, RepAssetMessageMerge, RepAssetSuspend, RepBehaviourBatchMerge, RepBehaviourDelete, RepBehaviourGet, RepBehaviourListByCompany, RepBehaviourLogBatchDeleteByAsset, RepBehaviourLogBatchDeleteByBehaviour, RepBehaviourLogBatchDeleteByScript, RepBehaviourLogListByAsset, RepBehaviourLogListByBehaviour, RepBehaviourLogListByScript, RepBehaviourMerge, RepBehaviourScriptDelete, RepBehaviourScriptGet, RepBehaviourScriptListByCompany, RepBehaviourScriptMerge, RepCompanyDelete, RepCompanyDirectoryGet, RepCompanyDirectoryListByCompany, RepCompanyGeneralGet, RepCompanyGeneralListByCompany, RepCompanyGet, RepCompanyMerge, RepCompanyPolicyGet, RepCompanyPolicyListByCompany, RepCompanyResellerDelete, RepCompanyResellerGet, RepCompanyResellerMerge, RepCompanyStyleGet, RepCompanyStyleListByCompany, RepContactBatchDelete, RepContactBatchMerge, RepContactDelete, RepContactGet, RepContactListByCompany, RepContactMerge, RepDashcamGet, RepDashcamListByCompany, RepDashcamLiveListByCompany, RepDispatchJobBatchMerge, RepDispatchJobDelete, RepDispatchJobGet, RepDispatchJobListByAsset, RepDispatchJobListByCompany, RepDispatchJobMerge, RepDispatchTaskBatchMerge, RepDispatchTaskDelete, RepDispatchTaskGet, RepDispatchTaskListByAsset, RepDispatchTaskListByCompany, RepDispatchTaskMerge, RepDocumentDelete, RepDocumentGet, RepDocumentListByCompany, RepDocumentMerge, RepFormResultBatchMerge, RepFormResultDelete, RepFormResultGet, RepFormResultListByCompany, RepFormResultMerge, RepFormTemplateDelete, RepFormTemplateGet, RepFormTemplateListByCompany, RepFormTemplateMerge, RepIconDelete, RepIconGet, RepIconListByCompany, RepIconMerge, Reply, RepMachineDelete, RepMachineGet, RepMachineListByCompany, RepMachineMerge, RepMaintenanceJobDelete, RepMaintenanceJobGet, RepMaintenanceJobListByCompany, RepMaintenanceJobMerge, RepMaintenanceScheduleDelete, RepMaintenanceScheduleGet, RepMaintenanceScheduleListByCompany, RepMaintenanceScheduleMerge, RepPictureDelete, RepPictureGet, RepPictureListByCompany, RepPictureMerge, RepPlaceDelete, RepPlaceGet, RepPlaceListByCompany, RepPlaceMerge, RepProviderAdvancedGet, RepProviderAdvancedListByCompany, RepProviderBatchDelete, RepProviderBatchMerge, RepProviderConfigBatchMerge, RepProviderConfigDelete, RepProviderConfigGet, RepProviderConfigListByCompany, RepProviderConfigMerge, RepProviderConfigurationBatchMerge, RepProviderConfigurationDelete, RepProviderConfigurationGet, RepProviderConfigurationListByCompany, RepProviderConfigurationMerge, RepProviderControlGet, RepProviderControlListByCompany, RepProviderDelete, RepProviderGeneralGet, RepProviderGeneralListByCompany, RepProviderGet, RepProviderListByCompany, RepProviderMerge, RepProviderRegistrationDelete, RepProviderRegistrationGet, RepProviderRegistrationListByCompany, RepProviderRegistrationMerge, RepProviderScriptDelete, RepProviderScriptGet, RepProviderScriptListByCompany, RepProviderScriptMerge, RepReportResultDelete, RepReportResultGet, RepReportResultListByCompany, RepReportResultMerge, RepReportScheduleDelete, RepReportScheduleGet, RepReportScheduleListByCompany, RepReportScheduleMerge, RepReportTemplateDelete, RepReportTemplateGet, RepReportTemplateListByCompany, RepReportTemplateMerge, RepSelfGet, RepSelfLogout, RepSelfPassword, RepSessionDelete, RepSessionListByCompany, RepSessionListByUser, RepUserAdvancedGet, RepUserAdvancedListByCompany, RepUserDelete, RepUserGeneralGet, RepUserGeneralListByCompany, RepUserGet, RepUserGroupDelete, RepUserGroupGet, RepUserGroupListByCompany, RepUserGroupMerge, RepUserListByCompany, RepUserMerge } from '@trakit/commands';
import { codified, email, expression, guid, int, IRequestable, JsonObject, nothing, SyncName, SystemsOfUnits, Timezone, ulong, url, UserNotifications } from '@trakit/objects';
import { TrakitEvent, TrakitEventHandler } from './Events';
import { TrakitBaseCommander } from './TrakitBaseCommander';
/**
 * Base class to retrieve, modify, and delete Trak-iT objects via the APIs.
 */
export declare abstract class TrakitObjectCommander<TRequest> extends TrakitBaseCommander<TRequest> {
    /**
     * A map of event types to their registered handlers.
     */
    protected _handlers: Map<string, TrakitEventHandler[]>;
    /**
     * Gets invoked any time the service's account information is updated while the connection is open.
     * @param account The new account, and if not given will take the existing account object and re-create it.
     */
    protected _handleAccount(account?: RepSelfGet | nothing): void;
    /**
     * Gets invoked any time all the objects for a given kind in the given company are updated.
     */
    protected _handleList(kind: SyncName, companyId: ulong, objects: IRequestable[]): void;
    /**
     * Gets invoked any time an object for a given kind in the given company is created or updated.
     */
    protected _handleUpdate(kind: SyncName, companyId: ulong, object: IRequestable): void;
    /**
     * Gets invoked any time an object for a given kind in the given company is deleted.
     */
    protected _handleDelete(kind: SyncName, companyId: ulong, key: ulong | guid | email | codified | string): void;
    /**
     * Adds an event handler for a specific event type.
     * @param type		The type of event to listen for.
     * @param handler	The function to call when the event occurs.
     * @returns			True if the handler was added, false if it was already registered.
     */
    on(type: string, handler: TrakitEventHandler): boolean;
    /**
     * Removes an event handler for a specific event type.
     * If no handler is provided, all handlers for the event type will be removed.
     * @param type		The type of event to stop listening for.
     * @param handler	The function to remove from the event listeners.
     * @returns			True if the handler(s) got removed, otherwise false.
     */
    off(type: string, handler?: TrakitEventHandler | nothing): boolean;
    /**
     * Raises an event of a specific type, invoking all registered handlers with the provided event data.
     * @param type		The name of the event to raise.
     * @param create	A function that creates the event object.  This function is invoked just once and only if there are handlers registered for the event type.
     */
    protected fire(type: string, create: () => TrakitEvent): void;
    /**
     * Checks if a specific event handler is registered for a given event type.
     * @param type		The type of event to check.
     * @param handler	The function to check for.
     * @returns			True if the handler is registered, otherwise false.
     */
    handles(type: string, handler: TrakitEventHandler): boolean;
    dispose(): void;
    /**
     * Overridden to handle storage and events.
     * @inheritdoc
     */
    command<TReply extends Reply>(payload: Payload): Promise<TReply>;
    /**
     * Requests the details of the {@link User} or {@link Machine} currently identified.
     * @returns The account details or null.
     */
    selfDetails(): Promise<RepSelfGet>;
    /**
     * Sends a login command, and if successful, saves the {@link RepSelfGet.ghostId|session id} for all further requests.
     * @param username	Your email address.
     * @param password	Your password.
     * @param userAgent	Optional string to identify the client software.
     * @returns The response, which contains a SelfUser when successful.
     */
    login(username: string, password: string, userAgent?: string | nothing): Promise<RepSelfGet>;
    /**
     * Sends a logout command and removes the current {@link RepSelfGet|session information} whether successful or not.
     * @returns The logout response.
     */
    logout(): Promise<RepSelfLogout>;
    /**
     * Allows a {@link User} to update their own {@link Contact}.
     * If your {@link User} has no associated {@link Contact}, you will receive a {@link ErrorCode.contactNotFound} error.
     * @param name			Name for yourself.
     * @param notes			Notes for yourself.
     * @param otherNames	A collection of other names this person might go by.
     * @param emails		A collection of email addresses for yourself.
     * @param phones		A collection of phone numbers for yourself.
     * @param addresses		A collection of addresses for yourself.
     * @param urls			A collection of URLs for yourself.
     * @param dates			A collection of dates for yourself.
     * @param options		Saved JSON data used by client applications.
     * @param roles			A list of roles you play in your {@link Company}.
     * @param pictures		A list of {@link Picture.id}s to associate with your {@link Contact}.
     * @returns The reply from the update contact command.
     */
    updateContact(name?: string, notes?: string, otherNames?: Map<string, string | null>, emails?: Map<string, string | null>, phones?: Map<string, ulong | null>, addresses?: Map<string, string | null>, urls?: Map<string, url | null>, dates?: Map<string, Date | null>, options?: Map<string, string | null>, roles?: string[], pictures?: ulong[]): Promise<Reply>;
    /**
     * Allows a session {@link User} to change their own password.
     * @param oldPassword	Your current password, as verification that you are the account owner.
     * @param newPassword	Your new password must conform to your company's PasswordPolicy.
     * @returns The password change response.
     */
    updatePassword(oldPassword: string, newPassword: string): Promise<RepSelfPassword>;
    /**
     * Allows a {@link User} to change their own preferences.
     * @param language		Your language code, e.g., "en-US".
     * @param timezone		Your {@link Timezone.code}.
     * @param notify		Notification preferences.
     * @param formats		Format templates for dates, times, etc...
     * @param measurements	Measurement system preferences.
     * @returns				The reply from the update preferences command.
     */
    updatePreferences(language?: codified, timezone?: Timezone | string, notify?: UserNotifications[] | JsonObject[], formats?: Map<string, string> | JsonObject, measurements?: Map<string, SystemsOfUnits> | JsonObject): Promise<Reply>;
    /**
     * Allows a {@link User} to change their own state flags.
     * @param options	Saved JSON data used by client applications.
     * @returns			The reply from the update state command.
     */
    updateState(options?: Map<string, string> | JsonObject): Promise<Reply>;
    /**
     * Retrieves a given {@link Company} from the server by its {@link Company.id}.
     * @param id
     * @returns
     */
    getCompany(id: ulong): Promise<RepCompanyGet>;
    /**
     * Creates a new, or updates an existing {@link Company}.
     * @param json
     * @returns
     */
    mergeCompany(json: JsonObject): Promise<RepCompanyMerge>;
    /**
     * Deletes a {@link Company}.
     * @param id
     * @returns
     */
    removeCompany(id: ulong): Promise<RepCompanyDelete>;
    /**
     * Restores a deleted {@link Company}.
     * @param id
     * @returns
     */
    restoreCompany(id: ulong): Promise<RepCompanyDelete>;
    /**
     * Retrieves a list of all {@link CompanyGeneral}s in the tree for the given company.
     * @param id
     * @param constraints
     * @returns
     */
    listCompanyGenerals(id: ulong, constraints?: JsonObject): Promise<RepCompanyGeneralListByCompany>;
    /**
     * Retrieves a given {@link CompanyGeneral} from the server by its {@link Company.id}.
     * @param id
     * @returns
     */
    getCompanyGeneral(id: ulong): Promise<RepCompanyGeneralGet>;
    /**
     * Retrieves a list of all {@link CompanyPolicy}s in the tree for the given company.
     * @param id
     * @param constraints
     * @returns
     */
    listCompanyPolicies(id: ulong, constraints?: JsonObject): Promise<RepCompanyPolicyListByCompany>;
    /**
     * Retrieves a given {@link CompanyPolicy} from the server by its {@link Company.id}.
     * @param id
     * @returns
     */
    getCompanyPolicy(id: ulong): Promise<RepCompanyPolicyGet>;
    /**
     * Retrieves a list of all {@link CompanyStyle}s in the tree for the given company.
     * @param id
     * @param constraints
     * @returns
     */
    listCompanyStyles(id: ulong, constraints?: JsonObject): Promise<RepCompanyStyleListByCompany>;
    /**
     * Retrieves a given {@link CompanyStyle} from the server by its {@link Company.id}.
     * @param id
     * @returns
     */
    getCompanyStyle(id: ulong): Promise<RepCompanyStyleGet>;
    /**
     * Retrieves a list of all {@link CompanyDirectory}s in the tree for the given company.
     * @param id
     * @param constraints
     * @returns
     */
    listCompanyDirectories(id: ulong, constraints?: JsonObject): Promise<RepCompanyDirectoryListByCompany>;
    /**
     * Retrieves a given {@link CompanyDirectory} from the server by its {@link Company.id}.
     * @param id
     * @returns
     */
    getCompanyDirectory(id: ulong): Promise<RepCompanyDirectoryGet>;
    /**
     * Retrieves a given {@link CompanyReseller} from the server by its {@link CompanyReseller.id}.
     * @param id
     * @returns
     */
    getReseller(id: ulong): Promise<RepCompanyResellerGet>;
    /**
     * Creates a new, or updates an existing {@link CompanyReseller}.
     * @param json
     * @returns
     */
    mergeReseller(json: JsonObject): Promise<RepCompanyResellerMerge>;
    /**
     * Deletes a {@link CompanyReseller}.
     * @param id
     * @returns
     */
    removeReseller(id: ulong): Promise<RepCompanyResellerDelete>;
    /**
     * Restores a deleted {@link CompanyReseller}.
     * @param id
     * @returns
     */
    restoreReseller(id: ulong): Promise<RepCompanyResellerDelete>;
    /**
     * Retrieves a list of all {@link Contact}s in the given company.
     * @param companyId
     * @param constraints
     * @returns
     */
    listContacts(companyId: ulong, constraints?: JsonObject): Promise<RepContactListByCompany>;
    /**
     * Retrieves a given contact from the server by its {@link Contact.id}.
     * @param id
     * @returns
     */
    getContact(id: ulong): Promise<RepContactGet>;
    /**
     * Creates a new, or updates an existing {@link Contact}.
     * @param json
     * @returns
     */
    mergeContact(json: JsonObject): Promise<RepContactMerge>;
    /**
     * Deletes a {@link Contact}.
     * @param id
     * @returns
     */
    removeContact(id: ulong): Promise<RepContactDelete>;
    /**
     * Restores a deleted {@link Contact}.
     * @param id
     * @returns
     */
    restoreContact(id: ulong): Promise<RepContactDelete>;
    /**
     * Merges a batch of {@link Contact}s.
     * @param array
     * @returns
     */
    multiMergeContact(array: JsonObject[]): Promise<RepContactBatchMerge>;
    /**
     * Merges a batch of {@link Contact}s.
     * @param array
     * @returns
     */
    multiRemoveContact(ids: ulong[]): Promise<RepContactBatchDelete>;
    /**
     * Retrieves a list of all {@link User}s in the given company.
     * @param companyId
     * @param constraints
     * @returns
     */
    listUsers(companyId: ulong, constraints?: JsonObject): Promise<RepUserListByCompany>;
    /**
     * Retrieves a given user from the server by its {@link User.id}.
     * @param login
     * @returns
     */
    getUser(login: email): Promise<RepUserGet>;
    /**
     * Creates a new, or updates an existing {@link User}.
     * @param json
     * @returns
     */
    mergeUser(json: JsonObject): Promise<RepUserMerge>;
    /**
     * Deletes an {@link User}.
     * @param login
     * @returns
     */
    removeUser(login: email): Promise<RepUserDelete>;
    /**
     * Restores a deleted {@link User}.
     * @param login
     * @returns
     */
    restoreUser(login: email): Promise<RepUserDelete>;
    /**
     * Retrieves a list of all {@link UserGeneral}s in the given company.
     * @param companyId
     * @param constraints
     * @returns
     */
    listUserGenerals(companyId: ulong, constraints?: JsonObject): Promise<RepUserGeneralListByCompany>;
    /**
     * Retrieves a given {@link UserGeneral} from the server by its {@link User.id}.
     * @param login
     * @returns
     */
    getUserGeneral(login: email): Promise<RepUserGeneralGet>;
    /**
     * Retrieves a list of all {@link UserAdvanced}s in the given company.
     * @param companyId
     * @param constraints
     * @returns
     */
    listUserAdvanceds(companyId: ulong, constraints?: JsonObject): Promise<RepUserAdvancedListByCompany>;
    /**
     * Retrieves a given {@link UserAdvanced} from the server by its {@link User.id}.
     * @param login
     * @returns
     */
    getUserAdvanced(login: email): Promise<RepUserAdvancedGet>;
    /**
     * Retrieves a list of all {@link UserGroup}s in the given company.
     * @param companyId
     * @param constraints
     * @returns
     */
    listUserGroups(companyId: ulong, constraints?: JsonObject): Promise<RepUserGroupListByCompany>;
    /**
     * Retrieves a given {@link UserGroup} from the server by its {@link UserGroup.id}.
     * @param id
     * @returns
     */
    getUserGroup(id: ulong): Promise<RepUserGroupGet>;
    /**
     * Creates a new, or updates an existing {@link UserGroup}.
     * @param json
     * @returns
     */
    mergeUserGroup(json: JsonObject): Promise<RepUserGroupMerge>;
    /**
     * Deletes a {@link UserGroup}.
     * @param id
     * @returns
     */
    removeUserGroup(id: ulong): Promise<RepUserGroupDelete>;
    /**
     * Restores a deleted {@link UserGroup}.
     * @param id
     * @returns
     */
    restoreUserGroup(id: ulong): Promise<RepUserGroupDelete>;
    /**
     * Retrieves a list of all {@link Machine}s in the given company.
     * @param companyId
     * @param constraints
     * @returns
     */
    listMachines(companyId: ulong, constraints?: JsonObject): Promise<RepMachineListByCompany>;
    /**
     * Retrieves a given {@link Machine} from the server by its {@link Machine.key}.
     * @param key
     * @returns
     */
    getMachine(key: string): Promise<RepMachineGet>;
    /**
     * Creates a new, or updates an existing {@link Machine}.
     * @param json
     * @returns
     */
    mergeMachine(json: JsonObject): Promise<RepMachineMerge>;
    /**
     * Deletes an {@link Machine}.
     * @param key
     * @returns
     */
    removeMachine(key: string): Promise<RepMachineDelete>;
    /**
     * Restores a deleted {@link Machine}.
     * @param key
     * @returns
     */
    restoreMachine(key: string): Promise<RepMachineDelete>;
    /**
     * Retrieves a list of all {@link Session}s in the given {@link Company}.
     * @param companyId
     * @returns
     */
    listSessions(companyId: ulong, constraints?: JsonObject): Promise<RepSessionListByCompany>;
    /**
     * Retrieves a list of all {@link Session}s for the given {@link User}.
     * @param login
     * @returns
     */
    listSessionsByUser(login: email, constraints?: JsonObject): Promise<RepSessionListByUser>;
    /**
     * Kills a {@link Session}.
     * @param handle
     * @returns
     */
    killSession(handle: string): Promise<RepSessionDelete>;
    /**
     * Retrieves a list of all {@link Icon}s in the trunk for the given {@link Company}.
     * @param companyId
     * @param constraints
     * @returns
     */
    listIcons(companyId: ulong, constraints?: JsonObject): Promise<RepIconListByCompany>;
    /**
     * Retrieves a given {@link Icon} from the server by its {@link Icon.id}.
     * @param id
     * @returns
     */
    getIcon(id: ulong): Promise<RepIconGet>;
    /**
     * Creates a new, or updates an existing {@link Icon}.
     * @param json
     * @returns
     */
    mergeIcon(json: JsonObject): Promise<RepIconMerge>;
    /**
     * Deletes a {@link Icon}.
     * @param id
     * @returns
     */
    removeIcon(id: ulong): Promise<RepIconDelete>;
    /**
     * Restores a deleted {@link Icon}.
     * @param id
     * @returns
     */
    restoreIcon(id: ulong): Promise<RepIconDelete>;
    /**
     * Retrieves a list of all {@link Picture}s in the trunk for the given {@link Company}.
     * @param companyId
     * @param constraints
     * @returns
     */
    listPictures(companyId: ulong, constraints?: JsonObject): Promise<RepPictureListByCompany>;
    /**
     * Retrieves a given {@link Picture} from the server by its {@link Picture.id}.
     * @param id
     * @returns
     */
    getPicture(id: ulong): Promise<RepPictureGet>;
    /**
     * Creates a new, or updates an existing {@link Picture}.
     * @param json
     * @returns
     */
    mergePicture(json: JsonObject): Promise<RepPictureMerge>;
    /**
     * Deletes a {@link Picture}.
     * @param id
     * @returns
     */
    removePicture(id: ulong): Promise<RepPictureDelete>;
    /**
     * Restores a deleted {@link Picture}.
     * @param id
     * @returns
     */
    restorePicture(id: ulong): Promise<RepPictureDelete>;
    /**
     * Retrieves a list of all {@link Document}s in the given {@link Company}.
     * @param companyId
     * @param constraints
     * @returns
     */
    listDocuments(companyId: ulong, constraints?: JsonObject): Promise<RepDocumentListByCompany>;
    /**
     * Retrieves a given {@link Document} from the server by its {@link Document.id}.
     * @param id
     * @returns
     */
    getDocument(id: ulong): Promise<RepDocumentGet>;
    /**
     * Creates a new, or updates an existing {@link Document}.
     * @param json
     * @returns
     */
    mergeDocument(json: JsonObject): Promise<RepDocumentMerge>;
    /**
     * Deletes a {@link Document}.
     * @param id
     * @returns
     */
    removeDocument(id: ulong): Promise<RepDocumentDelete>;
    /**
     * Restores a deleted {@link Document}.
     * @param id
     * @returns
     */
    restoreDocument(id: ulong): Promise<RepDocumentDelete>;
    /**
     * Retrieves a list of all {@link FormTemplate}s in the given {@link Company}.
     * @param companyId
     * @param constraints
     * @returns
     */
    listFormTemplates(companyId: ulong, constraints?: JsonObject): Promise<RepFormTemplateListByCompany>;
    /**
     * Retrieves a given {@link FormTemplate} from the server by its {@link FormTemplate.id}.
     * @param id
     * @returns
     */
    getFormTemplate(id: ulong): Promise<RepFormTemplateGet>;
    /**
     * Creates a new, or updates an existing {@link FormTemplate}.
     * @param json
     * @returns
     */
    mergeFormTemplate(json: JsonObject): Promise<RepFormTemplateMerge>;
    /**
     * Deletes a {@link FormTemplate}.
     * @param id
     * @returns
     */
    removeFormTemplate(id: ulong): Promise<RepFormTemplateDelete>;
    /**
     * Restores a deleted {@link FormTemplate}.
     * @param id
     * @returns
     */
    restoreFormTemplate(id: ulong): Promise<RepFormTemplateDelete>;
    /**
     * Retrieves a list of all {@link FormResult}s in the given {@link Company}.
     * @param companyId
     * @param constraints
     * @returns
     */
    listFormResults(companyId: ulong, constraints?: JsonObject): Promise<RepFormResultListByCompany>;
    /**
     * Retrieves a given {@link FormResult} from the server by its {@link FormResult.id}.
     * @param id
     * @returns
     */
    getFormResult(id: ulong): Promise<RepFormResultGet>;
    /**
     * Creates a new, or updates an existing {@link FormResult}.
     * @param json
     * @returns
     */
    mergeFormResult(json: JsonObject): Promise<RepFormResultMerge>;
    /**
     * Merges a batch of {@link FormResult}s.
     * @param array
     * @returns
     */
    multiMergeFormResult(id: ulong): Promise<RepFormResultBatchMerge>;
    /**
     * Deletes a {@link FormResult}.
     * @param id
     * @returns
     */
    removeFormResult(id: ulong): Promise<RepFormResultDelete>;
    /**
     * Restores a deleted {@link FormResult}.
     * @param id
     * @returns
     */
    restoreFormResult(id: ulong): Promise<RepFormResultDelete>;
    /**
     * Retrieves a list of all {@link Dashcam} in the given {@link Company}.
     * @param companyId
     * @param constraints
     * @returns
     */
    listDashcamDatas(companyId: ulong, constraints?: JsonObject): Promise<RepDashcamListByCompany>;
    /**
     * Retrieves a given {@link Dashcam} from the server by its {@link Dashcam.guid}.
     * @param guid
     * @returns
     */
    getDashcamData(guid: guid): Promise<RepDashcamGet>;
    /**
     * Retrieves a list of all {@link DashcamLive|live dashcam images} in the given {@link Company}.
     * @param companyId
     * @returns
     */
    listDashcamLives(companyId: ulong, constraints?: JsonObject): Promise<RepDashcamLiveListByCompany>;
    /**
     * Retrieves a list of all {@link Asset}s in the given {@link Company}.
     * @param companyId
     * @param constraints
     * @returns
     */
    listAssets(companyId: ulong, constraints?: JsonObject): Promise<RepAssetListByCompany>;
    /**
     * Retrieves a given {@link Asset} from the server by its {@link Asset.id}.
     * @param id
     * @returns
     */
    getAsset(id: ulong): Promise<RepAssetGet>;
    /**
     * Creates a new, or updates an existing {@link Asset}.
     * @param json
     * @returns
     */
    mergeAsset(json: JsonObject): Promise<RepAssetMerge>;
    /**
     * Merges a batch of {@link Asset}s.
     * @param array
     * @returns
     */
    multiMergeAsset(array: JsonObject[]): Promise<RepAssetBatchMerge>;
    /**
     * Deletes an {@link Asset}.
     * @param id
     * @returns
     */
    removeAsset(id: ulong): Promise<RepAssetDelete>;
    /**
     * Restores a deleted {@link Asset}.
     * @param id
     * @returns
     */
    restoreAsset(id: ulong): Promise<RepAssetDelete>;
    /**
     * Suspends an {@link Asset}.
     * @param id
     * @returns
     */
    suspendAsset(id: ulong): Promise<RepAssetSuspend>;
    /**
     * Reactivates an {@link Asset}.
     * @param id
     * @returns
     */
    reviveAsset(id: ulong): Promise<RepAssetSuspend>;
    /**
     * Searches all available companies for {@link Asset}s that match the given expression.
     * @param expression
     * @param constraints
     * @returns
     */
    searchAssets(expression: expression, constraints?: JsonObject): void;
    /**
     * Retrieves a list of all {@link AssetGeneral}s in the given {@link Company}.
     * @param companyId
     * @param constraints
     * @returns
     */
    listAssetGenerals(companyId: ulong, constraints?: JsonObject): Promise<RepAssetGeneralListByCompany>;
    /**
     * Retrieves a given {@link AssetGeneral} from the server by its {@link Asset.id}.
     * @param id
     * @returns
     */
    getAssetGeneral(id: ulong): Promise<RepAssetGeneralGet>;
    /**
     * Searches all available companies for {@link AssetGeneral}s that match the given expression.
     * @param expression
     * @param constraints
     * @returns
     */
    searchAssetGenerals(expression: expression, constraints?: JsonObject): void;
    /**
     * Retrieves a list of all {@link AssetAdvanced}s in the given {@link Company}.
     * @param companyId
     * @param constraints
     * @returns
     */
    listAssetAdvanceds(companyId: ulong, constraints?: JsonObject): Promise<RepAssetAdvancedListByCompany>;
    /**
     * Retrieves a given {@link AssetAdvanced} from the server by its {@link Asset.id}.
     * @param id
     * @returns
     */
    getAssetAdvanced(id: ulong): Promise<RepAssetAdvancedGet>;
    /**
     * Searches all available companies for {@link AssetAdvanced}s that match the given expression.
     * @param expression
     * @param constraints
     * @returns
     */
    searchAssetAdvanceds(expression: expression, constraints?: JsonObject): void;
    /**
     * Updates the given {@link Asset}'s {@link DispatchJob}s and optimizes the steps based on back-end logic.
     * @param id
     * @returns
     */
    mergeAssetDispatch(json: JsonObject): Promise<RepAssetDispatchMerge>;
    /**
     * Retrieves a list of all {@link DispatchTask}s in the given {@link Company}.
     * @param companyId
     * @param constraints
     * @returns
     */
    listDispatchTasks(companyId: ulong, constraints?: JsonObject): Promise<RepDispatchTaskListByCompany>;
    /**
     * Retrieves a list of all {@link DispatchTask}s for the given {@link Asset}.
     * @param assetId
     * @returns
     */
    getDispatchTasksByAsset(assetId: ulong, constraints?: JsonObject): Promise<RepDispatchTaskListByAsset>;
    /**
     * Retrieves a given {@link DispatchTask} from the server by its {@link DispatchTask.id}.
     * @param id
     * @returns
     */
    getDispatchTask(id: ulong): Promise<RepDispatchTaskGet>;
    /**
     * Creates a new, or updates an existing {@link DispatchTask}.
     * @param json
     * @returns
     */
    mergeDispatchTask(json: JsonObject): Promise<RepDispatchTaskMerge>;
    /**
     * Merges a batch of {@link DispatchTask}s.
     * @param array
     * @returns
     */
    multiMergeDispatchTask(id: ulong): Promise<RepDispatchTaskBatchMerge>;
    /**
     * Deletes a {@link DispatchTask}.
     * @param id
     * @returns
     */
    removeDispatchTask(id: ulong): Promise<RepDispatchTaskDelete>;
    /**
     * Restores a deleted {@link DispatchTask}.
     * @param id
     * @returns
     */
    restoreDispatchTask(id: ulong): Promise<RepDispatchTaskDelete>;
    /**
     * Retrieves a list of all {@link DispatchJob}s in the given {@link Company}.
     * @param companyId
     * @param constraints
     * @returns
     */
    listDispatchJobs(companyId: ulong, constraints?: JsonObject): Promise<RepDispatchJobListByCompany>;
    /**
     * Retrieves a list of all {@link DispatchJob}s for the given {@link Asset}.
     * @param assetId
     * @returns
     */
    getDispatchJobsByAsset(assetId: ulong, constraints?: JsonObject): Promise<RepDispatchJobListByAsset>;
    /**
     * Retrieves a given {@link DispatchJob} from the server by its {@link DispatchJob.id}.
     * @param id
     * @returns
     */
    getDispatchJob(id: ulong): Promise<RepDispatchJobGet>;
    /**
     * Creates a new, or updates an existing {@link DispatchJob}.
     * @param json
     * @returns
     */
    mergeDispatchJob(json: JsonObject): Promise<RepDispatchJobMerge>;
    /**
     * Merges a batch of {@link DispatchJob}s.
     * @param array
     * @returns
     */
    multiMergeDispatchJob(id: ulong): Promise<RepDispatchJobBatchMerge>;
    /**
     * Deletes a {@link DispatchJob}.
     * @param id
     * @returns
     */
    removeDispatchJob(id: ulong): Promise<RepDispatchJobDelete>;
    /**
     * Restores a deleted {@link DispatchJob}.
     * @param id
     * @returns
     */
    restoreDispatchJob(id: ulong): Promise<RepDispatchJobDelete>;
    /**
     * Completes or progresses a {@link DispatchJob} (from the perspective of a driver, but by a dispatcher).
     * @param json
     * @returns
     */
    changeDispatchJob(json: JsonObject): Promise<RepDispatchJobMerge>;
    /**
     * Cancels a {@link DispatchJob} and removes it from the dispatcher's and driver's view.
     * @param json
     * @returns
     */
    cancelDispatchJob(json: JsonObject): Promise<RepDispatchJobMerge>;
    /**
     * Retrieves a list of all {@link AssetMessage}s in the given {@link Company}.
     * @param companyId
     * @param constraints
     * @returns
     */
    listAssetMessages(companyId: ulong, constraints?: JsonObject): Promise<RepAssetMessageListByCompany>;
    /**
     * Retrieves a list of all {@link AssetMessage}s for the given {@link Asset}.
     * @param assetId
     * @returns
     */
    getAssetMessagesByAsset(assetId: ulong, constraints?: JsonObject): Promise<RepAssetMessageListByAsset>;
    /**
     * Retrieves a given {@link AssetMessage} from the server by its {@link Message.id}.
     * @param id
     * @returns
     */
    getAssetMessage(id: ulong): Promise<RepAssetMessageGet>;
    /**
     * Creates a new, or updates an existing {@link AssetMessage}.
     * @param json
     * @returns
     */
    mergeAssetMessage(json: JsonObject): Promise<RepAssetMessageMerge>;
    /**
     * Merges a batch of {@link AssetMessage}s.
     * @param array
     * @returns
     */
    multiMergeAssetMessage(id: ulong): Promise<RepAssetMessageBatchMerge>;
    /**
     * Deletes a {@link AssetMessage}.
     * @param id
     * @returns
     */
    removeAssetMessage(id: ulong): Promise<RepAssetMessageDelete>;
    /**
     * Restores a deleted {@link AssetMessage}.
     * @param id
     * @returns
     */
    restoreAssetMessage(id: ulong): Promise<RepAssetMessageDelete>;
    /**
     * Retrieves a list of all {@link Place}s in the given {@link Company}.
     * @param companyId
     * @param constraints
     * @returns
     */
    listPlaces(companyId: ulong, constraints?: JsonObject): Promise<RepPlaceListByCompany>;
    /**
     * Retrieves a given {@link Place} from the server by its {@link Place.id}.
     * @param id
     * @returns
     */
    getPlace(id: ulong): Promise<RepPlaceGet>;
    /**
     * Creates a new, or updates an existing {@link Place}.
     * @param json
     * @returns
     */
    mergePlace(json: JsonObject): Promise<RepPlaceMerge>;
    /**
     * Deletes a {@link Place}.
     * @param id
     * @returns
     */
    removePlace(id: ulong): Promise<RepPlaceDelete>;
    /**
     * Restores a deleted {@link Place}.
     * @param id
     * @returns
     */
    restorePlace(id: ulong): Promise<RepPlaceDelete>;
    /**
     * Retrieves a list of all {@link Provider}s in the given {@link Company}.
     * @param companyId
     * @param constraints
     * @returns
     */
    listProviders(companyId: ulong, constraints?: JsonObject): Promise<RepProviderListByCompany>;
    /**
     * Retrieves a given {@link Provider} from the server by its {@link Provider.id}.
     * @param id
     * @returns
     */
    getProvider(id: string): Promise<RepProviderGet>;
    /**
     * Creates a new, or updates an existing {@link Provider}.
     * @param json
     * @returns
     */
    mergeProvider(json: JsonObject): Promise<RepProviderMerge>;
    /**
     * Merges a batch of {@link Provider}s.
     * @param array
     * @returns
     */
    multiMergeProvider(array: JsonObject[]): Promise<RepProviderBatchMerge>;
    /**
     * Deletes a batch of {@link Provider}s.
     * @param ids
     * @returns
     */
    multiRemoveProvider(ids: string[]): Promise<RepProviderBatchDelete>;
    /**
     * Deletes an {@link Provider}.
     * @param id
     * @returns
     */
    removeProvider(id: string): Promise<RepProviderDelete>;
    /**
     * Restores a deleted {@link Provider}.
     * @param id
     * @returns
     */
    restoreProvider(id: string): Promise<RepProviderDelete>;
    /**
     * Searches all available companies for {@link Provider}s that match the given expression.
     * @param expression
     * @param constraints
     * @returns
     */
    searchProviders(expression: expression, constraints?: JsonObject): void;
    /**
     * Retrieves a list of all {@link ProviderGeneral}s in the given {@link Company}.
     * @param companyId
     * @param constraints
     * @returns
     */
    listProviderGenerals(companyId: ulong, constraints?: JsonObject): Promise<RepProviderGeneralListByCompany>;
    /**
     * Retrieves a given {@link ProviderGeneral} from the server by its {@link Provider.id}.
     * @param id
     * @returns
     */
    getProviderGeneral(id: string): Promise<RepProviderGeneralGet>;
    /**
     * Searches all available companies for {@link ProviderGeneral}s that match the given expression.
     * @param expression
     * @param constraints
     * @returns
     */
    searchProviderGenerals(expression: expression, constraints?: JsonObject): void;
    /**
     * Retrieves a list of all {@link ProviderAdvanced}s in the given {@link Company}.
     * @param companyId
     * @param constraints
     * @returns
     */
    listProviderAdvanceds(companyId: ulong, constraints?: JsonObject): Promise<RepProviderAdvancedListByCompany>;
    /**
     * Retrieves a given {@link ProviderAdvanced} from the server by its {@link Provider.id}.
     * @param id
     * @returns
     */
    getProviderAdvanced(id: string): Promise<RepProviderAdvancedGet>;
    /**
     * Searches all available companies for {@link ProviderAdvanced}s that match the given expression.
     * @param expression
     * @param constraints
     * @returns
     */
    searchProviderAdvanceds(expression: expression, constraints?: JsonObject): void;
    /**
     * Retrieves a list of all {@link ProviderControl}s in the given {@link Company}.
     * @param companyId
     * @param constraints
     * @returns
     */
    listProviderControls(companyId: ulong, constraints?: JsonObject): Promise<RepProviderControlListByCompany>;
    /**
     * Retrieves a given {@link ProviderControl} from the server by its {@link Provider.id}.
     * @param id
     * @returns
     */
    getProviderControl(id: string): Promise<RepProviderControlGet>;
    /**
     * Searches all available companies for {@link ProviderControl}s that match the given expression.
     * @param expression
     * @param constraints
     * @returns
     */
    searchProviderControls(expression: expression, constraints?: JsonObject): void;
    /**
     * Retrieves a list of all {@link ProviderScript}s in the trunk for the given {@link Company}.
     * @param companyId
     * @param constraints
     * @returns
     */
    listProviderScripts(companyId: ulong, constraints?: JsonObject): Promise<RepProviderScriptListByCompany>;
    /**
     * Retrieves a given {@link ProviderScript} from the server by its {@link ProviderScript.id}.
     * @param id
     * @returns
     */
    getProviderScript(id: ulong): Promise<RepProviderScriptGet>;
    /**
     * Creates a new, or updates an existing {@link ProviderScript}.
     * @param json
     * @returns
     */
    mergeProviderScript(json: JsonObject): Promise<RepProviderScriptMerge>;
    /**
     * Deletes a {@link ProviderScript}.
     * @param id
     * @returns
     */
    removeProviderScript(id: ulong): Promise<RepProviderScriptDelete>;
    /**
     * Restores a deleted {@link ProviderScript}.
     * @param id
     * @returns
     */
    restoreProviderScript(id: ulong): Promise<RepProviderScriptDelete>;
    /**
     * Retrieves a list of all {@link ProviderConfig}s in the given {@link Company}.
     * @param companyId
     * @param constraints
     * @returns
     */
    listProviderConfigs(companyId: ulong, constraints?: JsonObject): Promise<RepProviderConfigListByCompany>;
    /**
     * Retrieves a given {@link ProviderConfig} from the server by its {@link ProviderConfig.id}.
     * @param id
     * @returns
     */
    getProviderConfig(id: ulong): Promise<RepProviderConfigGet>;
    /**
     * Creates a new, or updates an existing {@link ProviderConfig}.
     * @param json
     * @returns
     */
    mergeProviderConfig(json: JsonObject): Promise<RepProviderConfigMerge>;
    /**
     * Merges a batch of {@link ProviderConfig}s.
     * @param array
     * @returns
     */
    multiMergeProviderConfig(id: ulong): Promise<RepProviderConfigBatchMerge>;
    /**
     * Deletes a {@link ProviderConfig}.
     * @param id
     * @returns
     */
    removeProviderConfig(id: ulong): Promise<RepProviderConfigDelete>;
    /**
     * Restores a deleted {@link ProviderConfig}.
     * @param id
     * @returns
     */
    restoreProviderConfig(id: ulong): Promise<RepProviderConfigDelete>;
    /**
     * Retrieves a list of all {@link ProviderConfiguration}s in the given {@link Company}.
     * @param companyId
     * @param constraints
     * @returns
     */
    listProviderConfigurations(companyId: ulong, constraints?: JsonObject): Promise<RepProviderConfigurationListByCompany>;
    /**
     * Retrieves a given {@link ProviderConfiguration} from the server by its {@link ProviderConfiguration.id}.
     * @param id
     * @returns
     */
    getProviderConfiguration(id: ulong): Promise<RepProviderConfigurationGet>;
    /**
     * Creates a new, or updates an existing {@link ProviderConfiguration}.
     * @param json
     * @returns
     */
    mergeProviderConfiguration(json: JsonObject): Promise<RepProviderConfigurationMerge>;
    /**
     * Merges a batch of {@link ProviderConfiguration}s.
     * @param array
     * @returns
     */
    multiMergeProviderConfiguration(id: ulong): Promise<RepProviderConfigurationBatchMerge>;
    /**
     * Deletes a {@link ProviderConfiguration}.
     * @param id
     * @returns
     */
    removeProviderConfiguration(id: ulong): Promise<RepProviderConfigurationDelete>;
    /**
     * Restores a deleted {@link ProviderConfiguration}.
     * @param id
     * @returns
     */
    restoreProviderConfiguration(id: ulong): Promise<RepProviderConfigurationDelete>;
    /**
     * Retrieves a list of all {@link ProviderRegistration}s in the given {@link Company}.
     * @param companyId
     * @returns
     */
    listProviderRegistration(companyId: ulong, constraints?: JsonObject): Promise<RepProviderRegistrationListByCompany>;
    /**
     * Retrieves a given {@link ProviderRegistration} from the server by its {@link ProviderRegistration.id}.
     * @param code
     * @returns
     */
    getProviderRegistration(code: int): Promise<RepProviderRegistrationGet>;
    /**
     * Creates a new {@link ProviderRegistration}.
     * {@link ProviderRegistration}s cannot be updated, but they do expire on their own.
     * You can also delete them using {@link removeProviderRegistration}.
     * @param json
     * @returns
     */
    mergeProviderRegistration(json: JsonObject): Promise<RepProviderRegistrationMerge>;
    /**
     * Deletes a {@link ProviderRegistration}.
     * @param code
     * @returns
     */
    removeProviderRegistration(code: int): Promise<RepProviderRegistrationDelete>;
    /**
     * Retrieves a list of all {@link Behaviour}s in the given {@link Company}.
     * @param companyId
     * @param constraints
     * @returns
     */
    listBehaviours(companyId: ulong, constraints?: JsonObject): Promise<RepBehaviourListByCompany>;
    /**
     * Retrieves a given {@link Behaviour} from the server by its {@link Behaviour.id}.
     * @param id
     * @returns
     */
    getBehaviour(id: ulong): Promise<RepBehaviourGet>;
    /**
     * Creates a new, or updates an existing {@link Behaviour}.
     * @param json
     * @returns
     */
    mergeBehaviour(json: JsonObject): Promise<RepBehaviourMerge>;
    /**
     * Merges a batch of {@link Behaviour}s.
     * @param array
     * @returns
     */
    multiMergeBehaviour(id: ulong): Promise<RepBehaviourBatchMerge>;
    /**
     * Deletes a {@link Behaviour}.
     * @param id
     * @returns
     */
    removeBehaviour(id: ulong): Promise<RepBehaviourDelete>;
    /**
     * Restores a deleted {@link Behaviour}.
     * @param id
     * @returns
     */
    restoreBehaviour(id: ulong): Promise<RepBehaviourDelete>;
    /**
     * Retrieves a list of all {@link BehaviourScript}s in the trunk for the given {@link Company}.
     * @param companyId
     * @param constraints
     * @returns
     */
    listBehaviourScripts(companyId: ulong, constraints?: JsonObject): Promise<RepBehaviourScriptListByCompany>;
    /**
     * Retrieves a given {@link BehaviourScript} from the server by its {@link BehaviourScript.id}.
     * @param id
     * @returns
     */
    getBehaviourScript(id: ulong): Promise<RepBehaviourScriptGet>;
    /**
     * Creates a new, or updates an existing {@link Behaviour}.
     * @param json
     * @returns
     */
    mergeBehaviourScript(json: JsonObject): Promise<RepBehaviourScriptMerge>;
    /**
     * Deletes a {@link Behaviour}.
     * @param id
     * @returns
     */
    removeBehaviourScript(id: ulong): Promise<RepBehaviourScriptDelete>;
    /**
     * Restores a deleted {@link Behaviour}.
     * @param id
     * @returns
     */
    restoreBehaviourScript(id: ulong): Promise<RepBehaviourScriptDelete>;
    /**
     * Retrieves a list of all {@link BehaviourLog}s from the given {@link Asset}.
     * @param behaviourId
     * @returns
     */
    listBehaviourAssetLogs(behaviourId: ulong, constraints?: JsonObject): Promise<RepBehaviourLogListByAsset>;
    /**
     * Deletes all the {@link BehaviourLog}s from the given {@link Asset}.
     * @param behaviourId
     * @returns
     */
    clearBehaviourAssetLogs(behaviourId: ulong): Promise<RepBehaviourLogBatchDeleteByAsset>;
    /**
     * Retrieves a list of all {@link BehaviourLog}s from the given {@link Behaviour}.
     * @param behaviourId
     * @returns
     */
    listBehaviourLogs(behaviourId: ulong, constraints?: JsonObject): Promise<RepBehaviourLogListByBehaviour>;
    /**
     * Deletes all the {@link BehaviourLog}s from the given {@link Behaviour}.
     * @param behaviourId
     * @returns
     */
    clearBehaviourLogs(behaviourId: ulong): Promise<RepBehaviourLogBatchDeleteByBehaviour>;
    /**
     * Retrieves a list of all {@link BehaviourLog}s from the given {@link BehaviourScript}.
     * @param scriptId
     * @returns
     */
    listBehaviourScriptLogs(scriptId: ulong, constraints?: JsonObject): Promise<RepBehaviourLogListByScript>;
    /**
     * Deletes all the {@link BehaviourLog}s from the given {@link BehaviourScript}.
     * @param scriptId
     * @returns
     */
    clearBehaviourScriptLogs(scriptId: ulong, constraints?: JsonObject): Promise<RepBehaviourLogBatchDeleteByScript>;
    /**
     * Retrieves a list of all {@link ReportTemplate}s in the given {@link Company}.
     * @param companyId
     * @param constraints
     * @returns
     */
    listReportTemplates(companyId: ulong, constraints?: JsonObject): Promise<RepReportTemplateListByCompany>;
    /**
     * Retrieves a given {@link ReportTemplate} from the server by its {@link ReportTemplate.id}.
     * @param id
     * @returns
     */
    getReportTemplate(id: ulong): Promise<RepReportTemplateGet>;
    /**
     * Creates a new, or updates an existing {@link ReportTemplate}.
     * @param json
     * @returns
     */
    mergeReportTemplate(json: JsonObject): Promise<RepReportTemplateMerge>;
    /**
     * Deletes a {@link ReportTemplate}.
     * @param id
     * @returns
     */
    removeReportTemplate(id: ulong): Promise<RepReportTemplateDelete>;
    /**
     * Restores a deleted {@link ReportTemplate}.
     * @param id
     * @returns
     */
    restoreReportTemplate(id: ulong): Promise<RepReportTemplateDelete>;
    /**
     * Retrieves a list of all {@link ReportSchedule}s in the given {@link Company}.
     * @param companyId
     * @param constraints
     * @returns
     */
    listReportSchedules(companyId: ulong, constraints?: JsonObject): Promise<RepReportScheduleListByCompany>;
    /**
     * Retrieves a given {@link ReportSchedule} from the server by its {@link ReportSchedule.id}.
     * @param id
     * @returns
     */
    getReportSchedule(id: ulong): Promise<RepReportScheduleGet>;
    /**
     * Creates a new, or updates an existing {@link ReportSchedule}.
     * @param json
     * @returns
     */
    mergeReportSchedule(json: JsonObject): Promise<RepReportScheduleMerge>;
    /**
     * Deletes a {@link ReportSchedule}.
     * @param id
     * @returns
     */
    removeReportSchedule(id: ulong): Promise<RepReportScheduleDelete>;
    /**
     * Restores a deleted {@link ReportSchedule}.
     * @param id
     * @returns
     */
    restoreReportSchedule(id: ulong): Promise<RepReportScheduleDelete>;
    /**
     * Retrieves a list of all {@link ReportResult}s in the given {@link Company}.
     * @param companyId
     * @param constraints
     * @returns
     */
    listReportResults(companyId: ulong, constraints?: JsonObject): Promise<RepReportResultListByCompany>;
    /**
     * Retrieves a given {@link ReportResult} from the server by its {@link ReportResult.id}.
     * @param id
     * @returns
     */
    getReportResult(id: ulong): Promise<RepReportResultGet>;
    /**
     * Creates a new, or updates an existing {@link ReportResult}.
     * @param json
     * @returns
     */
    mergeReportResult(json: JsonObject): Promise<RepReportResultMerge>;
    /**
     * Deletes a {@link ReportResult}.
     * @param id
     * @returns
     */
    removeReportResult(id: ulong): Promise<RepReportResultDelete>;
    /**
     * Restores a deleted {@link ReportResult}.
     * @param id
     * @returns
     */
    restoreReportResult(id: ulong): Promise<RepReportResultDelete>;
    /**
     * Retrieves a list of all {@link MaintenanceSchedule}s in the given {@link Company}.
     * @param companyId
     * @param constraints
     * @returns
     */
    listMaintenanceSchedules(companyId: ulong, constraints?: JsonObject): Promise<RepMaintenanceScheduleListByCompany>;
    /**
     * Retrieves a given {@link MaintenanceSchedule} from the server by its {@link MaintenanceSchedule.id}.
     * @param id
     * @returns
     */
    getMaintenanceSchedule(id: ulong): Promise<RepMaintenanceScheduleGet>;
    /**
     * Creates a new, or updates an existing {@link MaintenanceSchedule}.
     * @param json
     * @returns
     */
    mergeMaintenanceSchedule(json: JsonObject): Promise<RepMaintenanceScheduleMerge>;
    /**
     * Deletes a {@link MaintenanceSchedule}.
     * @param id
     * @returns
     */
    removeMaintenanceSchedule(id: ulong): Promise<RepMaintenanceScheduleDelete>;
    /**
     * Restores a deleted {@link MaintenanceSchedule}.
     * @param id
     * @returns
     */
    restoreMaintenanceSchedule(id: ulong): Promise<RepMaintenanceScheduleDelete>;
    /**
     * Retrieves a list of all {@link MaintenanceJob}s in the given {@link Company}.
     * @param companyId
     * @param constraints
     * @returns
     */
    listMaintenanceJobs(companyId: ulong, constraints?: JsonObject): Promise<RepMaintenanceJobListByCompany>;
    /**
     * Retrieves a given {@link MaintenanceJob} from the server by its {@link MaintenanceJob.id}.
     * @param id
     * @returns
     */
    getMaintenanceJob(id: ulong): Promise<RepMaintenanceJobGet>;
    /**
     * Creates a new, or updates an existing {@link MaintenanceJob}.
     * @param json
     * @returns
     */
    mergeMaintenanceJob(json: JsonObject): Promise<RepMaintenanceJobMerge>;
    /**
     * Deletes a {@link MaintenanceJob}.
     * @param id
     * @returns
     */
    removeMaintenanceJob(id: ulong): Promise<RepMaintenanceJobDelete>;
    /**
     * Restores a deleted {@link MaintenanceJob}.
     * @param id
     * @returns
     */
    restoreMaintenanceJob(id: ulong): Promise<RepMaintenanceJobDelete>;
}
//# sourceMappingURL=TrakitObjectCommander.d.ts.map