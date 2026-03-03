import {
	ErrorCode,
	PayAssetAdvancedGet,
	PayAssetAdvancedListByCompany,
	PayAssetBatchMerge,
	PayAssetDelete,
	PayAssetDispatchMerge,
	PayAssetGeneralGet,
	PayAssetGeneralListByCompany,
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
	PayCompanyDirectoryGet,
	PayCompanyDirectoryListByCompany,
	PayCompanyGeneralGet,
	PayCompanyGeneralListByCompany,
	PayCompanyGet,
	PayCompanyMerge,
	PayCompanyPolicyGet,
	PayCompanyPolicyListByCompany,
	PayCompanyResellerDelete,
	PayCompanyResellerGet,
	PayCompanyResellerMerge,
	PayCompanyResellerRestore,
	PayCompanyRestore,
	PayCompanyStyleGet,
	PayCompanyStyleListByCompany,
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
	Payload,
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
	PayProviderAdvancedGet,
	PayProviderAdvancedListByCompany,
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
	PayProviderControlGet,
	PayProviderControlListByCompany,
	PayProviderDelete,
	PayProviderGeneralGet,
	PayProviderGeneralListByCompany,
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
	PayUserAdvancedGet,
	PayUserAdvancedListByCompany,
	PayUserDelete,
	PayUserGeneralGet,
	PayUserGeneralListByCompany,
	PayUserGet,
	PayUserGroupDelete,
	PayUserGroupGet,
	PayUserGroupListByCompany,
	PayUserGroupMerge,
	PayUserGroupRestore,
	PayUserListByCompany,
	PayUserMerge,
	PayUserRestore,
	RepAssetAdvancedGet,
	RepAssetAdvancedListByCompany,
	RepAssetBatchMerge,
	RepAssetDelete,
	RepAssetDispatchMerge,
	RepAssetGeneralGet,
	RepAssetGeneralListByCompany,
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
	RepCompanyDirectoryGet,
	RepCompanyDirectoryListByCompany,
	RepCompanyGeneralGet,
	RepCompanyGeneralListByCompany,
	RepCompanyGet,
	RepCompanyMerge,
	RepCompanyPolicyGet,
	RepCompanyPolicyListByCompany,
	RepCompanyResellerDelete,
	RepCompanyResellerGet,
	RepCompanyResellerMerge,
	RepCompanyStyleGet,
	RepCompanyStyleListByCompany,
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
	ReplySync,
	ReplySyncBatchDelete,
	ReplySyncDelete,
	ReplySyncGet,
	ReplySyncList,
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
	RepProviderAdvancedGet,
	RepProviderAdvancedListByCompany,
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
	RepProviderControlGet,
	RepProviderControlListByCompany,
	RepProviderDelete,
	RepProviderGeneralGet,
	RepProviderGeneralListByCompany,
	RepProviderGet,
	RepProviderListByCompany,
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
	RepSelfContact,
	RepSelfGet,
	RepSelfLogout,
	RepSelfPassword,
	RepSelfPreferences,
	RepSessionDelete,
	RepSessionListByCompany,
	RepSessionListByUser,
	RepUserAdvancedGet,
	RepUserAdvancedListByCompany,
	RepUserDelete,
	RepUserGeneralGet,
	RepUserGeneralListByCompany,
	RepUserGet,
	RepUserGroupDelete,
	RepUserGroupGet,
	RepUserGroupListByCompany,
	RepUserGroupMerge,
	RepUserListByCompany,
	RepUserMerge,
} from '@trakit/commands';
import {
	Asset,
	AssetMessage,
	Behaviour,
	BehaviourLog,
	BehaviourScript,
	codified,
	Company,
	CompanyGeneral,
	CompanyReseller,
	Contact,
	Dashcam,
	DashcamLive,
	DispatchJob,
	DispatchTask,
	Document,
	email,
	expression,
	FormResult,
	FormTemplate,
	guid,
	Icon,
	int,
	IRequestable,
	JsonObject,
	Machine,
	MaintenanceJob,
	MaintenanceSchedule,
	nothing,
	Picture,
	Place,
	Provider,
	ProviderConfig,
	ProviderConfiguration,
	ProviderRegistration,
	ProviderScript,
	ReportResult,
	ReportSchedule,
	ReportTemplate,
	serialization,
	Session,
	SyncName,
	SystemsOfUnits,
	Timezone,
	ulong,
	url,
	User,
	UserGroup,
	UserNotifications
} from '@trakit/objects';
import {
	TrakitEvent,
	TrakitEventAccount,
	TrakitEventDelete,
	TrakitEventHandler,
	TrakitEventList,
	TrakitEventUpdate,
} from './Events';
import { TrakitBaseCommander } from './TrakitBaseCommander';

/**
 * Base class to retrieve, modify, and delete Trak-iT objects via the APIs.
 */
export abstract class TrakitObjectCommander<TRequest> extends TrakitBaseCommander<TRequest> {
	//#region Events
	/**
	 * A map of event types to their registered handlers.
	 */
	protected _handlers = new Map<string, TrakitEventHandler[]>();

	/**
	 * Gets invoked any time the service's account information is updated while the connection is open.
	 * @param reset When true, a new instance of RepSelfGet is created to reset all values, otherwise the existing RepSelfGet instance is updated with new values.
	 */
	protected _handleAccount(reset?: boolean) {
		if (reset) {
			this.setAuth(new RepSelfGet({
				serverTime: this.account.serverTime?.toISOString() ?? null,
				ghostId: this.account.ghostId ?? null,
				expiry: this.account.expiry?.toISOString() ?? null,
				user: this.account.userLogin
					? { "login": this.account.userLogin } as JsonObject
					: null,
				machine: this.account.machineKey
					? { "key": this.account.machineKey } as JsonObject
					: null,
				sessionPolicy: this.account.sessionPolicy?.toJSON() ?? null,
				passwordPolicy: this.account.passwordPolicy?.toJSON() ?? null,
			}));
		}
		this.fire("account", () => new TrakitEventAccount("account", this.account));
	}
	/**
	 * Gets invoked any time all the objects for a given kind in the given company are updated.
	 */
	protected _handleList(kind: SyncName, companyId: ulong, objects: IRequestable[]) {
		this.fire("list", () => new TrakitEventList("list", kind, companyId, objects));
	}
	/**
	 * Gets invoked any time an object for a given kind in the given company is created or updated.
	 */
	protected _handleUpdate(kind: SyncName, companyId: ulong, object: IRequestable) {
		this.fire("update", () => new TrakitEventUpdate("update", kind, companyId, object));
	}
	/**
	 * Gets invoked any time an object for a given kind in the given company is deleted.
	 */
	protected _handleDelete(kind: SyncName, companyId: ulong, key: ulong | guid | email | codified | string) {
		this.fire("delete", () => new TrakitEventDelete("delete", kind, companyId, key));
	}

	/**
	 * Adds an event handler for a specific event type.
	 * @param type		The type of event to listen for.
	 * @param handler	The function to call when the event occurs.
	 * @returns			True if the handler was added, false if it was already registered.
	 */
	on(type: string, handler: TrakitEventHandler): boolean {
		let handlers = this._handlers.get(type);
		if (!handlers) this._handlers.set(type, handlers = []);
		const exists = handlers.includes(handler);
		if (!exists) handlers.push(handler);
		return !exists;
	}
	/**
	 * Removes an event handler for a specific event type.
	 * If no handler is provided, all handlers for the event type will be removed.
	 * @param type		The type of event to stop listening for.
	 * @param handler	The function to remove from the event listeners.
	 * @returns			True if the handler(s) got removed, otherwise false.
	 */
	off(type: string, handler?: TrakitEventHandler | nothing): boolean {
		const handlers = this._handlers.get(type);
		if (handlers?.length) {
			if (handler) {
				const index = handlers.indexOf(handler);
				return !!(index > -1 && handlers.splice(index, 1));
			} else {
				return !(handlers.length = 0);
			}
		}
		return false;
	}
	/**
	 * Raises an event of a specific type, invoking all registered handlers with the provided event data.
	 * @param type		The name of the event to raise.
	 * @param create	A function that creates the event object.  This function is invoked just once and only if there are handlers registered for the event type.
	 */
	protected fire(type: string, create: () => TrakitEvent) {
		const handlers = this._handlers.get(type)?.slice(); // copy so handlers can be removed during firing without affecting the loop
		if (handlers?.length) {
			const event = create();
			handlers.forEach(handler => handler.call(this, event), this);
		}
	}
	/**
	 * Checks if a specific event handler is registered for a given event type.
	 * @param type		The type of event to check.
	 * @param handler	The function to check for.
	 * @returns			True if the handler is registered, otherwise false.
	 */
	handles(type: string, handler: TrakitEventHandler): boolean {
		return this._handlers.get(type)?.includes(handler) ?? false;
	}
	//#endregion Events

	dispose(): void {
		// unbind event handlers
		for (const name of [...this._handlers.keys()]) {
			this.off(name);
		}
	}

	/**
	 * Overridden to handle storage and events.
	 * @inheritdoc
	 */
	override async command<TReply extends Reply>(payload: Payload): Promise<TReply> {
		const reply = await super.command<TReply>(payload);
		if (reply instanceof ReplySync && reply.store()) {
			const action = payload.getAction(),
				companyId = reply.getCompanyId();
			if (reply instanceof ReplySyncList) {
				if (!action.filter) {
					this._handleList(action.object, companyId, reply.getList());
				} else {
					reply.getList().forEach(obj => this._handleUpdate(action.object, companyId, obj));
				}
			} else if (reply instanceof ReplySyncGet) {
				this._handleUpdate(action.object, companyId, reply.getObject());
			} else if (reply instanceof ReplySyncDelete) {
				this._handleDelete(action.object, companyId, reply.getKey());
			} else if (reply instanceof ReplySyncBatchDelete) {
				reply.getResults().forEach(result => this._handleDelete(action.object, result.getCompanyId(), result.getKey()));
			}
		}
		return reply;
	}

	//#region Self
	/**
	 * Requests the details of the {@link User} or {@link Machine} currently identified.
	 * @returns The account details or null.
	 */
	public async selfDetails(): Promise<RepSelfGet> {
		const reply = await this.command<RepSelfGet>(new PaySelfGet());
		this.setAuth(reply);
		this._handleAccount();
		return reply;
	}

	/**
	 * Sends a login command, and if successful, saves the {@link RepSelfGet.ghostId|session id} for all further requests.
	 * @param username	Your email address.
	 * @param password	Your password.
	 * @param userAgent	Optional string to identify the client software.
	 * @returns The response, which contains a SelfUser when successful.
	 */
	public async login(username: string, password: string, userAgent?: string | nothing): Promise<RepSelfGet | null> {
		const reply = await this.command<RepSelfGet>(new PaySelfLogin({
			username: username,
			password: password,
			userAgent: userAgent ?? null,
		}));
		this.setAuth(reply);
		this._handleAccount();
		return reply;
	}
	/**
	 * Sends a logout command and removes the current {@link RepSelfGet|session information} whether successful or not.
	 * @returns The logout response.
	 */
	public logout(): Promise<RepSelfLogout> {
		const promise = this.command<RepSelfLogout>(new PaySelfLogout()); // not awaited
		this.setAuth();
		this._handleAccount();
		return promise;
	}

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
	): Promise<RepSelfContact> {
		return this.command<RepSelfContact>(new PaySelfContact({
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
	 * @param oldPassword	Your current password, as verification that you are the account owner.
	 * @param newPassword	Your new password must conform to your company's PasswordPolicy.
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
	 * @param language		Your language code, e.g., "en-US".
	 * @param timezone		Your {@link Timezone.code}.
	 * @param notify		Notification preferences.
	 * @param formats		Format templates for dates, times, etc...
	 * @param measurements	Measurement system preferences.
	 * @param options		Saved JSON data used by client applications.
	 * @returns The reply from the update preferences command.
	 */
	public updatePreferences(
		language?: codified,
		timezone?: Timezone | string,
		notify?: UserNotifications[] | JsonObject[],
		formats?: Map<string, string> | JsonObject,
		measurements?: Map<string, SystemsOfUnits> | JsonObject,
		options?: Map<string, string> | JsonObject
	): Promise<RepSelfPreferences> {
		return this.command<RepSelfPreferences>(new PaySelfPreferences({
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
	 * Retrieves a given {@link Company} from the server by its {@link Company.id}.
	 * @param id
	 * @returns
	 */
	getCompany(id: ulong) {
		return this.command<RepCompanyGet>(new PayCompanyGet({
			company: { id },
		}));
	}
	/**
	 * Creates a new, or updates an existing {@link Company}.
	 * @param json
	 * @returns
	 */
	mergeCompany(json: JsonObject) {
		return this.command<RepCompanyMerge>(new PayCompanyMerge({
			company: json,
		}));
	}
	/**
	 * Deletes a {@link Company}.
	 * @param id
	 * @returns
	 */
	removeCompany(id: ulong) {
		return this.command<RepCompanyDelete>(new PayCompanyDelete({
			company: { id },
		}));
	}
	/**
	 * Restores a deleted {@link Company}.
	 * @param id
	 * @returns
	 */
	restoreCompany(id: ulong) {
		return this.command<RepCompanyDelete>(new PayCompanyRestore({
			company: { id },
		}));
	}
	//#endregion Companies
	//#region Companies/General
	/**
	 * Retrieves a list of all {@link CompanyGeneral}s in the tree for the given company.
	 * @param id
	 * @param constraints
	 * @returns
	 */
	listCompanyGenerals(id: ulong, constraints?: JsonObject) {
		return this.command<RepCompanyGeneralListByCompany>(new PayCompanyGeneralListByCompany({
			...constraints,
			company: { id },
		}));
	}
	/**
	 * Retrieves a given {@link CompanyGeneral} from the server by its {@link Company.id}.
	 * @param id
	 * @returns
	 */
	getCompanyGeneral(id: ulong) {
		return this.command<RepCompanyGeneralGet>(new PayCompanyGeneralGet({
			company: { id },
		}));
	}
	//#endregion Companies/General
	//#region Companies/Policy
	/**
	 * Retrieves a list of all {@link CompanyPolicy}s in the tree for the given company.
	 * @param id
	 * @param constraints
	 * @returns
	 */
	listCompanyPolicies(id: ulong, constraints?: JsonObject) {
		return this.command<RepCompanyPolicyListByCompany>(new PayCompanyPolicyListByCompany({
			...constraints,
			company: { id },
		}));
	}
	/**
	 * Retrieves a given {@link CompanyPolicy} from the server by its {@link Company.id}.
	 * @param id
	 * @returns
	 */
	getCompanyPolicy(id: ulong) {
		return this.command<RepCompanyPolicyGet>(new PayCompanyPolicyGet({
			company: { id },
		}));
	}
	//#endregion Companies/Policy
	//#region Companies/Style
	/**
	 * Retrieves a list of all {@link CompanyStyle}s in the tree for the given company.
	 * @param id
	 * @param constraints
	 * @returns
	 */
	listCompanyStyles(id: ulong, constraints?: JsonObject) {
		return this.command<RepCompanyStyleListByCompany>(new PayCompanyStyleListByCompany({
			...constraints,
			company: { id },
		}));
	}
	/**
	 * Retrieves a given {@link CompanyStyle} from the server by its {@link Company.id}.
	 * @param id
	 * @returns
	 */
	getCompanyStyle(id: ulong) {
		return this.command<RepCompanyStyleGet>(new PayCompanyStyleGet({
			company: { id },
		}));
	}
	//#endregion Companies/Style
	//#region Companies/Directory
	/**
	 * Retrieves a list of all {@link CompanyDirectory}s in the tree for the given company.
	 * @param id
	 * @param constraints
	 * @returns
	 */
	listCompanyDirectories(id: ulong, constraints?: JsonObject) {
		return this.command<RepCompanyDirectoryListByCompany>(new PayCompanyDirectoryListByCompany({
			...constraints,
			company: { id },
		}));
	}
	/**
	 * Retrieves a given {@link CompanyDirectory} from the server by its {@link Company.id}.
	 * @param id
	 * @returns
	 */
	getCompanyDirectory(id: ulong) {
		return this.command<RepCompanyDirectoryGet>(new PayCompanyDirectoryGet({
			company: { id },
		}));
	}
	//#endregion Companies/Directory
	//#region Companies/Reseller
	/**
	 * Retrieves a given {@link CompanyReseller} from the server by its {@link CompanyReseller.id}.
	 * @param id
	 * @returns
	 */
	getReseller(id: ulong) {
		return this.command<RepCompanyResellerGet>(new PayCompanyResellerGet({
			company: { id },
		}));
	}
	/**
	 * Creates a new, or updates an existing {@link CompanyReseller}.
	 * @param json
	 * @returns
	 */
	mergeReseller(json: JsonObject) {
		return this.command<RepCompanyResellerMerge>(new PayCompanyResellerMerge({
			company: json,
		}));
	}
	/**
	 * Deletes a {@link CompanyReseller}.
	 * @param id
	 * @returns
	 */
	removeReseller(id: ulong) {
		return this.command<RepCompanyResellerDelete>(new PayCompanyResellerDelete({
			company: { id },
		}));
	}
	/**
	 * Restores a deleted {@link CompanyReseller}.
	 * @param id
	 * @returns
	 */
	restoreReseller(id: ulong) {
		return this.command<RepCompanyResellerDelete>(new PayCompanyResellerRestore({
			company: { id },
		}));
	}
	//#endregion Companies/Reseller

	//#region Contacts
	/**
	 * Retrieves a list of all {@link Contact}s in the given company.
	 * @param companyId
	 * @param constraints
	 * @returns
	 */
	listContacts(companyId: ulong, constraints?: JsonObject) {
		return this.command<RepContactListByCompany>(new PayContactListByCompany({
			...constraints,
			company: { id: companyId },
		}));
	}
	/**
	 * Retrieves a given contact from the server by its {@link Contact.id}.
	 * @param id
	 * @returns
	 */
	getContact(id: ulong) {
		return this.command<RepContactGet>(new PayContactGet({
			contact: { id },
		}));
	}
	/**
	 * Creates a new, or updates an existing {@link Contact}.
	 * @param json
	 * @returns
	 */
	mergeContact(json: JsonObject) {
		return this.command<RepContactMerge>(new PayContactMerge({
			contact: json,
		}));
	}
	/**
	 * Deletes a {@link Contact}.
	 * @param id
	 * @returns
	 */
	removeContact(id: ulong) {
		return this.command<RepContactDelete>(new PayContactDelete({
			contact: { id },
		}));
	}
	/**
	 * Restores a deleted {@link Contact}.
	 * @param id
	 * @returns
	 */
	restoreContact(id: ulong) {
		return this.command<RepContactDelete>(new PayContactRestore({
			contact: { id },
		}));
	}
	/**
	 * Merges a batch of {@link Contact}s.
	 * @param array
	 * @returns
	 */
	multiMergeContact(array: JsonObject[]) {
		return this.command<RepContactBatchMerge>(new PayContactBatchMerge({
			contacts: array,
		}));
	}
	/**
	 * Merges a batch of {@link Contact}s.
	 * @param array
	 * @returns
	 */
	multiRemoveContact(ids: ulong[]) {
		return this.command<RepContactBatchDelete>(new PayContactBatchDelete({
			contacts: ids.map(id => ({ id })),
		}));
	}
	//#endregion Contacts
	//#region Users
	/**
	 * Retrieves a list of all {@link User}s in the given company.
	 * @param companyId
	 * @param constraints
	 * @returns
	 */
	listUsers(companyId: ulong, constraints?: JsonObject) {
		return this.command<RepUserListByCompany>(new PayUserListByCompany({
			...constraints,
			company: { id: companyId },
		}));
	}
	/**
	 * Retrieves a given user from the server by its {@link User.id}.
	 * @param login
	 * @returns
	 */
	getUser(login: email) {
		return this.command<RepUserGet>(new PayUserGet({
			user: { login },
		}));
	}
	/**
	 * Creates a new, or updates an existing {@link User}.
	 * @param json
	 * @returns
	 */
	mergeUser(json: JsonObject) {
		return this.command<RepUserMerge>(new PayUserMerge({
			user: json,
		}));
	}
	/**
	 * Deletes an {@link User}.
	 * @param login
	 * @returns
	 */
	removeUser(login: email) {
		return this.command<RepUserDelete>(new PayUserDelete({
			user: { login },
		}));
	}
	/**
	 * Restores a deleted {@link User}.
	 * @param login
	 * @returns
	 */
	restoreUser(login: email) {
		return this.command<RepUserDelete>(new PayUserRestore({
			user: { login },
		}));
	}
	//#endregion Users
	//#region Users/General
	/**
	 * Retrieves a list of all {@link UserGeneral}s in the given company.
	 * @param companyId
	 * @param constraints
	 * @returns
	 */
	listUserGenerals(companyId: ulong, constraints?: JsonObject) {
		return this.command<RepUserGeneralListByCompany>(new PayUserGeneralListByCompany({
			...constraints,
			company: { id: companyId },
		}));
	}
	/**
	 * Retrieves a given {@link UserGeneral} from the server by its {@link User.id}.
	 * @param login
	 * @returns
	 */
	getUserGeneral(login: email) {
		return this.command<RepUserGeneralGet>(new PayUserGeneralGet({
			user: { login },
		}));
	}
	//#endregion Users/General
	//#region Users/Advanced
	/**
	 * Retrieves a list of all {@link UserAdvanced}s in the given company.
	 * @param companyId
	 * @param constraints
	 * @returns
	 */
	listUserAdvanceds(companyId: ulong, constraints?: JsonObject) {
		return this.command<RepUserAdvancedListByCompany>(new PayUserAdvancedListByCompany({
			...constraints,
			company: { id: companyId },
		}));
	}
	/**
	 * Retrieves a given {@link UserAdvanced} from the server by its {@link User.id}.
	 * @param login
	 * @returns
	 */
	getUserAdvanced(login: email) {
		return this.command<RepUserAdvancedGet>(new PayUserAdvancedGet({
			user: { login },
		}));
	}
	//#endregion Users/Advanced

	//#region User Groups
	/**
	 * Retrieves a list of all {@link UserGroup}s in the given company.
	 * @param companyId
	 * @param constraints
	 * @returns
	 */
	listUserGroups(companyId: ulong, constraints?: JsonObject) {
		return this.command<RepUserGroupListByCompany>(new PayUserGroupListByCompany({
			...constraints,
			company: { id: companyId },
		}));
	}
	/**
	 * Retrieves a given {@link UserGroup} from the server by its {@link UserGroup.id}.
	 * @param id
	 * @returns
	 */
	getUserGroup(id: ulong) {
		return this.command<RepUserGroupGet>(new PayUserGroupGet({
			userGroup: { id },
		}));
	}
	/**
	 * Creates a new, or updates an existing {@link UserGroup}.
	 * @param json
	 * @returns
	 */
	mergeUserGroup(json: JsonObject) {
		return this.command<RepUserGroupMerge>(new PayUserGroupMerge({
			userGroup: json,
		}));
	}
	/**
	 * Deletes a {@link UserGroup}.
	 * @param id
	 * @returns
	 */
	removeUserGroup(id: ulong) {
		return this.command<RepUserGroupDelete>(new PayUserGroupDelete({
			userGroup: { id },
		}));
	}
	/**
	 * Restores a deleted {@link UserGroup}.
	 * @param id
	 * @returns
	 */
	restoreUserGroup(id: ulong) {
		return this.command<RepUserGroupDelete>(new PayUserGroupRestore({
			userGroup: { id },
		}));
	}
	//#endregion User Groups
	//#region Machines
	/**
	 * Retrieves a list of all {@link Machine}s in the given company.
	 * @param companyId
	 * @param constraints
	 * @returns
	 */
	listMachines(companyId: ulong, constraints?: JsonObject) {
		return this.command<RepMachineListByCompany>(new PayMachineListByCompany({
			...constraints,
			company: { id: companyId },
		}));
	}
	/**
	 * Retrieves a given {@link Machine} from the server by its {@link Machine.key}.
	 * @param key
	 * @returns
	 */
	getMachine(key: string) {
		return this.command<RepMachineGet>(new PayMachineGet({
			machine: { id: key },
		}));
	}
	/**
	 * Creates a new, or updates an existing {@link Machine}.
	 * @param json
	 * @returns
	 */
	mergeMachine(json: JsonObject) {
		return this.command<RepMachineMerge>(new PayMachineMerge({
			machine: json,
		}));
	}
	/**
	 * Deletes an {@link Machine}.
	 * @param key
	 * @returns
	 */
	removeMachine(key: string) {
		return this.command<RepMachineDelete>(new PayMachineDelete({
			machine: { id: key },
		}));
	}
	/**
	 * Restores a deleted {@link Machine}.
	 * @param key
	 * @returns
	 */
	restoreMachine(key: string) {
		return this.command<RepMachineDelete>(new PayMachineRestore({
			machine: { id: key },
		}));
	}
	//#endregion Machine
	//#region Sessions
	/**
	 * Retrieves a list of all {@link Session}s in the given {@link Company}.
	 * @param companyId
	 * @returns
	 */
	listSessions(companyId: ulong, constraints?: JsonObject) {
		return this.command<RepSessionListByCompany>(new PaySessionListByCompany({
			...constraints,
			company: { id: companyId },
		}));
	}
	/**
	 * Retrieves a list of all {@link Session}s for the given {@link User}.
	 * @param login
	 * @returns
	 */
	listSessionsByUser(login: email, constraints?: JsonObject) {
		return this.command<RepSessionListByUser>(new PaySessionListByUser({
			...constraints,
			user: { login },
		}));
	}
	/**
	 * Kills a {@link Session}.
	 * @param handle
	 * @returns
	 */
	killSession(handle: string) {
		return this.command<RepSessionDelete>(new PaySessionDelete({
			session: { handle },
		}));
	}
	//#endregion Sessions

	//#region Icons
	/**
	 * Retrieves a list of all {@link Icon}s in the trunk for the given {@link Company}.
	 * @param companyId
	 * @param constraints
	 * @returns
	 */
	listIcons(companyId: ulong, constraints?: JsonObject) {
		return this.command<RepIconListByCompany>(new PayIconListByCompany({
			...constraints,
			company: { id: companyId },
		}));
	}
	/**
	 * Retrieves a given {@link Icon} from the server by its {@link Icon.id}.
	 * @param id
	 * @returns
	 */
	getIcon(id: ulong) {
		return this.command<RepIconGet>(new PayIconGet({
			icon: { id },
		}));
	}
	/**
	 * Creates a new, or updates an existing {@link Icon}.
	 * @param json
	 * @returns
	 */
	mergeIcon(json: JsonObject) {
		return this.command<RepIconMerge>(new PayIconMerge({
			icon: json,
		}));
	}
	/**
	 * Deletes a {@link Icon}.
	 * @param id
	 * @returns
	 */
	removeIcon(id: ulong) {
		return this.command<RepIconDelete>(new PayIconDelete({
			icon: { id },
		}));
	}
	/**
	 * Restores a deleted {@link Icon}.
	 * @param id
	 * @returns
	 */
	restoreIcon(id: ulong) {
		return this.command<RepIconDelete>(new PayIconRestore({
			icon: { id },
		}));
	}
	//#endregion Icons
	//#region Pictures
	/**
	 * Retrieves a list of all {@link Picture}s in the trunk for the given {@link Company}.
	 * @param companyId
	 * @param constraints
	 * @returns
	 */
	listPictures(companyId: ulong, constraints?: JsonObject) {
		return this.command<RepPictureListByCompany>(new PayPictureListByCompany({
			...constraints,
			company: { id: companyId },
		}));
	}
	/**
	 * Retrieves a given {@link Picture} from the server by its {@link Picture.id}.
	 * @param id
	 * @returns
	 */
	getPicture(id: ulong) {
		return this.command<RepPictureGet>(new PayPictureGet({
			picture: { id },
		}));
	}
	/**
	 * Creates a new, or updates an existing {@link Picture}.
	 * @param json
	 * @returns
	 */
	mergePicture(json: JsonObject) {
		return this.command<RepPictureMerge>(new PayPictureMerge({
			picture: json,
		}));
	}
	/**
	 * Deletes a {@link Picture}.
	 * @param id
	 * @returns
	 */
	removePicture(id: ulong) {
		return this.command<RepPictureDelete>(new PayPictureDelete({
			picture: { id },
		}));
	}
	/**
	 * Restores a deleted {@link Picture}.
	 * @param id
	 * @returns
	 */
	restorePicture(id: ulong) {
		return this.command<RepPictureDelete>(new PayPictureRestore({
			picture: { id },
		}));
	}
	//#endregion Pictures
	//#region Documents
	/**
	 * Retrieves a list of all {@link Document}s in the given {@link Company}.
	 * @param companyId
	 * @param constraints
	 * @returns
	 */
	listDocuments(companyId: ulong, constraints?: JsonObject) {
		return this.command<RepDocumentListByCompany>(new PayDocumentListByCompany({
			...constraints,
			company: { id: companyId },
		}));
	}
	/**
	 * Retrieves a given {@link Document} from the server by its {@link Document.id}.
	 * @param id
	 * @returns
	 */
	getDocument(id: ulong) {
		return this.command<RepDocumentGet>(new PayDocumentGet({
			document: { id },
		}));
	}
	/**
	 * Creates a new, or updates an existing {@link Document}.
	 * @param json
	 * @returns
	 */
	mergeDocument(json: JsonObject) {
		return this.command<RepDocumentMerge>(new PayDocumentMerge({
			document: json,
		}));
	}
	/**
	 * Deletes a {@link Document}.
	 * @param id
	 * @returns
	 */
	removeDocument(id: ulong) {
		return this.command<RepDocumentDelete>(new PayDocumentDelete({
			document: { id },
		}));
	}
	/**
	 * Restores a deleted {@link Document}.
	 * @param id
	 * @returns
	 */
	restoreDocument(id: ulong) {
		return this.command<RepDocumentDelete>(new PayDocumentRestore({
			document: { id },
		}));
	}
	//#endregion Documents
	//#region Forms/Templates
	/**
	 * Retrieves a list of all {@link FormTemplate}s in the given {@link Company}.
	 * @param companyId
	 * @param constraints
	 * @returns
	 */
	listFormTemplates(companyId: ulong, constraints?: JsonObject) {
		return this.command<RepFormTemplateListByCompany>(new PayFormTemplateListByCompany({
			...constraints,
			company: { id: companyId },
		}));
	}
	/**
	 * Retrieves a given {@link FormTemplate} from the server by its {@link FormTemplate.id}.
	 * @param id
	 * @returns
	 */
	getFormTemplate(id: ulong) {
		return this.command<RepFormTemplateGet>(new PayFormTemplateGet({
			formTemplate: { id },
		}));
	}
	/**
	 * Creates a new, or updates an existing {@link FormTemplate}.
	 * @param json
	 * @returns
	 */
	mergeFormTemplate(json: JsonObject) {
		return this.command<RepFormTemplateMerge>(new PayFormTemplateMerge({
			formTemplate: json,
		}));
	}
	/**
	 * Deletes a {@link FormTemplate}.
	 * @param id
	 * @returns
	 */
	removeFormTemplate(id: ulong) {
		return this.command<RepFormTemplateDelete>(new PayFormTemplateDelete({
			formTemplate: { id },
		}));
	}
	/**
	 * Restores a deleted {@link FormTemplate}.
	 * @param id
	 * @returns
	 */
	restoreFormTemplate(id: ulong) {
		return this.command<RepFormTemplateDelete>(new PayFormTemplateRestore({
			formTemplate: { id },
		}));
	}
	//#endregion Forms/Templates
	//#region Forms/Results
	/**
	 * Retrieves a list of all {@link FormResult}s in the given {@link Company}.
	 * @param companyId
	 * @param constraints
	 * @returns
	 */
	listFormResults(companyId: ulong, constraints?: JsonObject) {
		return this.command<RepFormResultListByCompany>(new PayFormResultListByCompany({
			...constraints,
			company: { id: companyId },
		}));
	}
	/**
	 * Retrieves a given {@link FormResult} from the server by its {@link FormResult.id}.
	 * @param id
	 * @returns
	 */
	getFormResult(id: ulong) {
		return this.command<RepFormResultGet>(new PayFormResultGet({
			formResult: { id },
		}));
	}
	/**
	 * Creates a new, or updates an existing {@link FormResult}.
	 * @param json
	 * @returns
	 */
	mergeFormResult(json: JsonObject) {
		return this.command<RepFormResultMerge>(new PayFormResultMerge({
			formResult: json,
		}));
	}
	/**
	 * Merges a batch of {@link FormResult}s.
	 * @param array
	 * @returns
	 */
	multiMergeFormResult(id: ulong) {
		return this.command<RepFormResultBatchMerge>(new PayFormResultBatchMerge({
			formResult: { id },
		}));
	}
	/**
	 * Deletes a {@link FormResult}.
	 * @param id
	 * @returns
	 */
	removeFormResult(id: ulong) {
		return this.command<RepFormResultDelete>(new PayFormResultDelete({
			formResult: { id },
		}));
	}
	/**
	 * Restores a deleted {@link FormResult}.
	 * @param id
	 * @returns
	 */
	restoreFormResult(id: ulong) {
		return this.command<RepFormResultDelete>(new PayFormResultRestore({
			formResult: { id },
		}));
	}
	//#endregion Forms/Results
	//#region Dashcams
	/**
	 * Retrieves a list of all {@link Dashcam} in the given {@link Company}.
	 * @param companyId
	 * @param constraints
	 * @returns
	 */
	listDashcamDatas(companyId: ulong, constraints?: JsonObject) {
		return this.command<RepDashcamListByCompany>(new PayDashcamListByCompany({
			...constraints,
			company: { id: companyId },
		}));
	}
	/**
	 * Retrieves a given {@link Dashcam} from the server by its {@link Dashcam.guid}.
	 * @param guid
	 * @returns
	 */
	getDashcamData(guid: guid) {
		return this.command<RepDashcamGet>(new PayDashcamGet({
			dashcam: { guid },
		}));
	}
	/**
	 * Retrieves a list of all {@link DashcamLive|live dashcam images} in the given {@link Company}.
	 * @param companyId
	 * @returns
	 */
	listDashcamLives(companyId: ulong, constraints?: JsonObject) {
		return this.command<RepDashcamLiveListByCompany>(new PayDashcamLiveListByCompany({
			...constraints,
			company: { id: companyId },
		}));
	}
	//#endregion Dashcams

	//#region Assets
	/**
	 * Retrieves a list of all {@link Asset}s in the given {@link Company}.
	 * @param companyId
	 * @param constraints
	 * @returns
	 */
	listAssets(companyId: ulong, constraints?: JsonObject) {
		return this.command<RepAssetListByCompany>(new PayAssetListByCompany({
			...constraints,
			company: { id: companyId },
		}));
	}
	/**
	 * Retrieves a given {@link Asset} from the server by its {@link Asset.id}.
	 * @param id
	 * @returns
	 */
	getAsset(id: ulong) {
		return this.command<RepAssetGet>(new PayAssetGet({
			asset: { id },
		}));
	}
	/**
	 * Creates a new, or updates an existing {@link Asset}.
	 * @param json
	 * @returns
	 */
	mergeAsset(json: JsonObject) {
		return this.command<RepAssetMerge>(new PayAssetMerge({
			asset: json,
		}));
	}
	/**
	 * Merges a batch of {@link Asset}s.
	 * @param array
	 * @returns
	 */
	multiMergeAsset(array: JsonObject[]) {
		return this.command<RepAssetBatchMerge>(new PayAssetBatchMerge({
			assets: array,
		}));
	}
	/**
	 * Deletes an {@link Asset}.
	 * @param id
	 * @returns
	 */
	removeAsset(id: ulong) {
		return this.command<RepAssetDelete>(new PayAssetDelete({
			asset: { id },
		}));
	}
	/**
	 * Restores a deleted {@link Asset}.
	 * @param id
	 * @returns
	 */
	restoreAsset(id: ulong) {
		return this.command<RepAssetDelete>(new PayAssetRestore({
			asset: { id },
		}));
	}
	/**
	 * Suspends an {@link Asset}.
	 * @param id
	 * @returns
	 */
	suspendAsset(id: ulong) {
		return this.command<RepAssetSuspend>(new PayAssetSuspend({
			asset: { id },
		}));
	}
	/**
	 * Reactivates an {@link Asset}.
	 * @param id
	 * @returns
	 */
	reviveAsset(id: ulong) {
		return this.command<RepAssetSuspend>(new PayAssetReactivate({
			asset: { id },
		}));
	}
	/**
	 * Searches all available companies for {@link Asset}s that match the given expression.
	 * @param expression
	 * @param constraints
	 * @returns
	 */
	searchAssets(expression: expression, constraints?: JsonObject) {
		// not yet implemented
	}
	//#endregion Assets
	//#region Assets/General
	/**
	 * Retrieves a list of all {@link AssetGeneral}s in the given {@link Company}.
	 * @param companyId
	 * @param constraints
	 * @returns
	 */
	listAssetGenerals(companyId: ulong, constraints?: JsonObject) {
		return this.command<RepAssetGeneralListByCompany>(new PayAssetGeneralListByCompany({
			...constraints,
			company: { id: companyId },
		}));
	}
	/**
	 * Retrieves a given {@link AssetGeneral} from the server by its {@link Asset.id}.
	 * @param id
	 * @returns
	 */
	getAssetGeneral(id: ulong) {
		return this.command<RepAssetGeneralGet>(new PayAssetGeneralGet({
			asset: { id },
		}));
	}
	/**
	 * Searches all available companies for {@link AssetGeneral}s that match the given expression.
	 * @param expression
	 * @param constraints
	 * @returns
	 */
	searchAssetGenerals(expression: expression, constraints?: JsonObject) {
		// not yet implemented
	}
	//#endregion Assets/General
	//#region Assets/Advanced
	/**
	 * Retrieves a list of all {@link AssetAdvanced}s in the given {@link Company}.
	 * @param companyId
	 * @param constraints
	 * @returns
	 */
	listAssetAdvanceds(companyId: ulong, constraints?: JsonObject) {
		return this.command<RepAssetAdvancedListByCompany>(new PayAssetAdvancedListByCompany({
			...constraints,
			company: { id: companyId },
		}));
	}
	/**
	 * Retrieves a given {@link AssetAdvanced} from the server by its {@link Asset.id}.
	 * @param id
	 * @returns
	 */
	getAssetAdvanced(id: ulong) {
		return this.command<RepAssetAdvancedGet>(new PayAssetAdvancedGet({
			asset: { id },
		}));
	}
	/**
	 * Searches all available companies for {@link AssetAdvanced}s that match the given expression.
	 * @param expression
	 * @param constraints
	 * @returns
	 */
	searchAssetAdvanceds(expression: expression, constraints?: JsonObject) {
		// not yet implemented
	}
	//#endregion Assets/Advanced
	//#region Assets/Dispatch
	/**
	 * Updates the given {@link Asset}'s {@link DispatchJob}s and optimizes the steps based on back-end logic.
	 * @param id
	 * @returns
	 */
	mergeAssetDispatch(json: JsonObject) {
		return this.command<RepAssetDispatchMerge>(new PayAssetDispatchMerge({
			assetDispatch: json,
		}));
	}
	//#endregion Assets/Dispatch
	//#region Assets/DispatchTasks
	/**
	 * Retrieves a list of all {@link DispatchTask}s in the given {@link Company}.
	 * @param companyId
	 * @param constraints
	 * @returns
	 */
	listDispatchTasks(companyId: ulong, constraints?: JsonObject) {
		return this.command<RepDispatchTaskListByCompany>(new PayDispatchTaskListByCompany({
			...constraints,
			company: { id: companyId },
		}));
	}
	/**
	 * Retrieves a list of all {@link DispatchTask}s for the given {@link Asset}.
	 * @param assetId
	 * @returns
	 */
	getDispatchTasksByAsset(assetId: ulong, constraints?: JsonObject) {
		return this.command<RepDispatchTaskListByAsset>(new PayDispatchTaskListByAsset({
			...constraints,
			asset: { id: assetId },
		}));
	}
	/**
	 * Retrieves a given {@link DispatchTask} from the server by its {@link DispatchTask.id}.
	 * @param id
	 * @returns
	 */
	getDispatchTask(id: ulong) {
		return this.command<RepDispatchTaskGet>(new PayDispatchTaskGet({
			dispatchTask: { id },
		}));
	}
	/**
	 * Creates a new, or updates an existing {@link DispatchTask}.
	 * @param json
	 * @returns
	 */
	mergeDispatchTask(json: JsonObject) {
		return this.command<RepDispatchTaskMerge>(new PayDispatchTaskMerge({
			dispatchTask: json,
		}));
	}
	/**
	 * Merges a batch of {@link DispatchTask}s.
	 * @param array
	 * @returns
	 */
	multiMergeDispatchTask(id: ulong) {
		return this.command<RepDispatchTaskBatchMerge>(new PayDispatchTaskBatchMerge({
			dispatchTask: { id },
		}));
	}
	/**
	 * Deletes a {@link DispatchTask}.
	 * @param id
	 * @returns
	 */
	removeDispatchTask(id: ulong) {
		return this.command<RepDispatchTaskDelete>(new PayDispatchTaskDelete({
			dispatchTask: { id },
		}));
	}
	/**
	 * Restores a deleted {@link DispatchTask}.
	 * @param id
	 * @returns
	 */
	restoreDispatchTask(id: ulong) {
		return this.command<RepDispatchTaskDelete>(new PayDispatchTaskRestore({
			dispatchTask: { id },
		}));
	}
	//#endregion Assets/DispatchTasks
	//#region Assets/DispatchJobs
	/**
	 * Retrieves a list of all {@link DispatchJob}s in the given {@link Company}.
	 * @param companyId
	 * @param constraints
	 * @returns
	 */
	listDispatchJobs(companyId: ulong, constraints?: JsonObject) {
		return this.command<RepDispatchJobListByCompany>(new PayDispatchJobListByCompany({
			...constraints,
			company: { id: companyId },
		}));
	}
	/**
	 * Retrieves a list of all {@link DispatchJob}s for the given {@link Asset}.
	 * @param assetId
	 * @returns
	 */
	getDispatchJobsByAsset(assetId: ulong, constraints?: JsonObject) {
		return this.command<RepDispatchJobListByAsset>(new PayDispatchJobListByAsset({
			...constraints,
			asset: { id: assetId },
		}));
	}
	/**
	 * Retrieves a given {@link DispatchJob} from the server by its {@link DispatchJob.id}.
	 * @param id
	 * @returns
	 */
	getDispatchJob(id: ulong) {
		return this.command<RepDispatchJobGet>(new PayDispatchJobGet({
			dispatchJob: { id },
		}));
	}
	/**
	 * Creates a new, or updates an existing {@link DispatchJob}.
	 * @param json
	 * @returns
	 */
	mergeDispatchJob(json: JsonObject) {
		return this.command<RepDispatchJobMerge>(new PayDispatchJobMerge({
			dispatchJob: json,
		}));
	}
	/**
	 * Merges a batch of {@link DispatchJob}s.
	 * @param array
	 * @returns
	 */
	multiMergeDispatchJob(id: ulong) {
		return this.command<RepDispatchJobBatchMerge>(new PayDispatchJobBatchMerge({
			dispatchJob: { id },
		}));
	}
	/**
	 * Deletes a {@link DispatchJob}.
	 * @param id
	 * @returns
	 */
	removeDispatchJob(id: ulong) {
		return this.command<RepDispatchJobDelete>(new PayDispatchJobDelete({
			dispatchJob: { id },
		}));
	}
	/**
	 * Restores a deleted {@link DispatchJob}.
	 * @param id
	 * @returns
	 */
	restoreDispatchJob(id: ulong) {
		return this.command<RepDispatchJobDelete>(new PayDispatchJobRestore({
			dispatchJob: { id },
		}));
	}
	/**
	 * Completes or progresses a {@link DispatchJob} (from the perspective of a driver, but by a dispatcher).
	 * @param json
	 * @returns
	 */
	changeDispatchJob(json: JsonObject) {
		return this.command<RepDispatchJobMerge>(new PayDispatchJobChange({
			dispatchJob: json,
		}));
	}
	/**
	 * Cancels a {@link DispatchJob} and removes it from the dispatcher's and driver's view.
	 * @param json
	 * @returns
	 */
	cancelDispatchJob(json: JsonObject) {
		return this.command<RepDispatchJobMerge>(new PayDispatchJobCancel({
			dispatchJob: json,
		}));
	}
	//#endregion Assets/DispatchJobs
	//#region Assets/Messages
	/**
	 * Retrieves a list of all {@link AssetMessage}s in the given {@link Company}.
	 * @param companyId
	 * @param constraints
	 * @returns
	 */
	listAssetMessages(companyId: ulong, constraints?: JsonObject) {
		return this.command<RepAssetMessageListByCompany>(new PayAssetMessageListByCompany({
			...constraints,
			company: { id: companyId },
		}));
	}
	/**
	 * Retrieves a list of all {@link AssetMessage}s for the given {@link Asset}.
	 * @param assetId
	 * @returns
	 */
	getAssetMessagesByAsset(assetId: ulong, constraints?: JsonObject) {
		return this.command<RepAssetMessageListByAsset>(new PayAssetMessageListByAsset({
			...constraints,
			asset: { id: assetId },
		}));
	}
	/**
	 * Retrieves a given {@link AssetMessage} from the server by its {@link Message.id}.
	 * @param id
	 * @returns
	 */
	getAssetMessage(id: ulong) {
		return this.command<RepAssetMessageGet>(new PayAssetMessageGet({
			message: { id },
		}));
	}
	/**
	 * Creates a new, or updates an existing {@link AssetMessage}.
	 * @param json
	 * @returns
	 */
	mergeAssetMessage(json: JsonObject) {
		return this.command<RepAssetMessageMerge>(new PayAssetMessageMerge({
			assetMessage: json,
		}));
	}
	/**
	 * Merges a batch of {@link AssetMessage}s.
	 * @param array
	 * @returns
	 */
	multiMergeAssetMessage(id: ulong) {
		return this.command<RepAssetMessageBatchMerge>(new PayAssetMessageBatchMerge({
			assetMessage: { id },
		}));
	}
	/**
	 * Deletes a {@link AssetMessage}.
	 * @param id
	 * @returns
	 */
	removeAssetMessage(id: ulong) {
		return this.command<RepAssetMessageDelete>(new PayAssetMessageDelete({
			assetMessage: { id },
		}));
	}
	/**
	 * Restores a deleted {@link AssetMessage}.
	 * @param id
	 * @returns
	 */
	restoreAssetMessage(id: ulong) {
		return this.command<RepAssetMessageDelete>(new PayAssetMessageRestore({
			assetMessage: { id },
		}));
	}
	//#endregion Assets/Messages

	//#region Places
	/**
	 * Retrieves a list of all {@link Place}s in the given {@link Company}.
	 * @param companyId
	 * @param constraints
	 * @returns
	 */
	listPlaces(companyId: ulong, constraints?: JsonObject) {
		return this.command<RepPlaceListByCompany>(new PayPlaceListByCompany({
			...constraints,
			company: { id: companyId },
		}));
	}
	/**
	 * Retrieves a given {@link Place} from the server by its {@link Place.id}.
	 * @param id
	 * @returns
	 */
	getPlace(id: ulong) {
		return this.command<RepPlaceGet>(new PayPlaceGet({
			place: { id },
		}));
	}
	/**
	 * Creates a new, or updates an existing {@link Place}.
	 * @param json
	 * @returns
	 */
	mergePlace(json: JsonObject) {
		return this.command<RepPlaceMerge>(new PayPlaceMerge({
			place: json,
		}));
	}
	/**
	 * Deletes a {@link Place}.
	 * @param id
	 * @returns
	 */
	removePlace(id: ulong) {
		return this.command<RepPlaceDelete>(new PayPlaceDelete({
			place: { id },
		}));
	}
	/**
	 * Restores a deleted {@link Place}.
	 * @param id
	 * @returns
	 */
	restorePlace(id: ulong) {
		return this.command<RepPlaceDelete>(new PayPlaceRestore({
			place: { id },
		}));
	}
	//#endregion Places

	//#region Providers
	/**
	 * Retrieves a list of all {@link Provider}s in the given {@link Company}.
	 * @param companyId
	 * @param constraints
	 * @returns
	 */
	listProviders(companyId: ulong, constraints?: JsonObject) {
		return this.command<RepProviderListByCompany>(new PayProviderListByCompany({
			...constraints,
			company: { id: companyId },
		}));
	}
	/**
	 * Retrieves a given {@link Provider} from the server by its {@link Provider.id}.
	 * @param id
	 * @returns
	 */
	getProvider(id: string) {
		return this.command<RepProviderGet>(new PayProviderGet({
			provider: { id },
		}));
	}
	/**
	 * Creates a new, or updates an existing {@link Provider}.
	 * @param json
	 * @returns
	 */
	mergeProvider(json: JsonObject) {
		return this.command<RepProviderMerge>(new PayProviderMerge({
			provider: json,
		}));
	}
	/**
	 * Merges a batch of {@link Provider}s.
	 * @param array
	 * @returns
	 */
	multiMergeProvider(array: JsonObject[]) {
		return this.command<RepProviderBatchMerge>(new PayProviderBatchMerge({
			providers: array,
		}));
	}
	/**
	 * Deletes a batch of {@link Provider}s.
	 * @param ids
	 * @returns
	 */
	multiRemoveProvider(ids: string[]) {
		return this.command<RepProviderBatchDelete>(new PayProviderBatchDelete({
			providers: ids.map(id => ({ id })),
		}));
	}
	/**
	 * Deletes an {@link Provider}.
	 * @param id
	 * @returns
	 */
	removeProvider(id: string) {
		return this.command<RepProviderDelete>(new PayProviderDelete({
			provider: { id },
		}));
	}
	/**
	 * Restores a deleted {@link Provider}.
	 * @param id
	 * @returns
	 */
	restoreProvider(id: string) {
		return this.command<RepProviderDelete>(new PayProviderRestore({
			provider: { id },
		}));
	}
	///**
	// * Suspends an {@link Provider}.
	// * @param id
	// * @returns
	// */
	//suspendProvider(id: string) {
	//	return this.command<RepProviderSuspend>(new PayProviderSuspend({
	//		provider: { id },
	//	}));
	//}
	///**
	// * Reactivates an {@link Provider}.
	// * @param id
	// * @returns
	// */
	//reviveProvider(id: string) {
	//	return this.command<RepProviderSuspend>(new PayProviderReactivate({
	//		provider: { id },
	//	}));
	//}
	/**
	 * Searches all available companies for {@link Provider}s that match the given expression.
	 * @param expression
	 * @param constraints
	 * @returns
	 */
	searchProviders(expression: expression, constraints?: JsonObject) {
		// not yet implemented
	}
	//#endregion Provider
	//#region Providers/General
	/**
	 * Retrieves a list of all {@link ProviderGeneral}s in the given {@link Company}.
	 * @param companyId
	 * @param constraints
	 * @returns
	 */
	listProviderGenerals(companyId: ulong, constraints?: JsonObject) {
		return this.command<RepProviderGeneralListByCompany>(new PayProviderGeneralListByCompany({
			...constraints,
			company: { id: companyId },
		}));
	}
	/**
	 * Retrieves a given {@link ProviderGeneral} from the server by its {@link Provider.id}.
	 * @param id
	 * @returns
	 */
	getProviderGeneral(id: string) {
		return this.command<RepProviderGeneralGet>(new PayProviderGeneralGet({
			provider: { id },
		}));
	}
	/**
	 * Searches all available companies for {@link ProviderGeneral}s that match the given expression.
	 * @param expression
	 * @param constraints
	 * @returns
	 */
	searchProviderGenerals(expression: expression, constraints?: JsonObject) {
		// not yet implemented
	}
	//#endregion Provider/General
	//#region Providers/Advanced
	/**
	 * Retrieves a list of all {@link ProviderAdvanced}s in the given {@link Company}.
	 * @param companyId
	 * @param constraints
	 * @returns
	 */
	listProviderAdvanceds(companyId: ulong, constraints?: JsonObject) {
		return this.command<RepProviderAdvancedListByCompany>(new PayProviderAdvancedListByCompany({
			...constraints,
			company: { id: companyId },
		}));
	}
	/**
	 * Retrieves a given {@link ProviderAdvanced} from the server by its {@link Provider.id}.
	 * @param id
	 * @returns
	 */
	getProviderAdvanced(id: string) {
		return this.command<RepProviderAdvancedGet>(new PayProviderAdvancedGet({
			provider: { id },
		}));
	}
	/**
	 * Searches all available companies for {@link ProviderAdvanced}s that match the given expression.
	 * @param expression
	 * @param constraints
	 * @returns
	 */
	searchProviderAdvanceds(expression: expression, constraints?: JsonObject) {
		// not yet implemented
	}
	//#endregion Provider/Advanced
	//#region Providers/Control
	/**
	 * Retrieves a list of all {@link ProviderControl}s in the given {@link Company}.
	 * @param companyId
	 * @param constraints
	 * @returns
	 */
	listProviderControls(companyId: ulong, constraints?: JsonObject) {
		return this.command<RepProviderControlListByCompany>(new PayProviderControlListByCompany({
			...constraints,
			company: { id: companyId },
		}));
	}
	/**
	 * Retrieves a given {@link ProviderControl} from the server by its {@link Provider.id}.
	 * @param id
	 * @returns
	 */
	getProviderControl(id: string) {
		return this.command<RepProviderControlGet>(new PayProviderControlGet({
			provider: { id },
		}));
	}
	/**
	 * Searches all available companies for {@link ProviderControl}s that match the given expression.
	 * @param expression
	 * @param constraints
	 * @returns
	 */
	searchProviderControls(expression: expression, constraints?: JsonObject) {
		// not yet implemented
	}
	//#endregion Provider/Control
	//#region Providers/Scripts
	/**
	 * Retrieves a list of all {@link ProviderScript}s in the trunk for the given {@link Company}.
	 * @param companyId
	 * @param constraints
	 * @returns
	 */
	listProviderScripts(companyId: ulong, constraints?: JsonObject) {
		return this.command<RepProviderScriptListByCompany>(new PayProviderScriptListByCompany({
			...constraints,
			company: { id: companyId },
		}));
	}
	/**
	 * Retrieves a given {@link ProviderScript} from the server by its {@link ProviderScript.id}.
	 * @param id
	 * @returns
	 */
	getProviderScript(id: ulong) {
		return this.command<RepProviderScriptGet>(new PayProviderScriptGet({
			providerScript: { id },
		}));
	}
	/**
	 * Creates a new, or updates an existing {@link ProviderScript}.
	 * @param json
	 * @returns
	 */
	mergeProviderScript(json: JsonObject) {
		return this.command<RepProviderScriptMerge>(new PayProviderScriptMerge({
			providerScript: json,
		}));
	}
	/**
	 * Deletes a {@link ProviderScript}.
	 * @param id
	 * @returns
	 */
	removeProviderScript(id: ulong) {
		return this.command<RepProviderScriptDelete>(new PayProviderScriptDelete({
			providerScript: { id },
		}));
	}
	/**
	 * Restores a deleted {@link ProviderScript}.
	 * @param id
	 * @returns
	 */
	restoreProviderScript(id: ulong) {
		return this.command<RepProviderScriptDelete>(new PayProviderScriptRestore({
			providerScript: { id },
		}));
	}
	//#endregion Providers/Scripts
	//#region Providers/Configs
	/**
	 * Retrieves a list of all {@link ProviderConfig}s in the given {@link Company}.
	 * @param companyId
	 * @param constraints
	 * @returns
	 */
	listProviderConfigs(companyId: ulong, constraints?: JsonObject) {
		return this.command<RepProviderConfigListByCompany>(new PayProviderConfigListByCompany({
			...constraints,
			company: { id: companyId },
		}));
	}
	/**
	 * Retrieves a given {@link ProviderConfig} from the server by its {@link ProviderConfig.id}.
	 * @param id
	 * @returns
	 */
	getProviderConfig(id: ulong) {
		return this.command<RepProviderConfigGet>(new PayProviderConfigGet({
			providerConfig: { id },
		}));
	}
	/**
	 * Creates a new, or updates an existing {@link ProviderConfig}.
	 * @param json
	 * @returns
	 */
	mergeProviderConfig(json: JsonObject) {
		return this.command<RepProviderConfigMerge>(new PayProviderConfigMerge({
			providerConfig: json,
		}));
	}
	/**
	 * Merges a batch of {@link ProviderConfig}s.
	 * @param array
	 * @returns
	 */
	multiMergeProviderConfig(id: ulong) {
		return this.command<RepProviderConfigBatchMerge>(new PayProviderConfigBatchMerge({
			providerConfig: { id },
		}));
	}
	/**
	 * Deletes a {@link ProviderConfig}.
	 * @param id
	 * @returns
	 */
	removeProviderConfig(id: ulong) {
		return this.command<RepProviderConfigDelete>(new PayProviderConfigDelete({
			providerConfig: { id },
		}));
	}
	/**
	 * Restores a deleted {@link ProviderConfig}.
	 * @param id
	 * @returns
	 */
	restoreProviderConfig(id: ulong) {
		return this.command<RepProviderConfigDelete>(new PayProviderConfigRestore({
			providerConfig: { id },
		}));
	}
	//#endregion Providers/Configs
	//#region Providers/Configurations
	/**
	 * Retrieves a list of all {@link ProviderConfiguration}s in the given {@link Company}.
	 * @param companyId
	 * @param constraints
	 * @returns
	 */
	listProviderConfigurations(companyId: ulong, constraints?: JsonObject) {
		return this.command<RepProviderConfigurationListByCompany>(new PayProviderConfigurationListByCompany({
			...constraints,
			company: { id: companyId },
		}));
	}
	/**
	 * Retrieves a given {@link ProviderConfiguration} from the server by its {@link ProviderConfiguration.id}.
	 * @param id
	 * @returns
	 */
	getProviderConfiguration(id: ulong) {
		return this.command<RepProviderConfigurationGet>(new PayProviderConfigurationGet({
			providerConfiguration: { id },
		}));
	}
	/**
	 * Creates a new, or updates an existing {@link ProviderConfiguration}.
	 * @param json
	 * @returns
	 */
	mergeProviderConfiguration(json: JsonObject) {
		return this.command<RepProviderConfigurationMerge>(new PayProviderConfigurationMerge({
			providerConfiguration: json,
		}));
	}
	/**
	 * Merges a batch of {@link ProviderConfiguration}s.
	 * @param array
	 * @returns
	 */
	multiMergeProviderConfiguration(id: ulong) {
		return this.command<RepProviderConfigurationBatchMerge>(new PayProviderConfigurationBatchMerge({
			providerConfiguration: { id },
		}));
	}
	/**
	 * Deletes a {@link ProviderConfiguration}.
	 * @param id
	 * @returns
	 */
	removeProviderConfiguration(id: ulong) {
		return this.command<RepProviderConfigurationDelete>(new PayProviderConfigurationDelete({
			providerConfiguration: { id },
		}));
	}
	/**
	 * Restores a deleted {@link ProviderConfiguration}.
	 * @param id
	 * @returns
	 */
	restoreProviderConfiguration(id: ulong) {
		return this.command<RepProviderConfigurationDelete>(new PayProviderConfigurationRestore({
			providerConfiguration: { id },
		}));
	}
	//#endregion Providers/Configurations
	//#region Providers/Registrations
	/**
	 * Retrieves a list of all {@link ProviderRegistration}s in the given {@link Company}.
	 * @param companyId
	 * @returns
	 */
	listProviderRegistration(companyId: ulong, constraints?: JsonObject) {
		return this.command<RepProviderRegistrationListByCompany>(new PayProviderRegistrationListByCompany({
			...constraints,
			company: { id: companyId },
		}));
	}
	/**
	 * Retrieves a given {@link ProviderRegistration} from the server by its {@link ProviderRegistration.id}.
	 * @param code
	 * @returns
	 */
	getProviderRegistration(code: int) {
		return this.command<RepProviderRegistrationGet>(new PayProviderRegistrationGet({
			providerRegistration: { id: code },
		}));
	}
	/**
	 * Creates a new {@link ProviderRegistration}.
	 * {@link ProviderRegistration}s cannot be updated, but they do expire on their own.
	 * You can also delete them using {@link removeProviderRegistration}.
	 * @param json
	 * @returns
	 */
	mergeProviderRegistration(json: JsonObject) {
		return this.command<RepProviderRegistrationMerge>(new PayProviderRegistrationMerge({
			providerRegistration: json,
		}));
	}
	/**
	 * Deletes a {@link ProviderRegistration}.
	 * @param code
	 * @returns
	 */
	removeProviderRegistration(code: int) {
		return this.command<RepProviderRegistrationDelete>(new PayProviderRegistrationDelete({
			providerRegistration: { id: code },
		}));
	}
	//#endregion Providers/Registrations

	//#region Behaviours
	/**
	 * Retrieves a list of all {@link Behaviour}s in the given {@link Company}.
	 * @param companyId
	 * @param constraints
	 * @returns
	 */
	listBehaviours(companyId: ulong, constraints?: JsonObject) {
		return this.command<RepBehaviourListByCompany>(new PayBehaviourListByCompany({
			...constraints,
			company: { id: companyId },
		}));
	}
	/**
	 * Retrieves a given {@link Behaviour} from the server by its {@link Behaviour.id}.
	 * @param id
	 * @returns
	 */
	getBehaviour(id: ulong) {
		return this.command<RepBehaviourGet>(new PayBehaviourGet({
			behaviour: { id },
		}));
	}
	/**
	 * Creates a new, or updates an existing {@link Behaviour}.
	 * @param json
	 * @returns
	 */
	mergeBehaviour(json: JsonObject) {
		return this.command<RepBehaviourMerge>(new PayBehaviourMerge({
			behaviour: json,
		}));
	}
	/**
	 * Merges a batch of {@link Behaviour}s.
	 * @param array
	 * @returns
	 */
	multiMergeBehaviour(id: ulong) {
		return this.command<RepBehaviourBatchMerge>(new PayBehaviourBatchMerge({
			behaviour: { id },
		}));
	}
	/**
	 * Deletes a {@link Behaviour}.
	 * @param id
	 * @returns
	 */
	removeBehaviour(id: ulong) {
		return this.command<RepBehaviourDelete>(new PayBehaviourDelete({
			behaviour: { id },
		}));
	}
	/**
	 * Restores a deleted {@link Behaviour}.
	 * @param id
	 * @returns
	 */
	restoreBehaviour(id: ulong) {
		return this.command<RepBehaviourDelete>(new PayBehaviourRestore({
			behaviour: { id },
		}));
	}
	//#endregion Behaviours
	//#region Behaviours/Scripts
	/**
	 * Retrieves a list of all {@link BehaviourScript}s in the trunk for the given {@link Company}.
	 * @param companyId
	 * @param constraints
	 * @returns
	 */
	listBehaviourScripts(companyId: ulong, constraints?: JsonObject) {
		return this.command<RepBehaviourScriptListByCompany>(new PayBehaviourScriptListByCompany({
			...constraints,
			company: { id: companyId },
		}));
	}
	/**
	 * Retrieves a given {@link BehaviourScript} from the server by its {@link BehaviourScript.id}.
	 * @param id
	 * @returns
	 */
	getBehaviourScript(id: ulong) {
		return this.command<RepBehaviourScriptGet>(new PayBehaviourScriptGet({
			behaviourScript: { id },
		}));
	}
	/**
	 * Creates a new, or updates an existing {@link Behaviour}.
	 * @param json
	 * @returns
	 */
	mergeBehaviourScript(json: JsonObject) {
		return this.command<RepBehaviourScriptMerge>(new PayBehaviourScriptMerge({
			behaviourScript: json,
		}));
	}
	/**
	 * Deletes a {@link Behaviour}.
	 * @param id
	 * @returns
	 */
	removeBehaviourScript(id: ulong) {
		return this.command<RepBehaviourScriptDelete>(new PayBehaviourScriptDelete({
			behaviourScript: { id },
		}));
	}
	/**
	 * Restores a deleted {@link Behaviour}.
	 * @param id
	 * @returns
	 */
	restoreBehaviourScript(id: ulong) {
		return this.command<RepBehaviourScriptDelete>(new PayBehaviourScriptRestore({
			behaviourScript: { id },
		}));
	}
	//#endregion Behaviours/Scripts
	//#region Behaviours/Logs
	/**
	 * Retrieves a list of all {@link BehaviourLog}s from the given {@link Asset}.
	 * @param behaviourId
	 * @returns
	 */
	listBehaviourAssetLogs(behaviourId: ulong, constraints?: JsonObject) {
		return this.command<RepBehaviourLogListByAsset>(new PayBehaviourLogListByAsset({
			...constraints,
			behaviour: { id: behaviourId },
		}));
	}
	/**
	 * Deletes all the {@link BehaviourLog}s from the given {@link Asset}.
	 * @param behaviourId
	 * @returns
	 */
	clearBehaviourAssetLogs(behaviourId: ulong) {
		return this.command<RepBehaviourLogBatchDeleteByAsset>(new PayBehaviourLogBatchDeleteByAsset({
			behaviour: { id: behaviourId },
		}));
	}
	/**
	 * Retrieves a list of all {@link BehaviourLog}s from the given {@link Behaviour}.
	 * @param behaviourId
	 * @returns
	 */
	listBehaviourLogs(behaviourId: ulong, constraints?: JsonObject) {
		return this.command<RepBehaviourLogListByBehaviour>(new PayBehaviourLogListByBehaviour({
			...constraints,
			behaviour: { id: behaviourId },
		}));
	}
	/**
	 * Deletes all the {@link BehaviourLog}s from the given {@link Behaviour}.
	 * @param behaviourId
	 * @returns
	 */
	clearBehaviourLogs(behaviourId: ulong) {
		return this.command<RepBehaviourLogBatchDeleteByBehaviour>(new PayBehaviourLogBatchDeleteByBehaviour({
			behaviour: { id: behaviourId },
		}));
	}
	/**
	 * Retrieves a list of all {@link BehaviourLog}s from the given {@link BehaviourScript}.
	 * @param scriptId
	 * @returns
	 */
	listBehaviourScriptLogs(scriptId: ulong, constraints?: JsonObject) {
		return this.command<RepBehaviourLogListByScript>(new PayBehaviourLogListByScript({
			...constraints,
			behaviourScript: { id: scriptId },
		}));
	}
	/**
	 * Deletes all the {@link BehaviourLog}s from the given {@link BehaviourScript}.
	 * @param scriptId
	 * @returns
	 */
	clearBehaviourScriptLogs(scriptId: ulong, constraints?: JsonObject) {
		return this.command<RepBehaviourLogBatchDeleteByScript>(new PayBehaviourLogBatchDeleteByScript({
			...constraints,
			behaviourScript: { id: scriptId },
		}));
	}
	//#endregion Behaviours/Logs

	//#region Reports/Templates
	/**
	 * Retrieves a list of all {@link ReportTemplate}s in the given {@link Company}.
	 * @param companyId
	 * @param constraints
	 * @returns
	 */
	listReportTemplates(companyId: ulong, constraints?: JsonObject) {
		return this.command<RepReportTemplateListByCompany>(new PayReportTemplateListByCompany({
			...constraints,
			company: { id: companyId },
		}));
	}
	/**
	 * Retrieves a given {@link ReportTemplate} from the server by its {@link ReportTemplate.id}.
	 * @param id
	 * @returns
	 */
	getReportTemplate(id: ulong) {
		return this.command<RepReportTemplateGet>(new PayReportTemplateGet({
			reportTemplate: { id },
		}));
	}
	/**
	 * Creates a new, or updates an existing {@link ReportTemplate}.
	 * @param json
	 * @returns
	 */
	mergeReportTemplate(json: JsonObject) {
		return this.command<RepReportTemplateMerge>(new PayReportTemplateMerge({
			reportTemplate: json,
		}));
	}
	/**
	 * Deletes a {@link ReportTemplate}.
	 * @param id
	 * @returns
	 */
	removeReportTemplate(id: ulong) {
		return this.command<RepReportTemplateDelete>(new PayReportTemplateDelete({
			reportTemplate: { id },
		}));
	}
	/**
	 * Restores a deleted {@link ReportTemplate}.
	 * @param id
	 * @returns
	 */
	restoreReportTemplate(id: ulong) {
		return this.command<RepReportTemplateDelete>(new PayReportTemplateRestore({
			reportTemplate: { id },
		}));
	}
	//#endregion Reports/Templates
	//#region Reports/Schedules
	/**
	 * Retrieves a list of all {@link ReportSchedule}s in the given {@link Company}.
	 * @param companyId
	 * @param constraints
	 * @returns
	 */
	listReportSchedules(companyId: ulong, constraints?: JsonObject) {
		return this.command<RepReportScheduleListByCompany>(new PayReportScheduleListByCompany({
			...constraints,
			company: { id: companyId },
		}));
	}
	/**
	 * Retrieves a given {@link ReportSchedule} from the server by its {@link ReportSchedule.id}.
	 * @param id
	 * @returns
	 */
	getReportSchedule(id: ulong) {
		return this.command<RepReportScheduleGet>(new PayReportScheduleGet({
			reportSchedule: { id },
		}));
	}
	/**
	 * Creates a new, or updates an existing {@link ReportSchedule}.
	 * @param json
	 * @returns
	 */
	mergeReportSchedule(json: JsonObject) {
		return this.command<RepReportScheduleMerge>(new PayReportScheduleMerge({
			reportSchedule: json,
		}));
	}
	/**
	 * Deletes a {@link ReportSchedule}.
	 * @param id
	 * @returns
	 */
	removeReportSchedule(id: ulong) {
		return this.command<RepReportScheduleDelete>(new PayReportScheduleDelete({
			reportSchedule: { id },
		}));
	}
	/**
	 * Restores a deleted {@link ReportSchedule}.
	 * @param id
	 * @returns
	 */
	restoreReportSchedule(id: ulong) {
		return this.command<RepReportScheduleDelete>(new PayReportScheduleRestore({
			reportSchedule: { id },
		}));
	}
	//#endregion Reports/Schedules
	//#region Reports/Results
	/**
	 * Retrieves a list of all {@link ReportResult}s in the given {@link Company}.
	 * @param companyId
	 * @param constraints
	 * @returns
	 */
	listReportResults(companyId: ulong, constraints?: JsonObject) {
		return this.command<RepReportResultListByCompany>(new PayReportResultListByCompany({
			...constraints,
			company: { id: companyId },
		}));
	}
	/**
	 * Retrieves a given {@link ReportResult} from the server by its {@link ReportResult.id}.
	 * @param id
	 * @returns
	 */
	getReportResult(id: ulong) {
		return this.command<RepReportResultGet>(new PayReportResultGet({
			reportResult: { id },
		}));
	}
	/**
	 * Creates a new, or updates an existing {@link ReportResult}.
	 * @param json
	 * @returns
	 */
	mergeReportResult(json: JsonObject) {
		return this.command<RepReportResultMerge>(new PayReportResultMerge({
			reportResult: json,
		}));
	}
	/**
	 * Deletes a {@link ReportResult}.
	 * @param id
	 * @returns
	 */
	removeReportResult(id: ulong) {
		return this.command<RepReportResultDelete>(new PayReportResultDelete({
			reportResult: { id },
		}));
	}
	/**
	 * Restores a deleted {@link ReportResult}.
	 * @param id
	 * @returns
	 */
	restoreReportResult(id: ulong) {
		return this.command<RepReportResultDelete>(new PayReportResultRestore({
			reportResult: { id },
		}));
	}
	//#endregion Reports/Results

	//#region Maintenance/Schedules
	/**
	 * Retrieves a list of all {@link MaintenanceSchedule}s in the given {@link Company}.
	 * @param companyId
	 * @param constraints
	 * @returns
	 */
	listMaintenanceSchedules(companyId: ulong, constraints?: JsonObject) {
		return this.command<RepMaintenanceScheduleListByCompany>(new PayMaintenanceScheduleListByCompany({
			...constraints,
			company: { id: companyId },
		}));
	}
	/**
	 * Retrieves a given {@link MaintenanceSchedule} from the server by its {@link MaintenanceSchedule.id}.
	 * @param id
	 * @returns
	 */
	getMaintenanceSchedule(id: ulong) {
		return this.command<RepMaintenanceScheduleGet>(new PayMaintenanceScheduleGet({
			maintenanceSchedule: { id },
		}));
	}
	/**
	 * Creates a new, or updates an existing {@link MaintenanceSchedule}.
	 * @param json
	 * @returns
	 */
	mergeMaintenanceSchedule(json: JsonObject) {
		return this.command<RepMaintenanceScheduleMerge>(new PayMaintenanceScheduleMerge({
			maintenanceSchedule: json,
		}));
	}
	/**
	 * Deletes a {@link MaintenanceSchedule}.
	 * @param id
	 * @returns
	 */
	removeMaintenanceSchedule(id: ulong) {
		return this.command<RepMaintenanceScheduleDelete>(new PayMaintenanceScheduleDelete({
			maintenanceSchedule: { id },
		}));
	}
	/**
	 * Restores a deleted {@link MaintenanceSchedule}.
	 * @param id
	 * @returns
	 */
	restoreMaintenanceSchedule(id: ulong) {
		return this.command<RepMaintenanceScheduleDelete>(new PayMaintenanceScheduleRestore({
			maintenanceSchedule: { id },
		}));
	}
	//#endregion Maintenance/Schedules
	//#region Maintenance/Jobs
	/**
	 * Retrieves a list of all {@link MaintenanceJob}s in the given {@link Company}.
	 * @param companyId
	 * @param constraints
	 * @returns
	 */
	listMaintenanceJobs(companyId: ulong, constraints?: JsonObject) {
		return this.command<RepMaintenanceJobListByCompany>(new PayMaintenanceJobListByCompany({
			...constraints,
			company: { id: companyId },
		}));
	}
	/**
	 * Retrieves a given {@link MaintenanceJob} from the server by its {@link MaintenanceJob.id}.
	 * @param id
	 * @returns
	 */
	getMaintenanceJob(id: ulong) {
		return this.command<RepMaintenanceJobGet>(new PayMaintenanceJobGet({
			maintenanceJob: { id },
		}));
	}
	/**
	 * Creates a new, or updates an existing {@link MaintenanceJob}.
	 * @param json
	 * @returns
	 */
	mergeMaintenanceJob(json: JsonObject) {
		return this.command<RepMaintenanceJobMerge>(new PayMaintenanceJobMerge({
			maintenanceJob: json,
		}));
	}
	/**
	 * Deletes a {@link MaintenanceJob}.
	 * @param id
	 * @returns
	 */
	removeMaintenanceJob(id: ulong) {
		return this.command<RepMaintenanceJobDelete>(new PayMaintenanceJobDelete({
			maintenanceJob: { id },
		}));
	}
	/**
	 * Restores a deleted {@link MaintenanceJob}.
	 * @param id
	 * @returns
	 */
	restoreMaintenanceJob(id: ulong) {
		return this.command<RepMaintenanceJobDelete>(new PayMaintenanceJobRestore({
			maintenanceJob: { id },
		}));
	}
	//#endregion Maintenance/Jobs
}