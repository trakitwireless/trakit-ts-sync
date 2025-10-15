import {
	ErrorCode,
	PaySelfContact,
	PaySelfGet,
	PaySelfLogin,
	PaySelfLogout,
	PaySelfPassword,
	PaySelfPreferences,
	RepCompanyGeneralGet,
	Reply,
	RepSelfGet,
	RepSelfLogout,
	RepSelfPassword,
} from '@trakit/commands';
import {
	expression,
	guid,
	int,
	JsonObject,
	nothing,
	serialization,
	storage,
	SystemsOfUnits,
	Timezone,
	ulong,
	url,
	UserNotifications,
	utility,
} from '@trakit/objects';
import { TrakitCommander } from './TrakitCommander';


//#region Mindflayer helpers
/**
 * A mapping of object type to Mindflayer path (or path suffix).
 * If an object type is not in the map, then use the plural of the object type.
 * @const {!Object.<string,string>}
 **/
var MINDFLAYER_PATHS = {
	"assetMessage": "assets/messages",
	"behaviourScript": "behaviours/scripts",
	"dispatchJob": "dispatch/jobs",
	"dispatchTask": "dispatch/tasks",
	"formResult": "forms",
	"formTemplate": "forms/templates",
	"hosCarrier": "hos/carriers",
	"maintenanceJob": "maintenance/jobs",
	"maintenanceSchedule": "maintenance/schedules",
	"providerConfig": "providers/configs",
	"providerConfiguration": "providers/configurations",
	"providerRegistration": "providers/registrations",
	"providerScript": "providers/scripts",
	"reportResult": "reports/results",
	"reportSchedule": "reports/schedules",
	"reportTemplate": "reports/templates",
	"userGroup": "users/groups",
};
/**
 * Returns an object
 * @param {!string} type
 * @param {!trakit.json.BaseResponse} response
 * @return {!Object}
 **/
function MINDFLAYER_RESPONSE_WITHOUT_PAYLOAD(type, response) {
	return GET_KEYS(response).reduce(function(json, key) {
		if (key !== type) json[key] = response[key];
		return json;
	}, {
		"errorCode": 1,	// unknown
	});
}
/**
 * Creates query-string parameters for requests to Mindflayer.
 * @param {string=} path
 * @param {ParamListConstraints=} constraints
 * @return {!string}
 */
function MINDFLAYER_CONSTRAINT_QUERY_STRING(path, constraints) {
	var query = [];
	if (constraints) {
		var after, before;
		if (constraints["includeDeleted"]) query.push("includeDeleted=" + (!!constraints["includeDeleted"]));
		if (constraints["includeArchive"]) query.push("includeArchive=" + (!!constraints["includeArchive"]));
		if (!isNaN(constraints["limit"])) query.push("limit=" + ROUND(constraints["limit"]));
		if (!isNaN(constraints["lowest"])) query.push("lowest=" + ROUND(constraints["lowest"]));
		if (!isNaN(constraints["highest"])) query.push("highest=" + ROUND(constraints["highest"]));
		if ((after = DATE(constraints["after"])).isValid()) query.push("after=" + ESCAPE(after.toISOString()));
		if ((before = DATE(constraints["before"])).isValid()) query.push("before=" + ESCAPE(before.toISOString()));
		if (!!constraints["first"]) query.push("first=" + String(constraints["first"]).trim());
		if (!!constraints["last"]) query.push("last=" + String(constraints["last"]).trim());
		if (constraints["includeSuspended"]) query.push("includeSuspended=" + (!!constraints["includeSuspended"]));
		if (constraints["includeMessages"]) query.push("includeMessages=" + (!!constraints["includeMessages"]));
		if (constraints["includeTasks"]) query.push("includeTasks=" + (!!constraints["includeTasks"]));
		if (constraints["tree"]) query.push("tree=" + (!!constraints["tree"]));
		if (constraints["includeParent"]) query.push("includeParent=" + (!!constraints["includeParent"]));
		if (constraints["kind"]) query.push("kind=" + constraints["kind"]);
		if (constraints["branch"]) query.push("branch=" + (!!constraints["branch"]));
		if (constraints["trunk"]) query.push("trunk=" + (!!constraints["trunk"]));
		if (constraints["pending"]) query.push("pending=" + (!!constraints["pending"]));
	}
	return query.length
		? ((path || "").includes("?") ? "&" : "?") + query.join("&")
		: "";
}
/**
 * Sends a request to list objects by their company.
 * Also fires the list event same as {@link SyncClient#sync}.
 * @param {!string} type
 * @param {!number} companyId
 * @param {string=} path
 * @param {ParamListConstraints=} constraints
 * @return {!Promise<SyncMindflayer>}
 **/
function MINDFLAYER_LIST_BY_COMPANY(type, companyId, path, constraints) {
	return CLIENT.mindflayer(
		"companies/"
		+ (IS_NAN(companyId) ? SELECTED.id : companyId)
		+ "/"
		+ (path || MINDFLAYER_PATHS[type] || PLURAL(type))
		+ MINDFLAYER_CONSTRAINT_QUERY_STRING(path, constraints)
	).next(function(/** SyncMindflayer */ msg) {
		var response = MINDFLAYER_RESPONSE_WITHOUT_PAYLOAD(type, msg.response);
		if (msg.response.errorCode === 0) {
			response[PLURAL(type)] = SyncClient_list(type, msg.response);
		}
		me.fire(type + "List", response);
		return Promise[msg.response.errorCode === 0 ? "resolve" : "reject"](msg);
	});
}
/**
 * Sends a request to list objects by their asset.
 * @param {!string} type
 * @param {!number} assetId
 * @param {string=} path
 * @param {ParamListConstraints=} constraints
 * @return {!Promise<SyncMindflayer>}
 **/
function MINDFLAYER_LIST_BY_ASSET(type, assetId, path, constraints) {
	return CLIENT.mindflayer("assets/" + assetId + "/" + (path || MINDFLAYER_PATHS[type] || PLURAL(type)) + MINDFLAYER_CONSTRAINT_QUERY_STRING(path, constraints)).next(function(/** SyncMindflayer */ msg) {
		var response = MINDFLAYER_RESPONSE_WITHOUT_PAYLOAD(type, msg.response);
		if (msg.response.errorCode === 0) {
			response[PLURAL(type)] = msg.response.map(function(json) {
				return SyncClient_merged(type, json);
			});
		}
		me.fire(type + "AssetList", response);
		return Promise[msg.response.errorCode === 0 ? "resolve" : "reject"](msg);
	});
}
/**
 * Sends a request to get a specific object.
 * @param {!string} type
 * @param {!number|string} id
 * @param {string=} path
 * @return {!Promise<SyncMindflayer>}
 **/
function MINDFLAYER_GET(type, id, path) {
	return CLIENT.mindflayer(((path || MINDFLAYER_PATHS[type] || PLURAL(type)) + "/" + id).pruneEnd("/")).next(function(/** SyncMindflayer */ msg) {
		if (msg.response.errorCode === 0) {
			var updated = [],
				object = SyncClient_merged(
					type,
					msg.response[type],
					updated
				);
			// because the {@link type} could be a value like "provider", we don't want to fire "providerMerged" instead of "providerGeneralMerged".
			// so we use the {@link SUBSCRIPTION_SPLITS} map to find all the events we need to fire
			(SUBSCRIPTION_SPLITS[type] || [type]).forEach(function(region, index) {
				// however, we don't want to fire all events in case one of the parts is not updated.
				// so we check that each part has changed (based on comparison of version keys) and only fire the appropriate events
				if (updated[index]) me.fire(region + "Merged", object);
			});
		}
		return Promise[msg.response.errorCode === 0 ? "resolve" : "reject"](msg);
	});
}
/**
 * Sends a request to merge an object.
 * Can also be used for batch operations if the PATCH verb is specified.
 * @param {!string} path
 * @param {!Object} json
 * @param {string=} verb
 * @return {!Promise<SyncMindflayer>}
 **/
function MINDFLAYER_MERGE(type, json, path, verb) {
	var body = {};
	body[type] = json;
	return CLIENT.mindflayer(path || MINDFLAYER_PATHS[type] || PLURAL(type), verb || "POST", body).next(function(/** SyncMindflayer */ msg) {
		if (msg.response.errorCode === 0) {// && (json["v"] || []).length === 0) {
			var updated = [],						// an array of parts that were updated.
				object = SyncClient_merged(
					type,
					MERGE(json, msg.response[type]),	// merge request with response
					updated
				);
			// because the {@link type} could be a value like "provider", we don't want to fire "providerMerged" instead of "providerGeneralMerged".
			// so we use the {@link SUBSCRIPTION_SPLITS} map to find all the events we need to fire
			(SUBSCRIPTION_SPLITS[type] || [type]).forEach(function(region, index) {
				// however, we don't want to fire all events in case one of the parts is not updated.
				// so we check that each part has changed (based on comparison of version keys) and only fire the appropriate events
				if (updated[index]) me.fire(region + "Merged", object);
			});
		}
		return Promise[msg.response.errorCode === 0 ? "resolve" : "reject"](msg);
	});
}
/**
 * Sends a request to delete an object.
 * @param {!string} path
 * @param {!number|string} id
 * @return {!Promise<SyncMindflayer>}
 **/
function MINDFLAYER_DELETE(type, id, path) {
	return CLIENT.mindflayer(((path || MINDFLAYER_PATHS[type] || PLURAL(type)) + "/" + id).pruneEnd("/"), "DELETE").next(function(/** SyncMindflayer */ msg) {
		if (msg.response.errorCode === 0) {
			var object = SyncClient_deleted(type, msg.response[type]);
			// we DO NOT use the {@link SUBSCRIPTION_SPLITS} map because the deleted message is "providerDeleted" instead of "providerGeneralDeleted".
			if (object) me.fire(type + "Deleted", object);
		}
		return Promise[msg.response.errorCode === 0 ? "resolve" : "reject"](msg);
	});
}
/**
 * Sends a request to restore a deleted object.
 * @param {!string} path
 * @param {!number|string} id
 * @return {!Promise<SyncMindflayer>}
 **/
function MINDFLAYER_RESTORE(type, id, path) {
	return CLIENT.mindflayer((path || MINDFLAYER_PATHS[type] || PLURAL(type)) + "/" + id + "/restore", "PATCH").next(function(/** SyncMindflayer */ msg) {
		if (msg.response.errorCode === 0) {
			var updated = [],
				object = SyncClient_merged(
					type,
					msg.response[type],
					updated
				),
				// because the {@link type} could be a value like "provider", we don't want to fire "providerMerged" instead of "providerGeneralMerged".
				// so we use the {@link SUBSCRIPTION_SPLITS} map to find the first region on which to fire the event
				region = (SUBSCRIPTION_SPLITS[type] || [type])[0];
			me.fire(region + "Merged", object);
		}
		return Promise[msg.response.errorCode === 0 ? "resolve" : "reject"](msg);
	});
}
/**
 * Sends a request to suspend an object.
 * @param {!string} path
 * @param {!number|string} id
 * @return {!Promise<SyncMindflayer>}
 **/
function MINDFLAYER_SUSPEND(type, id, path) {
	return CLIENT.mindflayer((path || MINDFLAYER_PATHS[type] || PLURAL(type)) + "/" + id + "/suspend", "PATCH").next(function(/** SyncMindflayer */ msg) {
		if (msg.response.errorCode === 0) {
			var updated = [],
				object = SyncClient_merged(
					type,
					msg.response[type],
					updated
				),
				// because the {@link type} could be a value like "provider", we don't want to fire "providerMerged" instead of "providerGeneralMerged".
				// so we use the {@link SUBSCRIPTION_SPLITS} map to find the first region on which to fire the event
				region = (SUBSCRIPTION_SPLITS[type] || [type])[0];
			me.fire(region + "Merged", object);
		}
		return Promise[msg.response.errorCode === 0 ? "resolve" : "reject"](msg);
	});
}
/**
 * Sends a request to revive an object.
 * @param {!string} path
 * @param {!number|string} id
 * @return {!Promise<SyncMindflayer>}
 **/
function MINDFLAYER_REVIVE(type, id, path) {
	return CLIENT.mindflayer((path || MINDFLAYER_PATHS[type] || PLURAL(type)) + "/" + id + "/revive", "PATCH").next(function(/** SyncMindflayer */ msg) {
		if (msg.response.errorCode === 0) {
			var updated = [],
				object = SyncClient_merged(
					type,
					msg.response[type],
					updated
				),
				// because the {@link type} could be a value like "provider", we don't want to fire "providerMerged" instead of "providerGeneralMerged".
				// so we use the {@link SUBSCRIPTION_SPLITS} map to find the first region on which to fire the event
				region = (SUBSCRIPTION_SPLITS[type] || [type])[0];
			me.fire(region + "Merged", object);
		}
		return Promise[msg.response.errorCode === 0 ? "resolve" : "reject"](msg);
	});
}
/**
 * Sends a request to do a batch operation on the given array of object JSONs.
 * @param {!string} path
 * @param {!Array.<Object>} array
 * @param {string=} verb
 * @return {!Promise<SyncMindflayer>}
 **/
function MINDFLAYER_MULTI_MERGE(type, array, path, verb) {
	var body = {},
		types = PLURAL(type);
	body[types] = array;
	return CLIENT.mindflayer(path || MINDFLAYER_PATHS[type] || types, verb || "PATCH", body).next(function(/** SyncMindflayer */ msg) {
		if (msg.response.errorCode === 0) {
			msg.response[types].map(function(json, index) {
				var updated = [],
					object = SyncClient_merged(
						type,
						json,
						updated
					);
				// because the {@link type} could be a value like "provider", we don't want to fire "providerMerged" instead of "providerGeneralMerged".
				// so we use the {@link SUBSCRIPTION_SPLITS} map to find all the events we need to fire
				(SUBSCRIPTION_SPLITS[type] || [type]).forEach(function(region, index) {
					// however, we don't want to fire all events in case one of the parts is not updated.
					// so we check that each part has changed (based on comparison of version keys) and only fire the appropriate events
					if (updated[index]) me.fire(region + "Merged", object);
				});
			});
		}
		return Promise[msg.response.errorCode === 0 ? "resolve" : "reject"](msg);
	});
}
/**
 * Sends a request to do a batch delete on the given array of object JSONs.
 * @param {!string} path
 * @param {!Array.<Object>} array
 * @param {string=} verb
 * @return {!Promise<SyncMindflayer>}
 **/
function MINDFLAYER_MULTI_DELETE(type, array, path, verb) {
	var body = {},
		types = PLURAL(type);
	body[types] = array;
	return CLIENT.mindflayer(path || MINDFLAYER_PATHS[type] || types, verb || "DELETE", body).next(function(/** SyncMindflayer */ msg) {
		if (msg.response.errorCode === 0) {
			msg.response[types].map(function(json, index) {
				var object = SyncClient_deleted(type, json);
				// we DO NOT use the {@link SUBSCRIPTION_SPLITS} map because the deleted message is "providerDeleted" instead of "providerGeneralDeleted".
				if (object) me.fire(type + "Deleted", object);
			});
		}
		return Promise[msg.response.errorCode === 0 ? "resolve" : "reject"](msg);
	});
}
/**
 * Sends a request to search for objects by the given expression.
 * @param {!string} type
 * @param {!string} expression
 * @param {string=} path
 * @param {ParamListConstraints=} constraints
 * @return {!Promise<SyncMindflayer>}
 **/
function MINDFLAYER_SEARCH(type, expression, path, constraints) {
	return CLIENT.mindflayer(
		MINDFLAYER_CONSTRAINT_QUERY_STRING(
			(path || MINDFLAYER_PATHS[type] || PLURAL(type))
			+ "?search=" + ESCAPE(expression),
			constraints
		)
	).next(function(/** SyncMindflayer */ msg) {
		var response = MINDFLAYER_RESPONSE_WITHOUT_PAYLOAD(type, msg.response);
		if (msg.response.errorCode === 0) {
			response[PLURAL(type)] = msg.response.map(function(json) {
				return SyncClient_merged(type, json);
			});
		}
		//me.fire(type + "Search", response);	=> do this?
		return Promise[msg.response.errorCode === 0 ? "resolve" : "reject"](msg);
	});
}
//#endregion Mindflayer helpers

//#region Behaviours/Logs
/**
 * Finds the given company and removes all the logs returned using the filter argument.
 * @param {!number} companyId
 * @param {!function(trakit.fleetfreedom.BehaviourLog):boolean} filter
 **/
function BEHAVIOUR_LOG_PURGE(companyId: ulong, filter) {
	var company = COMPANIES.get(companyId: ulong);
	if (company) {
		company.behaviourLogs.filter(filter).forEach(function(log) {
			company.removeBehaviourLog(log.id);
		});
	}
}
/**
 * The name of the {@link trakit.fleetfreedom.BehaviourLog} type.
 * @const {string}
 **/
var BEHAVIOUR_LOG_TYPE = "behaviourLog";
/**
 * The name of the {@link trakit.fleetfreedom.BehaviourLog} type.
 * @const {string}
 **/
var BEHAVIOUR_LOG_TYPES = BEHAVIOUR_LOG_TYPE + "s";
/**
 * Name of the event fired when loading a list of logs by {@link trakit.fleetfreedom.Behaviour}.
 * @const {string}
 **/
var BEHAVIOUR_LOG_BEHAVE_EVENT = BEHAVIOUR_LOG_TYPE + "BehaviourList";
/**
 * Name of the event fired when loading a list of logs by {@link trakit.fleetfreedom.BehaviourScript}.
 * @const {string}
 **/
var BEHAVIOUR_LOG_SCRIPT_EVENT = BEHAVIOUR_LOG_TYPE + "BehaviourScriptList";
//#endregion Behaviours/Logs



/**
 * The base class used to help define interaction with all Trak-iT API services.
 */
export abstract class TrakitObjectCommander<TRequest> extends TrakitCommander<TRequest> {
	/**
	 * Details of the {@link User} or {@link Machine} who is connected to the underlying Trak-iT API service.
	 */
	account: RepSelfGet;
    
	constructor(baseAddress?: url | nothing) {
		super(baseAddress);
		this.account = new RepSelfGet;
	}
	
	//#region Self
	/**
	 * Requests the details of the {@link User} or {@link Machine} currently identified.
	 * @returns The account details or null.
	 */
	public async getSelfDetails(): Promise<RepSelfGet> {
		const reply = await this.command<RepSelfGet>(new PaySelfGet());
		switch (reply.errorCode) {
			case ErrorCode.success:
			case ErrorCode.passwordExpired:
			case ErrorCode.sessionExpired:
			case ErrorCode.userNotLoggedIn:
				this.account = reply;
				break;
			default:
				this.account = new RepSelfGet;
				break;
		}
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
		if (this.account.errorCode == ErrorCode.success) {
			this.setAuth(this.account.ghostId);
		}
		return this.account;
	}
	/**
	 * Sends a logout command, and if successful, removes the current session using setAuth().
	 * @returns The logout response.
	 */
	public async logout(): Promise<RepSelfLogout> {
		const reply = this.command<RepSelfLogout>(new PaySelfLogout());
		this.setAuth();
		this.account = new RepSelfGet;
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
	getCompanies(id: ulong, constraints: JsonObject) {
		return this.command<RepCompanyGeneralListByCompany>(new PayCompanyGeneralListByCompany({
			...constraints,
			id,
		}));
	}
	/**
	 * Retrieves a given company from the server by its {@link trakit.fleetfreedom.Company#id}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getCompany(id: ulong) { return MINDFLAYER_GET("company", id); };
	/**
	 * Merges a {@link trakit.fleetfreedom.Company}.
	 * @expose
	 * @param {!trakit.json.Company} json
	 * @return {!Promise<SyncMindflayer>}
	 **/
	mergeCompany(json: JsonObject) { return MINDFLAYER_MERGE("company", json); };
	/**
	 * Deletes a {@link trakit.fleetfreedom.Company}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	removeCompany(id: ulong) { return MINDFLAYER_DELETE("company", id); };
	/**
	 * Restores a deleted {@link trakit.fleetfreedom.Company}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	restoreCompany(id: ulong) { return MINDFLAYER_RESTORE("company", id); };
	//#endregion Companies
	//#region Companies/Reseller
	/**
	 * Retrieves a given Reseller from the server by its {@link trakit.fleetfreedom.CompanyReseller#id}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getReseller(id: ulong) {
		// pass the id as empty string because otherwise it is appended to the path
		// this is the one exception to the Mindflayer route consistency
		return MINDFLAYER_GET("companyReseller", "", "companies/" + id + "/reseller");
	};
	/**
	 * Merges a {@link trakit.fleetfreedom.CompanyReseller}.
	 * @expose
	 * @param {!trakit.json.CompanyReseller} json
	 * @return {!Promise<SyncMindflayer>}
	 **/
	mergeReseller(json: JsonObject) { return MINDFLAYER_MERGE("companyReseller", json, "companies/" + json["id"] + "/reseller"); };
	/**
	 * Deletes a {@link trakit.fleetfreedom.CompanyReseller}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	removeReseller(id: ulong) {
		// pass the id as empty string because otherwise it is appended to the path
		// this is the one exception to the Mindflayer route consistency
		return MINDFLAYER_DELETE("companyReseller", "", "companies/" + id + "/reseller");
	};
	/**
	 * Restores a deleted {@link trakit.fleetfreedom.CompanyReseller}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	restoreReseller(id: ulong) {
		// pass the id as empty string because otherwise it is appended to the path
		// this is the one exception to the Mindflayer route consistency
		return MINDFLAYER_RESTORE("companyReseller", "", "companies/" + id + "/reseller/restore");
	};
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
	getContacts(companyId: ulong, constraints) { return MINDFLAYER_LIST_BY_COMPANY("contact", companyId, null, constraints); };
	/**
	 * Retrieves a given contact from the server by its {@link trakit.fleetfreedom.Contact#id}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getContact(id: ulong) { return MINDFLAYER_GET("contact", id); };
	/**
	 * Merges a {@link trakit.fleetfreedom.Contact}.
	 * @expose
	 * @param {!trakit.json.Contact} json
	 * @return {!Promise<SyncMindflayer>}
	 **/
	mergeContact(json: JsonObject) { return MINDFLAYER_MERGE("contact", json); };
	/**
	 * Merges a batch of {@link trakit.fleetfreedom.Contact}s.
	 * @expose
	 * @param {!Array.<trakit.json.Contact>} array
	 * @return {!Promise<SyncMindflayer>}
	 **/
	multiMergeContact(array: JsonObject[]) { return MINDFLAYER_MULTI_MERGE("contact", array); };
	/**
	 * Deletes a {@link trakit.fleetfreedom.Contact}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	removeContact(id: ulong) { return MINDFLAYER_DELETE("contact", id); };
	/**
	 * Restores a deleted {@link trakit.fleetfreedom.Contact}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	restoreContact(id: ulong) { return MINDFLAYER_RESTORE("contact", id); };
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
	getUsers(companyId: ulong, constraints) { return MINDFLAYER_LIST_BY_COMPANY("user", companyId, null, constraints); };
	/**
	 * Retrieves a given user from the server by its {@link trakit.fleetfreedom.User#id}.
	 * @expose
	 * @param {!string} login
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getUser(login) { return MINDFLAYER_GET("user", (login || "").trim()); };
	/**
	 * Merges an {@link trakit.fleetfreedom.User}.
	 * @expose
	 * @param {!trakit.json.User} json
	 * @return {!Promise<SyncMindflayer>}
	 **/
	mergeUser(json: JsonObject) { return MINDFLAYER_MERGE("user", json); };
	/**
	 * Deletes an {@link trakit.fleetfreedom.User}.
	 * @expose
	 * @param {!string} login
	 * @return {!Promise<SyncMindflayer>}
	 **/
	removeUser(login) { return MINDFLAYER_DELETE("user", (login || "").trim()); };
	/**
	 * Restores a deleted {@link trakit.fleetfreedom.User}.
	 * @expose
	 * @param {!string} login
	 * @return {!Promise<SyncMindflayer>}
	 **/
	restoreUser(login) { return MINDFLAYER_RESTORE("user", (login || "").trim()); };
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
	getUserGroups(companyId: ulong, constraints) { return MINDFLAYER_LIST_BY_COMPANY("userGroup", companyId, null, constraints); };
	/**
	 * Retrieves a given group from the server by its {@link trakit.fleetfreedom.UserGroup#id}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getUserGroup(id: ulong) { return MINDFLAYER_GET("userGroup", id); };
	/**
	 * Merges a {@link trakit.fleetfreedom.UserGroup}.
	 * @expose
	 * @param {!trakit.json.UserGroup} json
	 * @return {!Promise<SyncMindflayer>}
	 **/
	mergeUserGroup(json: JsonObject) { return MINDFLAYER_MERGE("userGroup", json); };
	/**
	 * Deletes a {@link trakit.fleetfreedom.UserGroup}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	removeUserGroup(id: ulong) { return MINDFLAYER_DELETE("userGroup", id); };
	/**
	 * Restores a deleted {@link trakit.fleetfreedom.UserGroup}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	restoreUserGroup(id: ulong) { return MINDFLAYER_RESTORE("userGroup", id); };
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
	getMachines(companyId: ulong, constraints) { return MINDFLAYER_LIST_BY_COMPANY("machine", companyId, null, constraints); };
	/**
	 * Retrieves a given machine from the server by its {@link trakit.fleetfreedom.Machine#id}.
	 * @expose
	 * @param {!string} key
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getMachine(key) { return MINDFLAYER_GET("machine", (key || "").trim()); };
	/**
	 * Merges an {@link trakit.fleetfreedom.Machine}.
	 * @expose
	 * @param {!trakit.json.Machine} json
	 * @return {!Promise<SyncMindflayer>}
	 **/
	mergeMachine(json: JsonObject) { return MINDFLAYER_MERGE("machine", json); };
	/**
	 * Deletes an {@link trakit.fleetfreedom.Machine}.
	 * @expose
	 * @param {!string} key
	 * @return {!Promise<SyncMindflayer>}
	 **/
	removeMachine(key) { return MINDFLAYER_DELETE("machine", (key || "").trim()); };
	/**
	 * Restores a deleted {@link trakit.fleetfreedom.Machine}.
	 * @expose
	 * @param {!string} key
	 * @return {!Promise<SyncMindflayer>}
	 **/
	restoreMachine(key) { return MINDFLAYER_RESTORE("machine", (key || "").trim()); };
	//#endregion Machine
	//#region Sessions
	/**
	 * Retrieves a list of all Sessions in the given company.
	 * If a company is not given it will use the currently selected company.
	 * @expose
	 * @param {number=} companyId
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getSessions(companyId: ulong, constraints) { return MINDFLAYER_LIST_BY_COMPANY("session", companyId, "users/sessions", constraints); };
	/**
	 * Retrieves a list of all Sessions in the given user.
	 * @expose
	 * @param {!string} login
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getSessionsByUser(login) {
		return CLIENT.mindflayer("users/" + (login || "").trim() + "/sessions").next(function (/** SyncMindflayer */ msg) {
			var response = MINDFLAYER_RESPONSE_WITHOUT_PAYLOAD("sessions", msg.response);
			if (msg.response.errorCode === 0) {
				var company = COMPANIES.get(msg.response["user"]["company"]);
				if (company) {
					// remove all previous sessions for this user
					company.sessions.filter(function (sess) {
						return sess.login === login;
					}).forEach(function (sess) {
						company.removeSession(sess.handle);
					});
				}
				response["sessions"] = msg.response["sessions"].map(function (json: JsonObject) {
					return SyncClient_merged("Session", json);
				});
			}
			me.fire("sessionUserList", response);
			return Promise[msg.response.errorCode === 0 ? "resolve" : "reject"](msg);
		});
	};
	/**
	 * Deletes a {@link trakit.fleetfreedom.SessionFull}.
	 * @expose
	 * @param {!string} handle
	 * @return {!Promise<SyncMindflayer>}
	 **/
	killSession(handle) { return MINDFLAYER_DELETE("session", "", "users/sessions?handle=" + ESCAPE((handle || "").trim())); };
	//#endregion Sessions
	//#region Self
	/**
	 * Gets details about your own session information.
	 * @expose
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getSessionDetails() {
		return CLIENT.mindflayer("self").next(function (/** SyncMindflayer */ msg) {
			SyncClient_sessionDetails("user", msg.response);
			return Promise[msg.response.errorCode === 0 ? "resolve" : "reject"](msg);
		});
	};
	/**
	 * Sends a login request to Mindflayer.
	 * This was originally added so that user's whose sessions were about to end could re-login and simply change sessions.
	 * I am not sure if that will work anymore...
	 * @expose
	 * @param {!string} username
	 * @param {!string} password
	 * @return {!Promise<SyncMindflayer>}
	 **/
	login(username, password) {
		return CLIENT.mindflayer("self/login", "POST", {
			"userAgent": ns["userAgent"],
			"username": username,
			"password": password,
		}).next(function (/** SyncMindflayer */ msg) {
			SyncClient_sessionDetails("login", msg.response);
			SyncClient_sessionGeneralMerged();
			SyncClient_sessionAdvancedMerged();
			return Promise[msg.response.errorCode === 0 ? "resolve" : "reject"](msg);
		});
	};
	/**
	 * Saves changes to your own user's contact card.
	 * @expose
	 * @param {!trakit.json.Contact} json
	 * @return {!Promise<SyncMindflayer>}
	 **/
	updateOwnContact(json: JsonObject) { return MINDFLAYER_MERGE("contact", json, "self/contact"); };
	/**
	 * Upd
	 * @expose
	 * @param {!trakit.json.UserGeneral} json
	 * @return {!Promise<SyncMindflayer>}
	 **/
	updateOwnPreferences(json: JsonObject) { return CLIENT.kraken("updateOwnPreferences", json); };
	//#endregion Self

	//#region Icons
	/**
	 * Retrieves a list of all icons in the trunk for the given company.
	 * If a company is not given it will use the currently selected company.
	 * @expose
	 * @param {number=} companyId
	 * @param {ParamListConstraintsById=} constraints
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getIcons(companyId: ulong, constraints) { return MINDFLAYER_LIST_BY_COMPANY("icon", companyId, null, constraints); };
	/**
	 * Retrieves a given icon from the server by its {@link trakit.fleetfreedom.Icon#id}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getIcon(id: ulong) { return MINDFLAYER_GET("icon", id); };
	/**
	 * Merges a {@link trakit.fleetfreedom.Icon}.
	 * @expose
	 * @param {!trakit.json.Icon} json
	 * @return {!Promise<SyncMindflayer>}
	 **/
	mergeIcon(json: JsonObject) { return MINDFLAYER_MERGE("icon", json); };
	/**
	 * Deletes a {@link trakit.fleetfreedom.Icon}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	removeIcon(id: ulong) { return MINDFLAYER_DELETE("icon", id); };
	/**
	 * Restores a deleted {@link trakit.fleetfreedom.Icon}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	restoreIcon(id: ulong) { return MINDFLAYER_RESTORE("icon", id); };
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
	getPictures(companyId: ulong, constraints) { return MINDFLAYER_LIST_BY_COMPANY("picture", companyId, null, constraints); };
	/**
	 * Retrieves a given picture from the server by its {@link trakit.fleetfreedom.Picture#id}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getPicture(id: ulong) { return MINDFLAYER_GET("picture", id); };
	/**
	 * Merges a {@link trakit.fleetfreedom.Picture}.
	 * @expose
	 * @param {!trakit.json.Picture} json
	 * @return {!Promise<SyncMindflayer>}
	 **/
	mergePicture(json: JsonObject) { return MINDFLAYER_MERGE("picture", json); };
	/**
	 * Deletes a {@link trakit.fleetfreedom.Picture}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	removePicture(id: ulong) { return MINDFLAYER_DELETE("picture", id); };
	/**
	 * Restores a deleted {@link trakit.fleetfreedom.Picture}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	restorePicture(id: ulong) { return MINDFLAYER_RESTORE("picture", id); };
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
	getDocuments(companyId: ulong, constraints) { return MINDFLAYER_LIST_BY_COMPANY("document", companyId, null, constraints); };
	/**
	 * Retrieves a given document from the server by its {@link trakit.fleetfreedom.Document#id}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getDocument(id: ulong) { return MINDFLAYER_GET("document", id); };
	/**
	 * Merges a {@link trakit.fleetfreedom.Document}.
	 * @expose
	 * @param {!trakit.json.Document} json
	 * @return {!Promise<SyncMindflayer>}
	 **/
	mergeDocument(json: JsonObject) { return MINDFLAYER_MERGE("document", json); };
	/**
	 * Deletes a {@link trakit.fleetfreedom.Document}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	removeDocument(id: ulong) { return MINDFLAYER_DELETE("document", id); };
	/**
	 * Restores a deleted {@link trakit.fleetfreedom.Document}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	restoreDocument(id: ulong) { return MINDFLAYER_RESTORE("document", id); };
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
	getFormTemplates(companyId: ulong, constraints) { return MINDFLAYER_LIST_BY_COMPANY("formTemplate", companyId, null, constraints); };
	/**
	 * Retrieves a given template from the server by its {@link trakit.fleetfreedom.FormTemplate#id}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getFormTemplate(id: ulong) { return MINDFLAYER_GET("formTemplate", id); };
	/**
	 * Merges a {@link trakit.fleetfreedom.FormTemplate}.
	 * @expose
	 * @param {!trakit.json.FormTemplate} json
	 * @return {!Promise<SyncMindflayer>}
	 **/
	mergeFormTemplate(json: JsonObject) { return MINDFLAYER_MERGE("formTemplate", json); };
	/**
	 * Deletes a {@link trakit.fleetfreedom.FormTemplate}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	removeFormTemplate(id: ulong) { return MINDFLAYER_DELETE("formTemplate", id); };
	/**
	 * Restores a deleted {@link trakit.fleetfreedom.FormTemplate}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	restoreFormTemplate(id: ulong) { return MINDFLAYER_RESTORE("formTemplate", id); };
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
	getFormResults(companyId: ulong, constraints) { return MINDFLAYER_LIST_BY_COMPANY("formResult", companyId, null, constraints); };
	/**
	 * Retrieves a given form result from the server by its {@link trakit.fleetfreedom.FormResult#id}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getFormResult(id: ulong) { return MINDFLAYER_GET("formResult", id); };
	/**
	 * Merges a {@link trakit.fleetfreedom.FormResult}.
	 * @expose
	 * @param {!trakit.json.FormResult} json
	 * @return {!Promise<SyncMindflayer>}
	 **/
	mergeFormResult(json: JsonObject) { return MINDFLAYER_MERGE("formResult", json); };
	/**
	 * Merges a batch of {@link trakit.fleetfreedom.FormResult}s.
	 * @expose
	 * @param {!Array.<trakit.json.FormResult>} array
	 * @return {!Promise<SyncMindflayer>}
	 **/
	multiMergeFormResult(array: JsonObject[]) { return MINDFLAYER_MULTI_MERGE("formResult", array); };
	/**
	 * Deletes a {@link trakit.fleetfreedom.FormResult}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	removeFormResult(id: ulong) { return MINDFLAYER_DELETE("formResult", id); };
	/**
	 * Restores a deleted {@link trakit.fleetfreedom.FormResult}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	restoreFormResult(id: ulong) { return MINDFLAYER_RESTORE("formResult", id); };
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
	getDashcamDatas(companyId: ulong, constraints) { return MINDFLAYER_LIST_BY_COMPANY("dashcam", companyId, "dashcams", constraints); };
	/**
	 * Retrieves a given dashcam-data from the server by its {@link trakit.json.DashcamData#guid}.
	 * @expose
	 * @param {!trakit.json.guid} guid
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getDashcamData(guid: guid) { return MINDFLAYER_GET("dashcam", (guid || "").trim()); };
	/**
	 * Retrieves a list of all dashcam-data in the given company.
	 * If a company is not given it will use the currently selected company.
	 * @expose
	 * @param {number=} companyId
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getDashcamLives(companyId: ulong, constraints) { return MINDFLAYER_LIST_BY_COMPANY("dashcam", companyId, "dashcams/live", constraints); };
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
	getAssets(companyId: ulong, constraints) { return MINDFLAYER_LIST_BY_COMPANY("asset", companyId, null, constraints); };
	/**
	 * Retrieves a given asset from the server by its {@link trakit.fleetfreedom.Asset#id}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getAsset(id: ulong) { return MINDFLAYER_GET("asset", id); };
	/**
	 * Merges an {@link trakit.fleetfreedom.Asset}.
	 * @expose
	 * @param {!trakit.json.Asset} json
	 * @return {!Promise<SyncMindflayer>}
	 **/
	mergeAsset(json: JsonObject) { return MINDFLAYER_MERGE("asset", json); };
	/**
	 * Merges a batch of {@link trakit.fleetfreedom.Asset}s.
	 * @expose
	 * @param {!Array.<trakit.json.Asset>} array
	 * @return {!Promise<SyncMindflayer>}
	 **/
	multiMergeAsset(array: JsonObject[]) { return MINDFLAYER_MULTI_MERGE("asset", array); };
	/**
	 * Deletes an {@link trakit.fleetfreedom.Asset}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	removeAsset(id: ulong) { return MINDFLAYER_DELETE("asset", id); };
	/**
	 * Restores a deleted {@link trakit.fleetfreedom.Asset}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	restoreAsset(id: ulong) { return MINDFLAYER_RESTORE("asset", id); };
	/**
	 * Suspends an {@link trakit.fleetfreedom.Asset}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	suspendAsset(id: ulong) { return MINDFLAYER_SUSPEND("asset", id); };
	/**
	 * Reactivates an {@link trakit.fleetfreedom.Asset}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	reviveAsset(id: ulong) { return MINDFLAYER_REVIVE("asset", id); };
	/**
	 * Searches all available companies for {@link trakit.fleetfreedom.Asset}s that match the given expression.
	 * @expose
	 * @param {!string} expression
	 * @param {ParamListConstraintsById=} constraints
	 * @return {!Promise<SyncMindflayer>}
	 **/
	searchAssets(expression: expression, constraints) { return MINDFLAYER_SEARCH("asset", expression, null, constraints); };
	//#endregion Assets
	//#region Assets/Dispatch
	/**
	 * Updates the given asset's dispatch jobs and optimizes the steps based on back-end logic.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	mergeAssetDispatch(json: JsonObject) { return MINDFLAYER_MERGE("assetDispatch", json, "assets/" + json["id"] + "/dispatch"); };
	/**
	 * Optimizes the given asset's dispatch jobs and returns the new order and ETAs based on back-end logic.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	previewAssetDispatch(json: JsonObject) { return CLIENT.medusa("assets/" + json["asset"]["id"] + "/dispatch/waypoints", "POST", json); };
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
	getDispatchTasks(companyId: ulong, constraints) { return MINDFLAYER_LIST_BY_COMPANY("dispatchTask", companyId, "assets/dispatch/tasks", constraints); };
	/**
	 * Retrieves a list of all dispatch tasks for the given asset.
	 * @expose
	 * @param {!number} assetId
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getDispatchTasksByAsset(assetId: ulong) { return MINDFLAYER_LIST_BY_ASSET("dispatchTask", assetId); };
	/**
	 * Retrieves a given dispatch task from the server by its {@link trakit.fleetfreedom.DispatchTask#id}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getDispatchTask(id: ulong) { return MINDFLAYER_GET("dispatchTask", id); };
	/**
	 * Merges a {@link trakit.fleetfreedom.DispatchTask}.
	 * @expose
	 * @param {!trakit.json.DispatchTask} json
	 * @return {!Promise<SyncMindflayer>}
	 **/
	mergeDispatchTask(json: JsonObject) { return MINDFLAYER_MERGE("dispatchTask", json); };
	/**
	 * Merges a batch of {@link trakit.fleetfreedom.DispatchTask}s.
	 * @expose
	 * @param {!Array.<trakit.json.DispatchTask>} array
	 * @return {!Promise<SyncMindflayer>}
	 **/
	multiMergeDispatchTask(array: JsonObject[]) { return MINDFLAYER_MULTI_MERGE("dispatchTask", array); };
	/**
	 * Deletes a {@link trakit.fleetfreedom.DispatchTask}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	removeDispatchTask(id: ulong) { return MINDFLAYER_DELETE("dispatchTask", id); };
	/**
	 * Restores a deleted {@link trakit.fleetfreedom.DispatchTask}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	restoreDispatchTask(id: ulong) { return MINDFLAYER_RESTORE("dispatchTask", id); };
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
	getDispatchJobs(companyId: ulong, constraints) { return MINDFLAYER_LIST_BY_COMPANY("dispatchJob", companyId, "assets/dispatch/jobs", constraints); };
	/**
	 * Retrieves a list of all dispatch Jobs for the given asset.
	 * @expose
	 * @param {!number} assetId
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getDispatchJobsByAsset(assetId: ulong) { return MINDFLAYER_LIST_BY_ASSET("dispatchJob", assetId); };
	/**
	 * Retrieves a given dispatch job from the server by its {@link trakit.fleetfreedom.DispatchJob#id}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getDispatchJob(id: ulong) { return MINDFLAYER_GET("dispatchJob", id); };
	/**
	 * Merges a {@link trakit.fleetfreedom.DispatchJob}.
	 * @expose
	 * @param {!trakit.json.DispatchJob} json
	 * @return {!Promise<SyncMindflayer>}
	 **/
	mergeDispatchJob(json: JsonObject) { return MINDFLAYER_MERGE("dispatchJob", json); };
	/**
	 * Merges a batch of {@link trakit.fleetfreedom.DispatchJob}s.
	 * @expose
	 * @param {!Array.<trakit.json.DispatchJob>} array
	 * @return {!Promise<SyncMindflayer>}
	 **/
	multiMergeDispatchJob(array: JsonObject[]) { return MINDFLAYER_MULTI_MERGE("dispatchJob", array); };
	/**
	 * Deletes a {@link trakit.fleetfreedom.DispatchJob}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	removeDispatchJob(id: ulong) { return MINDFLAYER_DELETE("dispatchJob", id); };
	/**
	 * Restores a deleted {@link trakit.fleetfreedom.DispatchJob}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	restoreDispatchJob(id: ulong) { return MINDFLAYER_RESTORE("dispatchJob", id); };
	/**
	 * Completes or progresses a {@link trakit.fleetfreedom.DispatchJob} (from the perspective of a driver, but by a dispatcher).
	 * @expose
	 * @param {!trakit.json.DispatchJob} json
	 * @return {!Promise<SyncMindflayer>}
	 **/
	changeDispatchJob(json: JsonObject) { return MINDFLAYER_MERGE("dispatchJob", json, "dispatch/jobs/" + json["id"], "PUT"); };
	/**
	 * Cancels a {@link trakit.fleetfreedom.DispatchJob} and removes it from the dispatcher's and driver's view.
	 * @param {!trakit.json.DispatchJob} json
	 * @return {!Promise<SyncMindflayer>}
	 **/
	cancelDispatchJob(json: JsonObject) { return MINDFLAYER_MERGE("dispatchJob", json, "dispatch/jobs/" + json["id"] + "/cancel", "POST"); };
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
	getAssetMessages(companyId: ulong, constraints) { return MINDFLAYER_LIST_BY_COMPANY("message", companyId, null, constraints); };
	/**
	 * Retrieves a list of all dispatch Jobs for the given asset.
	 * @expose
	 * @param {!number} assetId
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getAssetMessagesByAsset(assetId: ulong) { return MINDFLAYER_LIST_BY_ASSET("message", assetId); };
	/**
	 * Retrieves a given message from the server by its {@link trakit.fleetfreedom.Message#id}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getAssetMessage(id: ulong) { return MINDFLAYER_GET("message", id); };
	/**
	 * Merges a {@link trakit.fleetfreedom.Message}.
	 * @expose
	 * @param {!trakit.json.Message} json
	 * @return {!Promise<SyncMindflayer>}
	 **/
	mergeAssetMessage(json: JsonObject) { return MINDFLAYER_MERGE("assetMessage", json); };
	/**
	 * Merges a batch of {@link trakit.fleetfreedom.Message}s.
	 * @expose
	 * @param {!Array.<trakit.json.Message>} array
	 * @return {!Promise<SyncMindflayer>}
	 **/
	multiMergeAssetMessage(array: JsonObject[]) { return MINDFLAYER_MULTI_MERGE("assetMessage", array); };
	/**
	 * Deletes a {@link trakit.fleetfreedom.Message}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	removeAssetMessage(id: ulong) { return MINDFLAYER_DELETE("assetMessage", id); };
	/**
	 * Restores a deleted {@link trakit.fleetfreedom.Message}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	restoreAssetMessage(id: ulong) { return MINDFLAYER_RESTORE("assetMessage", id); };
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
	getPlaces(companyId: ulong, constraints) { return MINDFLAYER_LIST_BY_COMPANY("place", companyId, null, constraints); };
	/**
	 * Retrieves a given place from the server by its {@link trakit.fleetfreedom.Place#id}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getPlace(id: ulong) { return MINDFLAYER_GET("place", id); };
	/**
	 * Merges a {@link trakit.fleetfreedom.Place}.
	 * @expose
	 * @param {!trakit.json.Place} json
	 * @return {!Promise<SyncMindflayer>}
	 **/
	mergePlace(json: JsonObject) { return MINDFLAYER_MERGE("place", json); };
	/**
	 * Deletes a {@link trakit.fleetfreedom.Place}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	removePlace(id: ulong) { return MINDFLAYER_DELETE("place", id); };
	/**
	 * Restores a deleted {@link trakit.fleetfreedom.Place}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	restorePlace(id: ulong) { return MINDFLAYER_RESTORE("place", id); };
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
	getProviders(companyId: ulong, constraints) { return MINDFLAYER_LIST_BY_COMPANY("provider", companyId, null, constraints); };
	/**
	 * Retrieves a given provider from the server by its {@link trakit.fleetfreedom.Provider#id}.
	 * @expose
	 * @param {!string} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getProvider(id: ulong) { return MINDFLAYER_GET("provider", ESCAPE((id || "").trim())); };
	/**
	 * Merges an {@link trakit.fleetfreedom.Provider}.
	 * @expose
	 * @param {!trakit.json.Provider} json
	 * @return {!Promise<SyncMindflayer>}
	 **/
	mergeProvider(json: JsonObject) { return MINDFLAYER_MERGE("provider", json); };
	/**
	 * Merges a batch of {@link trakit.fleetfreedom.Provider}s.
	 * @expose
	 * @param {!Array.<trakit.json.Provider>} array
	 * @return {!Promise<SyncMindflayer>}
	 **/
	multiMergeProvider(array: JsonObject[]) { return MINDFLAYER_MULTI_MERGE("provider", array); };
	/**
	 * Deletes a batch of {@link trakit.fleetfreedom.Provider}s.
	 * @expose
	 * @param {!Array.<trakit.json.Provider>} array
	 * @return {!Promise<SyncMindflayer>}
	 */
	multiRemoveProvider(array: JsonObject[]) { return MINDFLAYER_MULTI_DELETE("provider", array); };
	/**
	 * Deletes an {@link trakit.fleetfreedom.Provider}.
	 * @expose
	 * @param {!string} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	removeProvider(id: ulong) { return MINDFLAYER_DELETE("provider", ESCAPE((id || "").trim())); };
	/**
	 * Restores a deleted {@link trakit.fleetfreedom.Provider}.
	 * @expose
	 * @param {!string} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	restoreProvider(id: ulong) { return MINDFLAYER_RESTORE("provider", ESCAPE((id || "").trim())); };
	/**
	 * Suspends an {@link trakit.fleetfreedom.Provider}.
	 * @expose
	 * @param {!string} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	suspendProvider(id: ulong) { return MINDFLAYER_SUSPEND("provider", ESCAPE((id || "").trim())); };
	/**
	 * Reactivates an {@link trakit.fleetfreedom.Provider}.
	 * @expose
	 * @param {!string} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	reviveProvider(id: ulong) { return MINDFLAYER_REVIVE("provider", ESCAPE((id || "").trim())); };
	/**
	 * Searches all available companies for {@link trakit.fleetfreedom.Provider}s that match the given expression.
	 * @expose
	 * @param {!string} expression
	 * @param {ParamListConstraintsByString=} constraints
	 * @return {!Promise<SyncMindflayer>}
	 **/
	searchProviders(expression: expression, constraints) { return MINDFLAYER_SEARCH("provider", expression, null, constraints); };
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
	getProviderScripts(companyId: ulong, constraints) { return MINDFLAYER_LIST_BY_COMPANY("providerScript", companyId, null, constraints); };
	/**
	 * Retrieves a given Provider Script from the server by its {@link trakit.fleetfreedom.ProviderScript#id}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getProviderScript(id: ulong) { return MINDFLAYER_GET("providerScript", id); };
	/**
	 * Merges a {@link trakit.fleetfreedom.ProviderScript}.
	 * @expose
	 * @param {!trakit.json.ProviderScript} json
	 * @return {!Promise<SyncMindflayer>}
	 **/
	mergeProviderScript(json: JsonObject) { return MINDFLAYER_MERGE("providerScript", json); };
	/**
	 * Deletes a {@link trakit.fleetfreedom.ProviderScript}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	removeProviderScript(id: ulong) { return MINDFLAYER_DELETE("providerScript", id); };
	/**
	 * Restores a deleted {@link trakit.fleetfreedom.ProviderScript}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	restoreProviderScript(id: ulong) { return MINDFLAYER_RESTORE("providerScript", id); };
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
	getProviderConfigs(companyId: ulong, constraints) { return MINDFLAYER_LIST_BY_COMPANY("providerConfig", companyId, null, constraints); };
	/**
	 * Retrieves a given Provider Config from the server by its {@link trakit.fleetfreedom.ProviderConfig#id}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getProviderConfig(id: ulong) { return MINDFLAYER_GET("providerConfig", id); };
	/**
	 * Merges a {@link trakit.fleetfreedom.ProviderConfig}.
	 * @expose
	 * @param {!trakit.json.ProviderConfig} json
	 * @return {!Promise<SyncMindflayer>}
	 **/
	mergeProviderConfig(json: JsonObject) { return MINDFLAYER_MERGE("providerConfig", json); };
	/**
	 * Merges a batch of {@link trakit.fleetfreedom.ProviderConfig}s.
	 * @expose
	 * @param {!Array.<trakit.json.ProviderConfig>} array
	 * @return {!Promise<SyncMindflayer>}
	 **/
	multiMergeProviderConfig(array: JsonObject[]) { return MINDFLAYER_MULTI_MERGE("providerConfig", array); };
	/**
	 * Deletes a {@link trakit.fleetfreedom.ProviderConfig}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	removeProviderConfig(id: ulong) { return MINDFLAYER_DELETE("providerConfig", id); };
	/**
	 * Restores a deleted {@link trakit.fleetfreedom.ProviderConfig}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	restoreProviderConfig(id: ulong) { return MINDFLAYER_RESTORE("providerConfig", id); };
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
	getProviderConfigurations(companyId: ulong, constraints) { return MINDFLAYER_LIST_BY_COMPANY("providerConfiguration", companyId, null, constraints); };
	/**
	 * Retrieves a given Provider Configuration from the server by its {@link trakit.fleetfreedom.ProviderConfiguration#id}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getProviderConfiguration(id: ulong) { return MINDFLAYER_GET("providerConfiguration", id); };
	/**
	 * Merges a {@link trakit.fleetfreedom.ProviderConfiguration}.
	 * @expose
	 * @param {!trakit.json.ProviderConfiguration} json
	 * @return {!Promise<SyncMindflayer>}
	 **/
	mergeProviderConfiguration(json: JsonObject) { return MINDFLAYER_MERGE("providerConfiguration", json); };
	/**
	 * Merges a batch of {@link trakit.fleetfreedom.ProviderConfiguration}s.
	 * @expose
	 * @param {!Array.<trakit.json.ProviderConfiguration>} array
	 * @return {!Promise<SyncMindflayer>}
	 **/
	multiMergeProviderConfiguration(array: JsonObject[]) { return MINDFLAYER_MULTI_MERGE("providerConfiguration", array); };
	/**
	 * Deletes a {@link trakit.fleetfreedom.ProviderConfiguration}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	removeProviderConfiguration(id: ulong) { return MINDFLAYER_DELETE("providerConfiguration", id); };
	/**
	 * Restores a deleted {@link trakit.fleetfreedom.ProviderConfiguration}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	restoreProviderConfiguration(id: ulong) { return MINDFLAYER_RESTORE("providerConfiguration", id); };
	//#endregion Providers/Configurations
	//#region Providers/Registrations
	/**
	 * Retrieves a list of all Provider Registrations in the given company.
	 * If a company is not given it will use the currently selected company.
	 * @expose
	 * @param {number=} companyId
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getProviderRegistrations(companyId: ulong) { return MINDFLAYER_LIST_BY_COMPANY("providerRegistration", companyId); };
	/**
	 * Retrieves a given Provider Registration from the server by its {@link trakit.fleetfreedom.ProviderRegistration#id}.
	 * @expose
	 * @param {!number} code
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getProviderRegistration(code: int) { return MINDFLAYER_GET("providerRegistration", code); };
	/**
	 * Merges a {@link trakit.fleetfreedom.ProviderRegistration}.
	 * @expose
	 * @param {!trakit.json.ProviderRegistration} json
	 * @return {!Promise<SyncMindflayer>}
	 **/
	mergeProviderRegistration(json: JsonObject) { return MINDFLAYER_MERGE("providerRegistration", json); };
	/**
	 * Deletes a {@link trakit.fleetfreedom.ProviderRegistration}.
	 * @expose
	 * @param {!number} code
	 * @return {!Promise<SyncMindflayer>}
	 **/
	removeProviderRegistration(code: int) { return MINDFLAYER_DELETE("providerRegistration", code); };
	/**
	 * Restores a deleted {@link trakit.fleetfreedom.ProviderRegistration}.
	 * @expose
	 * @param {!number} code
	 * @return {!Promise<SyncMindflayer>}
	 **/
	restoreProviderRegistration(code: int) { return MINDFLAYER_RESTORE("providerRegistration", code); };
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
	getBehaviours(companyId: ulong, constraints) { return MINDFLAYER_LIST_BY_COMPANY("behaviour", companyId, null, constraints); };
	/**
	 * Retrieves a given behaviour from the server by its {@link trakit.fleetfreedom.Behaviour#id}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getBehaviour(id: ulong) { return MINDFLAYER_GET("behaviour", id); };
	/**
	 * Merges a {@link trakit.fleetfreedom.Behaviour}.
	 * @expose
	 * @param {!trakit.json.Behaviour} json
	 * @return {!Promise<SyncMindflayer>}
	 **/
	mergeBehaviour(json: JsonObject) { return MINDFLAYER_MERGE("behaviour", json); };
	/**
	 * Merges a batch of {@link trakit.fleetfreedom.Behaviour}s.
	 * @expose
	 * @param {!Array.<trakit.json.Behaviour>} array
	 * @return {!Promise<SyncMindflayer>}
	 **/
	multiMergeBehaviour(array: JsonObject[]) { return MINDFLAYER_MULTI_MERGE("behaviour", array); };
	/**
	 * Deletes a {@link trakit.fleetfreedom.Behaviour}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	removeBehaviour(id: ulong) { return MINDFLAYER_DELETE("behaviour", id); };
	/**
	 * Restores a deleted {@link trakit.fleetfreedom.Behaviour}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	restoreBehaviour(id: ulong) { return MINDFLAYER_RESTORE("behaviour", id); };
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
	getBehaviourScripts(companyId: ulong, constraints) { return MINDFLAYER_LIST_BY_COMPANY("behaviourScript", companyId, null, constraints); };
	/**
	 * Retrieves a given script from the server by its {@link trakit.fleetfreedom.Behaviour#id}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getBehaviourScript(id: ulong) { return MINDFLAYER_GET("behaviourScript", id); };
	/**
	 * Merges a {@link trakit.fleetfreedom.Behaviour}.
	 * @expose
	 * @param {!trakit.json.Behaviour} json
	 * @return {!Promise<SyncMindflayer>}
	 **/
	mergeBehaviourScript(json: JsonObject) { return MINDFLAYER_MERGE("behaviourScript", json); };
	/**
	 * Deletes a {@link trakit.fleetfreedom.Behaviour}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	removeBehaviourScript(id: ulong) { return MINDFLAYER_DELETE("behaviourScript", id); };
	/**
	 * Restores a deleted {@link trakit.fleetfreedom.Behaviour}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	restoreBehaviourScript(id: ulong) { return MINDFLAYER_RESTORE("behaviourScript", id); };
	//#endregion Behaviours/Scripts
	//#region Behaviours/Logs
	/**
	 * Retrieves a list of all BehaviourLogs in the given behaviour.
	 * If a company is not given it will use the currently selected company.
	 * @expose
	 * @param {!number} behaviourId
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getBehaviourLogs(behaviourId: ulong) {
		return CLIENT.mindflayer("behaviours/" + behaviourId + "/logs").next(function (/** SyncMindflayer */ msg) {
			var response = MINDFLAYER_RESPONSE_WITHOUT_PAYLOAD(BEHAVIOUR_LOG_TYPES, msg.response);
			if (msg.response.errorCode === 0) {
				BEHAVIOUR_LOG_PURGE(msg.response["behaviour"]["company"], function (log) {
					return log.behaviourId === behaviourId;
				});
				response[BEHAVIOUR_LOG_TYPES] = msg.response[BEHAVIOUR_LOG_TYPES].map(function (json: JsonObject) {
					return SyncClient_merged(BEHAVIOUR_LOG_TYPE, json);
				});
			}
			me.fire(BEHAVIOUR_LOG_BEHAVE_EVENT, response);
			return Promise[msg.response.errorCode === 0 ? "resolve" : "reject"](msg);
		});
	};
	/**
	 * Deletes all the {@link trakit.fleetfreedom.BehaviourLog}s for the given behaviour.
	 * @expose
	 * @param {!number} behaviourId
	 * @return {!Promise<SyncMindflayer>}
	 **/
	clearBehaviourLogs(behaviourId: ulong) {
		return CLIENT.mindflayer("behaviours/" + behaviourId + "/logs", "DELETE").next(function (/** SyncMindflayer */ msg) {
			if (msg.response.errorCode === 0) {
				BEHAVIOUR_LOG_PURGE(msg.response["behaviour"]["company"], function (log) {
					return log.behaviourId === behaviourId;
				});
				me.fire(BEHAVIOUR_LOG_BEHAVE_EVENT, {
					"errorCode": msg.response.errorCode,
					"message": msg.response.message,
					"behaviourLogs": [],
				});
			}
			return Promise[msg.response.errorCode === 0 ? "resolve" : "reject"](msg);
		});
	};
	/**
	 * Retrieves a list of all BehaviourLogs in the given behaviour script.
	 * If a company is not given it will use the currently selected company.
	 * @expose
	 * @param {!number} scriptId
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getBehaviourScriptLogs(scriptId: ulong) {
		return CLIENT.mindflayer("behaviours/scripts/" + scriptId + "/logs").next(function (/** SyncMindflayer */ msg) {
			var response = MINDFLAYER_RESPONSE_WITHOUT_PAYLOAD(BEHAVIOUR_LOG_TYPES, msg.response);
			if (msg.response.errorCode === 0) {
				BEHAVIOUR_LOG_PURGE(msg.response["behaviourScript"]["company"], function (log) {
					return log.scriptId === scriptId;
				});
				response[BEHAVIOUR_LOG_TYPES] = msg.response[BEHAVIOUR_LOG_TYPES].map(function (json: JsonObject) {
					return SyncClient_merged(BEHAVIOUR_LOG_TYPE, json);
				});
			}
			me.fire(BEHAVIOUR_LOG_SCRIPT_EVENT, response);
			return Promise[msg.response.errorCode === 0 ? "resolve" : "reject"](msg);
		});
	};
	/**
	 * Deletes all the {@link trakit.fleetfreedom.BehaviourLog}s for the given behaviour script.
	 * @expose
	 * @param {!number} scriptId
	 * @return {!Promise<SyncMindflayer>}
	 **/
	clearBehaviourScriptLogs(scriptId: ulong) {
		return CLIENT.mindflayer("behaviours/scripts/" + scriptId + "/logs", "DELETE").next(function (/** SyncMindflayer */ msg) {
			if (msg.response.errorCode === 0) {
				BEHAVIOUR_LOG_PURGE(msg.response["behaviourScript"]["company"], function (log) {
					return log.scriptId === scriptId;
				});
				me.fire(BEHAVIOUR_LOG_SCRIPT_EVENT, {
					"errorCode": msg.response.errorCode,
					"message": msg.response.message,
					"behaviourLogs": [],
				});
			}
			return Promise[msg.response.errorCode === 0 ? "resolve" : "reject"](msg);
		});
	};
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
	getReportTemplates(companyId: ulong, constraints) { return MINDFLAYER_LIST_BY_COMPANY("reportTemplate", companyId, null, constraints); };
	/**
	 * Retrieves a given template from the server by its {@link trakit.fleetfreedom.ReportTemplate#id}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getReportTemplate(id: ulong) { return MINDFLAYER_GET("reportTemplate", id); };
	/**
	 * Merges a {@link trakit.fleetfreedom.ReportTemplate}.
	 * @expose
	 * @param {!trakit.json.ReportTemplate} json
	 * @return {!Promise<SyncMindflayer>}
	 **/
	mergeReportTemplate(json: JsonObject) { return MINDFLAYER_MERGE("reportTemplate", json); };
	/**
	 * Deletes a {@link trakit.fleetfreedom.ReportTemplate}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	removeReportTemplate(id: ulong) { return MINDFLAYER_DELETE("reportTemplate", id); };
	/**
	 * Restores a deleted {@link trakit.fleetfreedom.ReportTemplate}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	restoreReportTemplate(id: ulong) { return MINDFLAYER_RESTORE("reportTemplate", id); };
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
	getReportSchedules(companyId: ulong, constraints) { return MINDFLAYER_LIST_BY_COMPANY("reportSchedule", companyId, null, constraints); }
	/**
	 * Retrieves a given schedule from the server by its {@link trakit.fleetfreedom.ReportSchedule#id}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getReportSchedule(id: ulong) { return MINDFLAYER_GET("reportSchedule", id); };
	/**
	 * Merges a {@link trakit.fleetfreedom.ReportSchedule}.
	 * @expose
	 * @param {!trakit.json.ReportSchedule} json
	 * @return {!Promise<SyncMindflayer>}
	 **/
	mergeReportSchedule(json: JsonObject) { return MINDFLAYER_MERGE("reportSchedule", json); };
	/**
	 * Deletes a {@link trakit.fleetfreedom.ReportSchedule}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	removeReportSchedule(id: ulong) { return MINDFLAYER_DELETE("reportSchedule", id); };
	/**
	 * Restores a deleted {@link trakit.fleetfreedom.ReportSchedule}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	restoreReportSchedule(id: ulong) { return MINDFLAYER_RESTORE("reportSchedule", id); };
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
	getReportResults(companyId: ulong, constraints) { return MINDFLAYER_LIST_BY_COMPANY("reportResult", companyId, null, constraints); };
	/**
	 * Retrieves a given report from the server by its {@link trakit.fleetfreedom.ReportResult#id}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getReportResult(id: ulong) { return MINDFLAYER_GET("reportResult", id); };
	/**
	 * Merges a {@link trakit.fleetfreedom.ReportResult}.
	 * @expose
	 * @param {!trakit.json.ReportResult} json
	 * @return {!Promise<SyncMindflayer>}
	 **/
	mergeReportResult(json: JsonObject) { return MINDFLAYER_MERGE("reportResult", json); };
	/**
	 * Deletes a {@link trakit.fleetfreedom.ReportResult}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	removeReportResult(id: ulong) { return MINDFLAYER_DELETE("reportResult", id); };
	/**
	 * Restores a deleted {@link trakit.fleetfreedom.ReportResult}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	restoreReportResult(id: ulong) { return MINDFLAYER_RESTORE("reportResult", id); };
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
	getMaintenanceSchedules(companyId: ulong, constraints) { return MINDFLAYER_LIST_BY_COMPANY("maintenanceSchedule", companyId, null, constraints); };
	/**
	 * Retrieves a given schedule from the server by its {@link trakit.fleetfreedom.MaintenanceSchedule#id}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getMaintenanceSchedule(id: ulong) { return MINDFLAYER_GET("maintenanceSchedule", id); };
	/**
	 * Merges a {@link trakit.fleetfreedom.MaintenanceSchedule}.
	 * @expose
	 * @param {!trakit.json.MaintenanceSchedule} json
	 * @return {!Promise<SyncMindflayer>}
	 **/
	mergeMaintenanceSchedule(json: JsonObject) { return MINDFLAYER_MERGE("maintenanceSchedule", json); };
	/**
	 * Deletes a {@link trakit.fleetfreedom.MaintenanceSchedule}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	removeMaintenanceSchedule(id: ulong) { return MINDFLAYER_DELETE("maintenanceSchedule", id); };
	/**
	 * Restores a deleted {@link trakit.fleetfreedom.MaintenanceSchedule}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	restoreMaintenanceSchedule(id: ulong) { return MINDFLAYER_RESTORE("maintenanceSchedule", id); };
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
	getMaintenanceJobs(companyId: ulong, constraints) { return MINDFLAYER_LIST_BY_COMPANY("maintenanceJob", companyId, null, constraints); };
	/**
	 * Retrieves a given job from the server by its {@link trakit.fleetfreedom.MaintenanceJob#id}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	getMaintenanceJob(id: ulong) { return MINDFLAYER_GET("maintenanceJob", id); };
	/**
	 * Merges a {@link trakit.fleetfreedom.MaintenanceJob}.
	 * @expose
	 * @param {!trakit.json.MaintenanceJob} json
	 * @return {!Promise<SyncMindflayer>}
	 **/
	mergeMaintenanceJob(json: JsonObject) { return MINDFLAYER_MERGE("maintenanceJob", json); };
	/**
	 * Deletes a {@link trakit.fleetfreedom.MaintenanceJob}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	removeMaintenanceJob(id: ulong) { return MINDFLAYER_DELETE("maintenanceJob", id); };
	/**
	 * Restores a deleted {@link trakit.fleetfreedom.MaintenanceJob}.
	 * @expose
	 * @param {!number} id
	 * @return {!Promise<SyncMindflayer>}
	 **/
	restoreMaintenanceJob(id: ulong) { return MINDFLAYER_RESTORE("maintenanceJob", id); };
	//#endregion Maintenance/Jobs
}