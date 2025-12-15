import {
	Payload,
	PaySubscriptionDelete,
	PaySubscriptionMerge,
	Reply,
	RepSelfGet,
	RepSubscription,
	SubscriptionType
} from "@trakit/commands";
import {
	guid,
	IRequestable,
	JsonObject,
	Machine,
	nothing,
	storage,
	SyncName,
	ulong
} from '@trakit/objects';
import { getJsonKeyValue } from "./JSON";
import { SubscribedRegions } from "./SubscribedRegions";
import { makeObjectName, makePayloadClass, MSG_SYNC, OBJECT_SUBSCRIPTIONS, SUBS_TO_SYNCS, SYNCS_TO_SUBS } from "./Subscriptions";
import { TrakitCommander } from "./TrakitCommander";
import { TrakitRestfulCommander } from "./TrakitRestfulCommander";
import { TrakitSocketCommander, TrakitSocketStatus } from "./TrakitSocketCommander";


/**
 * The amount of time (in milliseconds) to wait between intervals checking for expired subscriptions.
 **/
const TIMEOUT_SUBSCRIPTION = 10 * 1000;	// 10 seconds

////#region Mindflayer helpers
///**
// * A mapping of object type to Mindflayer path (or path suffix).
// * If an object type is not in the map, then use the plural of the object type.
// * @const {!Object.<string,string>}
// **/
//export var MINDFLAYER_PATHS = {
//	"assetMessage": "assets/messages",
//	"behaviourScript": "behaviours/scripts",
//	"dispatchJob": "dispatch/jobs",
//	"dispatchTask": "dispatch/tasks",
//	"formResult": "forms",
//	"formTemplate": "forms/templates",
//	"hosCarrier": "hos/carriers",
//	"maintenanceJob": "maintenance/jobs",
//	"maintenanceSchedule": "maintenance/schedules",
//	"providerConfig": "providers/configs",
//	"providerConfiguration": "providers/configurations",
//	"providerRegistration": "providers/registrations",
//	"providerScript": "providers/scripts",
//	"reportResult": "reports/results",
//	"reportSchedule": "reports/schedules",
//	"reportTemplate": "reports/templates",
//	"userGroup": "users/groups",
//};
///**
// * Returns an object
// * @param {!string} type
// * @param {!trakit.json.BaseResponse} response
// * @return {!Object}
// **/
//function MINDFLAYER_RESPONSE_WITHOUT_PAYLOAD(type, response) {
//	return GET_KEYS(response).reduce(function(json, key) {
//		if (key !== type) json[key] = response[key];
//		return json;
//	}, {
//		"errorCode": 1,	// unknown
//	});
//}
///**
// * Creates query-string parameters for requests to Mindflayer.
// * @param {string=} path
// * @param {ParamListConstraints=} constraints
// * @return {!string}
// */
//function MINDFLAYER_CONSTRAINT_QUERY_STRING(path, constraints) {
//	var query = [];
//	if (constraints) {
//		var after, before;
//		if (constraints["includeDeleted"]) query.push("includeDeleted=" + (!!constraints["includeDeleted"]));
//		if (constraints["includeArchive"]) query.push("includeArchive=" + (!!constraints["includeArchive"]));
//		if (!isNaN(constraints["limit"])) query.push("limit=" + ROUND(constraints["limit"]));
//		if (!isNaN(constraints["lowest"])) query.push("lowest=" + ROUND(constraints["lowest"]));
//		if (!isNaN(constraints["highest"])) query.push("highest=" + ROUND(constraints["highest"]));
//		if ((after = DATE(constraints["after"])).isValid()) query.push("after=" + ESCAPE(after.toISOString()));
//		if ((before = DATE(constraints["before"])).isValid()) query.push("before=" + ESCAPE(before.toISOString()));
//		if (!!constraints["first"]) query.push("first=" + String(constraints["first"]).trim());
//		if (!!constraints["last"]) query.push("last=" + String(constraints["last"]).trim());
//		if (constraints["includeSuspended"]) query.push("includeSuspended=" + (!!constraints["includeSuspended"]));
//		if (constraints["includeMessages"]) query.push("includeMessages=" + (!!constraints["includeMessages"]));
//		if (constraints["includeTasks"]) query.push("includeTasks=" + (!!constraints["includeTasks"]));
//		if (constraints["tree"]) query.push("tree=" + (!!constraints["tree"]));
//		if (constraints["includeParent"]) query.push("includeParent=" + (!!constraints["includeParent"]));
//		if (constraints["kind"]) query.push("kind=" + constraints["kind"]);
//		if (constraints["branch"]) query.push("branch=" + (!!constraints["branch"]));
//		if (constraints["trunk"]) query.push("trunk=" + (!!constraints["trunk"]));
//		if (constraints["pending"]) query.push("pending=" + (!!constraints["pending"]));
//	}
//	return query.length
//		? ((path || "").includes("?") ? "&" : "?") + query.join("&")
//		: "";
//}
///**
// * Sends a request to list objects by their company.
// * Also fires the list event same as {@link SyncClient#sync}.
// * @param {!string} type
// * @param {!number} companyId
// * @param {string=} path
// * @param {ParamListConstraints=} constraints
// * @return {!Promise<SyncMindflayer>}
// **/
//function MINDFLAYER_LIST_BY_COMPANY(type, companyId, path, constraints) {
//	return CLIENT.mindflayer(
//		"companies/"
//		+ (IS_NAN(companyId) ? SELECTED.id : companyId)
//		+ "/"
//		+ (path || MINDFLAYER_PATHS[type] || PLURAL(type))
//		+ MINDFLAYER_CONSTRAINT_QUERY_STRING(path, constraints)
//	).next(function(/** SyncMindflayer */ msg) {
//		var response = MINDFLAYER_RESPONSE_WITHOUT_PAYLOAD(type, msg.response);
//		if (msg.response.errorCode === 0) {
//			response[PLURAL(type)] = SyncClient_list(type, msg.response);
//		}
//		me.fire(type + "List", response);
//		return Promise[msg.response.errorCode === 0 ? "resolve" : "reject"](msg);
//	});
//}
///**
// * Sends a request to list objects by their asset.
// * @param {!string} type
// * @param {!number} assetId
// * @param {string=} path
// * @param {ParamListConstraints=} constraints
// * @return {!Promise<SyncMindflayer>}
// **/
//function MINDFLAYER_LIST_BY_ASSET(type, assetId, path, constraints) {
//	return CLIENT.mindflayer("assets/" + assetId + "/" + (path || MINDFLAYER_PATHS[type] || PLURAL(type)) + MINDFLAYER_CONSTRAINT_QUERY_STRING(path, constraints)).next(function(/** SyncMindflayer */ msg) {
//		var response = MINDFLAYER_RESPONSE_WITHOUT_PAYLOAD(type, msg.response);
//		if (msg.response.errorCode === 0) {
//			response[PLURAL(type)] = msg.response.map(function(json) {
//				return SyncClient_merged(type, json);
//			});
//		}
//		me.fire(type + "AssetList", response);
//		return Promise[msg.response.errorCode === 0 ? "resolve" : "reject"](msg);
//	});
//}
///**
// * Sends a request to get a specific object.
// * @param {!string} type
// * @param {!number|string} id
// * @param {string=} path
// * @return {!Promise<SyncMindflayer>}
// **/
//function MINDFLAYER_GET(type, id, path) {
//	return CLIENT.mindflayer(((path || MINDFLAYER_PATHS[type] || PLURAL(type)) + "/" + id).pruneEnd("/")).next(function(/** SyncMindflayer */ msg) {
//		if (msg.response.errorCode === 0) {
//			var updated = [],
//				object = SyncClient_merged(
//					type,
//					msg.response[type],
//					updated
//				);
//			// because the {@link type} could be a value like "provider", we don't want to fire "providerMerged" instead of "providerGeneralMerged".
//			// so we use the {@link SUBSCRIPTION_SPLITS} map to find all the events we need to fire
//			(SUBSCRIPTION_SPLITS[type] || [type]).forEach(function(region, index) {
//				// however, we don't want to fire all events in case one of the parts is not updated.
//				// so we check that each part has changed (based on comparison of version keys) and only fire the appropriate events
//				if (updated[index]) me.fire(region + "Merged", object);
//			});
//		}
//		return Promise[msg.response.errorCode === 0 ? "resolve" : "reject"](msg);
//	});
//}
///**
// * Sends a request to merge an object.
// * Can also be used for batch operations if the PATCH verb is specified.
// * @param {!string} path
// * @param {!Object} json
// * @param {string=} verb
// * @return {!Promise<SyncMindflayer>}
// **/
//function MINDFLAYER_MERGE(type, json, path, verb) {
//	var body = {};
//	body[type] = json;
//	return CLIENT.mindflayer(path || MINDFLAYER_PATHS[type] || PLURAL(type), verb || "POST", body).next(function(/** SyncMindflayer */ msg) {
//		if (msg.response.errorCode === 0) {// && (json["v"] || []).length === 0) {
//			var updated = [],						// an array of parts that were updated.
//				object = SyncClient_merged(
//					type,
//					MERGE(json, msg.response[type]),	// merge request with response
//					updated
//				);
//			// because the {@link type} could be a value like "provider", we don't want to fire "providerMerged" instead of "providerGeneralMerged".
//			// so we use the {@link SUBSCRIPTION_SPLITS} map to find all the events we need to fire
//			(SUBSCRIPTION_SPLITS[type] || [type]).forEach(function(region, index) {
//				// however, we don't want to fire all events in case one of the parts is not updated.
//				// so we check that each part has changed (based on comparison of version keys) and only fire the appropriate events
//				if (updated[index]) me.fire(region + "Merged", object);
//			});
//		}
//		return Promise[msg.response.errorCode === 0 ? "resolve" : "reject"](msg);
//	});
//}
///**
// * Sends a request to delete an object.
// * @param {!string} path
// * @param {!number|string} id
// * @return {!Promise<SyncMindflayer>}
// **/
//function MINDFLAYER_DELETE(type, id, path) {
//	return CLIENT.mindflayer(((path || MINDFLAYER_PATHS[type] || PLURAL(type)) + "/" + id).pruneEnd("/"), "DELETE").next(function(/** SyncMindflayer */ msg) {
//		if (msg.response.errorCode === 0) {
//			var object = SyncClient_deleted(type, msg.response[type]);
//			// we DO NOT use the {@link SUBSCRIPTION_SPLITS} map because the deleted message is "providerDeleted" instead of "providerGeneralDeleted".
//			if (object) me.fire(type + "Deleted", object);
//		}
//		return Promise[msg.response.errorCode === 0 ? "resolve" : "reject"](msg);
//	});
//}
///**
// * Sends a request to restore a deleted object.
// * @param {!string} path
// * @param {!number|string} id
// * @return {!Promise<SyncMindflayer>}
// **/
//function MINDFLAYER_RESTORE(type, id, path) {
//	return CLIENT.mindflayer((path || MINDFLAYER_PATHS[type] || PLURAL(type)) + "/" + id + "/restore", "PATCH").next(function(/** SyncMindflayer */ msg) {
//		if (msg.response.errorCode === 0) {
//			var updated = [],
//				object = SyncClient_merged(
//					type,
//					msg.response[type],
//					updated
//				),
//				// because the {@link type} could be a value like "provider", we don't want to fire "providerMerged" instead of "providerGeneralMerged".
//				// so we use the {@link SUBSCRIPTION_SPLITS} map to find the first region on which to fire the event
//				region = (SUBSCRIPTION_SPLITS[type] || [type])[0];
//			me.fire(region + "Merged", object);
//		}
//		return Promise[msg.response.errorCode === 0 ? "resolve" : "reject"](msg);
//	});
//}
///**
// * Sends a request to suspend an object.
// * @param {!string} path
// * @param {!number|string} id
// * @return {!Promise<SyncMindflayer>}
// **/
//function MINDFLAYER_SUSPEND(type, id, path) {
//	return CLIENT.mindflayer((path || MINDFLAYER_PATHS[type] || PLURAL(type)) + "/" + id + "/suspend", "PATCH").next(function(/** SyncMindflayer */ msg) {
//		if (msg.response.errorCode === 0) {
//			var updated = [],
//				object = SyncClient_merged(
//					type,
//					msg.response[type],
//					updated
//				),
//				// because the {@link type} could be a value like "provider", we don't want to fire "providerMerged" instead of "providerGeneralMerged".
//				// so we use the {@link SUBSCRIPTION_SPLITS} map to find the first region on which to fire the event
//				region = (SUBSCRIPTION_SPLITS[type] || [type])[0];
//			me.fire(region + "Merged", object);
//		}
//		return Promise[msg.response.errorCode === 0 ? "resolve" : "reject"](msg);
//	});
//}
///**
// * Sends a request to revive an object.
// * @param {!string} path
// * @param {!number|string} id
// * @return {!Promise<SyncMindflayer>}
// **/
//function MINDFLAYER_REVIVE(type, id, path) {
//	return CLIENT.mindflayer((path || MINDFLAYER_PATHS[type] || PLURAL(type)) + "/" + id + "/revive", "PATCH").next(function(/** SyncMindflayer */ msg) {
//		if (msg.response.errorCode === 0) {
//			var updated = [],
//				object = SyncClient_merged(
//					type,
//					msg.response[type],
//					updated
//				),
//				// because the {@link type} could be a value like "provider", we don't want to fire "providerMerged" instead of "providerGeneralMerged".
//				// so we use the {@link SUBSCRIPTION_SPLITS} map to find the first region on which to fire the event
//				region = (SUBSCRIPTION_SPLITS[type] || [type])[0];
//			me.fire(region + "Merged", object);
//		}
//		return Promise[msg.response.errorCode === 0 ? "resolve" : "reject"](msg);
//	});
//}
///**
// * Sends a request to do a batch operation on the given array of object JSONs.
// * @param {!string} path
// * @param {!Array.<Object>} array
// * @param {string=} verb
// * @return {!Promise<SyncMindflayer>}
// **/
//function MINDFLAYER_MULTI_MERGE(type, array, path, verb) {
//	var body = {},
//		types = PLURAL(type);
//	body[types] = array;
//	return CLIENT.mindflayer(path || MINDFLAYER_PATHS[type] || types, verb || "PATCH", body).next(function(/** SyncMindflayer */ msg) {
//		if (msg.response.errorCode === 0) {
//			msg.response[types].map(function(json, index) {
//				var updated = [],
//					object = SyncClient_merged(
//						type,
//						json,
//						updated
//					);
//				// because the {@link type} could be a value like "provider", we don't want to fire "providerMerged" instead of "providerGeneralMerged".
//				// so we use the {@link SUBSCRIPTION_SPLITS} map to find all the events we need to fire
//				(SUBSCRIPTION_SPLITS[type] || [type]).forEach(function(region, index) {
//					// however, we don't want to fire all events in case one of the parts is not updated.
//					// so we check that each part has changed (based on comparison of version keys) and only fire the appropriate events
//					if (updated[index]) me.fire(region + "Merged", object);
//				});
//			});
//		}
//		return Promise[msg.response.errorCode === 0 ? "resolve" : "reject"](msg);
//	});
//}
///**
// * Sends a request to do a batch delete on the given array of object JSONs.
// * @param {!string} path
// * @param {!Array.<Object>} array
// * @param {string=} verb
// * @return {!Promise<SyncMindflayer>}
// **/
//function MINDFLAYER_MULTI_DELETE(type, array, path, verb) {
//	var body = {},
//		types = PLURAL(type);
//	body[types] = array;
//	return CLIENT.mindflayer(path || MINDFLAYER_PATHS[type] || types, verb || "DELETE", body).next(function(/** SyncMindflayer */ msg) {
//		if (msg.response.errorCode === 0) {
//			msg.response[types].map(function(json, index) {
//				var object = SyncClient_deleted(type, json);
//				// we DO NOT use the {@link SUBSCRIPTION_SPLITS} map because the deleted message is "providerDeleted" instead of "providerGeneralDeleted".
//				if (object) me.fire(type + "Deleted", object);
//			});
//		}
//		return Promise[msg.response.errorCode === 0 ? "resolve" : "reject"](msg);
//	});
//}
///**
// * Sends a request to search for objects by the given expression.
// * @param {!string} type
// * @param {!string} expression
// * @param {string=} path
// * @param {ParamListConstraints=} constraints
// * @return {!Promise<SyncMindflayer>}
// **/
//function MINDFLAYER_SEARCH(type, expression, path, constraints) {
//	return CLIENT.mindflayer(
//		MINDFLAYER_CONSTRAINT_QUERY_STRING(
//			(path || MINDFLAYER_PATHS[type] || PLURAL(type))
//			+ "?search=" + ESCAPE(expression),
//			constraints
//		)
//	).next(function(/** SyncMindflayer */ msg) {
//		var response = MINDFLAYER_RESPONSE_WITHOUT_PAYLOAD(type, msg.response);
//		if (msg.response.errorCode === 0) {
//			response[PLURAL(type)] = msg.response.map(function(json) {
//				return SyncClient_merged(type, json);
//			});
//		}
//		//me.fire(type + "Search", response);	=> do this?
//		return Promise[msg.response.errorCode === 0 ? "resolve" : "reject"](msg);
//	});
//}
////#endregion Mindflayer helpers

///**
// * Handles all message events from the {@link SyncWorker}.
// * Specifically handles subscription messages from Kraken, and "listing" commands sent to Mindflayer.
// * @param {!trakit.fleetfreedom.MVCEvent} event
// * @param {!SyncMessage} msg
// **/
//function SyncClient_event(event, msg) {
//	var kind = msg.name,
//		content = msg.content,
//		object = content;
//	switch (content["errorCode"]) {
//		case 7:	// sessionExpired
//		case 8:	// userNotLoggedIn
//		case 9:	// sessionKilled
//		case 10:	// loggedOut
//		case 12:	// applicationNotAllowed
//		case 13:	// ipNotAllowed
//			SyncClient_setSessionCookie(/*unset*/);
//			DOC.location = "/logout";
//			break;
//		case 16:	// passwordExpired
//			DOC.location = "/password";
//			break;
//		default:
//			if (content["serverTime"]) {
//				SERVER_EVENT_DTS.setOffset(DATE(content["serverTime"]) - new Date);
//			}
//			break;
//	}
//	switch (kind) {
//		case "sessionEnded":
//		case "logoutResponse":
//			SyncClient_setSessionCookie(/*unset*/);
//			DOC.location = "/logout";
//			break;
//		case "connection":
//			object = CLONE(content);
//			if (content["errorCode"] === 0) {
//				SyncClient_sessionDetails(kind, content);
//				SyncClient_sessionGeneralMerged();
//				SyncClient_sessionAdvancedMerged();
//				me.fire("connected");
//				if (initialized) {
//					// we only do this after init (for reconnect) because the first switchCompany must come after initialized
//					SyncClient_reinitialize();
//				}
//			} else {
//				OPAQUE.create(
//					ns.words["error"],
//					'<p>' + trakit_kraken["errorCodes"][content["errorCode"]] + '</p>'
//					+ '<p class="smallcopy">' + (content["message"] || "") + '</p>',
//					[new OpaqueChoice("reset", "large submit", ns.words["retry"], function() {
//						DOC.location = "/manager";
//					})]
//				);
//				OPAQUE.hide();
//			}
//			break;
//		case "disconnection":
//			//object = content;
//			break;
//		case "assetAlert":
//			// do nothing, just let the event fire
//			break;
//		case "broadcast":
//			switch (content["kind"]) {
//				case "maintenance":
//					//	debugger;
//					broadcastMaintenanceCallback(content);
//					break;
//				case "upgrade":
//					var eta = DATE(content["eta"]),
//						timeout = (eta - new Date) + (3 * 1000);
//					BROADCAST_UPGRADE_RELOAD = !!content["reload"];
//					BROADCAST_UPGRADE_TIMER = RESET_TIMER(
//						BROADCAST_UPGRADE_TIMER,
//						broadcastUpgradeCallback,
//						timeout
//					);
//					NOTIFY.show(new Notice(
//						"broadcast." + content["kind"],
//						"/images/broadcast_" + content["kind"] + ".png",
//						ns["BroadcastType"][content["kind"]],
//						ns["BroadcastMessage"][content["kind"]].replace("%ETA%", eta.contextString(null, 1, BLANK_DATE_CONTEXT_DETAIL)),
//						"report",
//						function() {
//							BROADCAST_UPGRADE_RELOAD = true;
//							broadcastUpgradeCallback();
//						},
//						timeout
//					));
//					break;
//			}
//			break;
//		case "dispatchTaskMerged":
//			kind = "dispatchTask";//kind.slice(0, -("Merged").length);
//			object = SyncClient_merged(kind, content);
//			if (SyncClient_filterDispatchTask(object)) {
//				SyncClient_deleted(kind, content);
//				kind += "Deleted";
//			} else {
//				kind += "Merged";
//			}
//			break;
//		case "dispatchJobMerged":
//			kind = "dispatchJob";//kind.slice(0, -("Merged").length);
//			object = SyncClient_merged(kind, content);
//			if (SyncClient_filterDispatchJob(object)) {
//				SyncClient_deleted(kind, content);
//				kind += "Deleted";
//			} else {
//				kind += "Merged";
//			}
//			break;
//		case "loginResponse":
//		case "getSessionDetailsResponse":
//			SyncClient_sessionDetails(kind, content);
//			SyncClient_sessionGeneralMerged();
//			SyncClient_sessionAdvancedMerged();
//			object = SESSION;
//			break;
//		case "sessionGeneralMerged":
//			SyncClient_sessionDetails(kind, {
//				"user": content,
//			});
//			SyncClient_sessionGeneralMerged();
//			object = SESSION;
//			break;
//		case "sessionAdvancedMerged":
//			SyncClient_sessionDetails(kind, {
//				"user": content,
//			});
//			SyncClient_sessionAdvancedMerged();
//			object = SESSION;
//			break;
//		default:
//			switch ((kind.match(/[A-Z][a-z]+$/) || [])[0]) {
//				case "Suspended":
//					// mark kind as "merged", and is processed the same as merged objects
//					// also raises {kind}Merged event instead of {kind}GeneralMerged
//					kind = kind.slice(0, -("Suspended".length)) + "GeneralMerged";
//				//=> no break
//				case "Merged":
//					object = SyncClient_merged(kind.slice(0, -("Merged").length), content);
//					break;
//				case "Deleted":
//					object = SyncClient_deleted(kind.slice(0, -("Deleted").length), content);
//					break;
//				case "List":
//					// "{kind}List is a pseudo-event sent by SyncWorker
//					if (content["errorCode"] === 0) {
//						var type = kind.slice(0, -("List".length));
//						object = CLONE(content);
//						object[PLURAL(type)] = SyncClient_list(type, content);
//					}
//					break;
//			}
//			break;
//	}
//	if (object) {
//		me.fire(kind, object);
//	} else {
//		// what's this?
//		console.warn(msg);
//	}
//	return object;
//}
///**
// * After connecting to the WebSocket, we need to get the company we had previously selected in order to re-synchronize.
// * @return {!Promise}
// **/
//function SyncClient_reinitialize() {
//	var selectedId = ID(GET_COOKIE(COOKIE_COMPANY));
//	return me.switchCompany(
//		selectedId > -1
//			? selectedId
//			: (SESSION.company.id || ns.reseller["id"]),	// the forces master account users to default to the reseller's company
//		true
//	);
//}
///**
// * Sets the {@link SESSION_ID} and {@link SESSION_EXPIRY}, and also sets the `ghostId` cookie with those values.
// * @param {{ghostId:string,expiry:string}=} data
// **/
//function SyncClient_setSessionCookie(data) {
//	if (!data) data = {};
//	var cookie = SET_COOKIE(
//		COOKIE_SESSION,
//		SESSION_ID = data[COOKIE_SESSION] || "",
//		"/",
//		SESSION_EXPIRY = DATE(data["expiry"] || SESSION_EXPIRY || 0)
//	);
//	if (CLIENT_DEBUG) console.warn("SyncClient_setSessionCookie", data, cookie);
//}
///**
// * Saves the current user's session details and metric preferences.
// * This is done for session__Merged messages and other messages where the {@link trakit.json.RespSelfDetails} is present.
// * @param {!string} messageName
// * @param {!trakit.json.RespSelfDetails} sessionDetails
// **/
//function SyncClient_sessionDetails(messageName, sessionDetails) {
//	if (CLIENT_DEBUG) console.log("SyncClient_sessionDetails", messageName, sessionDetails);
//	switch (messageName) {
//		case "sessionGeneralMerged":
//		case "sessionAdvancedMerged":
//			messageName = "user" + messageName.slice("session".length, -("Merged".length));
//			break;
//		case "connection":
//		default:
//			messageName = "user";
//			break;
//	}
//	var metric = UserMeasurementPreference.metric,
//		jsonUser = sessionDetails.user,
//		jsonContact = jsonUser.contact,
//		company = getOrAddCompanyById(jsonUser["company"]);
//	if (jsonContact) {
//		// convert contact into object and re-set ID as value
//		jsonUser.contact = SyncClient_merged("contact", jsonContact).id;
//	}
//	if (jsonUser.groups) {
//		// get the user's groups and convert them to IDs
//		jsonUser.groups.forEach(function(jsonGroup, index) {
//			jsonUser.groups[index] = SyncClient_merged("userGroup", jsonGroup).id;
//		});
//	}
//	SESSION = SyncClient_merged(messageName, jsonUser);
//	METRIC_DISTANCE = SESSION.measurements.get("distance") === metric;
//	METRIC_SPEED = SESSION.measurements.get("speed") === metric;
//	METRIC_TEMP = SESSION.measurements.get("temperature") === metric;
//	METRIC_PRESSURE = SESSION.measurements.get("pressure") === metric;
//	METRIC_VOLUME = SESSION.measurements.get("volume") === metric;
//	METRIC_FUEL = SESSION.measurements.get("fuel") === metric;
//	METRIC_WEIGHT = SESSION.measurements.get("weight") === metric;

//	if (COOKIE_SESSION in sessionDetails || "expiry" in sessionDetails) {
//		SyncClient_setSessionCookie({
//			"ghostId": sessionDetails[COOKIE_SESSION],
//			"expiry": sessionDetails["expiry"],
//		});
//	}

//	return company;
//}
///**
// * All objects retrieved by Mindflayer or synchonized by Kraken are updated/created using this method.
// * @param {!string} type
// * @param {!Object} json
// * @param {Array.<boolean>=} updated		An empty array given to the function which is then populated with true for each part of the object that was updated.
// * @returns {trakit.fleetfreedom.MVCObject}
// **/
//export function SyncClient_merged(type, json, updated) {
//	if (CLIENT_DEBUG) console.log("SyncClient_merged", type, json);
//	/**
//	 * The company that owns the object being merged.
//	 * @type {trakit.fleetfreedom.Company}
//	 **/
//	var company = getOrAddCompanyById(json["company"]);
//	/**
//	 * This is the object constructed from a Zombie class from the given json literal.
//	 * @type {trakit.fleetfreedom.MVCObject}
//	 **/
//	var object = null;
//	/**
//	 * The version flags from the {@link object} before it was updated.
//	 * Used at the end to update the {@link updated} array.
//	 * @type {Array.<number>}
//	 **/
//	var oldVersion = [];

//	// find the object and update it based on the JSON
//	switch (type.toCapital(true)) {
//		case "asset":
//		case "assetGeneral":
//		case "assetAdvanced":
//		case "assetDispatch":
//			// special case for assets because they can be created with multiple Klasses...
//			object = company.getAssetById(json["id"]);
//			if (object) {
//				oldVersion = object.version.slice();
//				object.fromJSON(
//					VERSION_KEYS_FIXER(
//						json,
//						VERSION_KEYS_ASSET[type.slice("asset".length).toLowerCase()]
//					)
//				);
//			} else if (json["kind"]) {
//				// only asset+assetGeneral has kind, so only creates if it has kind
//				object = company["create" + json["kind"].toCapital()](
//					VERSION_KEYS_FIXER(
//						json,
//						VERSION_KEYS_ASSET[type.slice("asset".length).toLowerCase()]
//					)
//				);
//				oldVersion = object.version.map(function() { return NaN; });
//			}
//			break;
//		case "assetMessage":
//			object = SyncClient_merged_addOrUpdate(
//				"Message",
//				json,
//				company,
//				oldVersion
//			);
//			break;
//		case "place":
//		case "placeGeneral":
//			object = SyncClient_merged_addOrUpdate(
//				"Place",
//				json,
//				company,
//				oldVersion
//			);
//			break;
//		case "user":
//		case "userGeneral":
//		case "userAdvanced":
//			object = SyncClient_merged_addOrUpdate(
//				"User",
//				VERSION_KEYS_FIXER(json, VERSION_KEYS_GENADV[type.slice("user".length).toLowerCase()]),
//				company,
//				oldVersion
//			);
//			break;
//		case "provider":
//		case "providerGeneral":
//		case "providerAdvanced":
//		case "providerControl":
//			object = SyncClient_merged_addOrUpdate(
//				"Provider",
//				VERSION_KEYS_FIXER(
//					json,
//					VERSION_KEYS_PROVIDER[type.slice("provider".length).toLowerCase()]
//				),
//				company,
//				oldVersion
//			);
//			break;

//		case "company":
//		case "companyGeneral":
//		case "companySettings":
//		case "companyDirectory":
//		case "companyLabels":
//		case "companyPolicies":
//			object = getOrAddCompanyById(json["id"], json["parent"]);
//			oldVersion = object.version.slice();
//			object.fromJSON(VERSION_KEYS_FIXER(json, VERSION_KEYS_COMPANY[type.slice("company".length).toLowerCase()]));
//			break;
//		case "companyReseller":
//			json = {
//				"id": json["id"],
//				"parent": json["parent"],
//				"v": json["v"],
//				"reseller": json,
//			};
//			company = getOrAddCompanyById(json["id"], json["parent"]);
//			oldVersion = company.version.slice(VERSION_KEYS_COMPANY["reseller"]);
//			company.fromJSON(VERSION_KEYS_FIXER(json, VERSION_KEYS_COMPANY[type.slice("company".length).toLowerCase()]));
//			object = company.reseller;	// return reseller instead of company
//			break;

//		case "translation":
//			object = new DbTranslation(json);
//			// version is not populated
//			break;
//		case "dashcam":
//			object = new DashcamData(json);
//			// version is not populated
//			//updated.push(true);
//			break;

//		case "providerRegistration":
//		// version is not populated
//		//updated.push(true);
//		default:
//			object = SyncClient_merged_addOrUpdate(
//				type.toCapital(),
//				json,
//				company,
//				oldVersion
//			);
//	}

//	if (updated && object && object.version) {
//		// update the {@link updated} by comparing the old version of the object to the new version.
//		oldVersion.forEach(function(previous, index) {
//			// since the old version could be NaN, this is the easiest way to compare that the new version is different.
//			updated[index] = !(previous === this[index]);
//		}, object.version);
//	}

//	// return the object
//	return object;
//}
///**
// * Finds the Zombie object of the given typeName, and if found, updates it with the given json.
// * If not found, creates it with the given json.
// * Also populates the given oldVersion array with the previous version flags of the found object.
// * If not found, populates it with the correct number of NaNs.
// * @param {!string} typeName
// * @param {!Object} json
// * @param {!trakit.fleetfreedom.Company} company
// * @param {!Array.<number>} oldVersion
// **/
//function SyncClient_merged_addOrUpdate(typeName, json, company, oldVersion) {
//	var keyName = syncKeyName(typeName.toCapital(true)),
//		object = company["get" + typeName + "ById"](json[keyName]);
//	if (object) {
//		if (object.version) oldVersion.inject(object.version);
//		object.fromJSON(json);
//	} else {
//		object = company["create" + typeName](json);
//		if (object.version) oldVersion.inject(object.version.map(function() { return NaN; }));
//	}
//	return object;
//}
///**
// * Finds the Zombie object by the given type and removes it from its company.
// * Then, returns the object or null if not found.
// * @param {!string} type
// * @param {!Object} json
// * @returns {trakit.fleetfreedom.MVCObject}
// **/
//function SyncClient_deleted(type, json) {
//	if (CLIENT_DEBUG) console.log("SyncClient_deleted", type, json);
//	/**
//	 * The company that owns the object being deleted.
//	 * @type {trakit.fleetfreedom.Company}
//	 **/
//	var company;

//	// find the object type name
//	switch (type.toCapital(true)) {
//		//case "asset":
//		case "assetGeneral":
//		case "assetAdvanced":
//		case "assetDispatch":
//			type = "Asset";
//			break;
//		case "assetMessage":
//			type = "Message";
//			break;
//		//case "place":
//		case "placeGeneral":
//			type = "Place";
//			break;
//		//case "user":
//		case "userGeneral":
//		case "userAdvanced":
//			type = "Place";
//			break;
//		//case "provider":
//		case "providerGeneral":
//		case "providerAdvanced":
//		case "providerControl":
//			type = "Provider";
//			break;

//		case "company":
//		case "companyGeneral":
//		case "companyBilling":
//		case "companyDirectory":
//		case "companyLabels":
//		case "companyPolicies":
//			company = COMPANIES.get(json["id"]);
//			if (company) {
//				COMPANIES.delete(company.id);
//				company.version[0] = json["v"][0];	// just version, not fromJSON in case it breaks things
//			}
//			return company || null;	// return, not break
//		case "companyReseller":
//			company = COMPANIES.get(json["id"]);
//			/**
//			 * The reseller profile being deleted.
//			 * @type {trakit.fleetfreedom.CompanyReseller}
//			 **/
//			var reseller = (company || {}).reseller || null;
//			if (reseller) {
//				company.fromJSON(
//					VERSION_KEYS_FIXER(
//						{
//							"id": json["id"],
//							"parent": json["parent"],
//							"v": json["v"].slice(),
//							"reseller": json,
//						},
//						VERSION_KEYS_COMPANY["reseller"]
//					)
//				);
//				// Company#fromJSON will remove the company.reseller if it's deleted
//			}
//			return reseller;	// return, not break
//		case "translation":
//			return null;	// return, not break
//	}
//	// get owner company
//	company = getOrAddCompanyById(json["company"]);
//	// remove it
//	var object = company["remove" + type.toCapital()](json[syncKeyName(type)]);
//	// update version key
//	if (object && object["version"]) {
//		// just version, not MVCObject#fromJSON in case it breaks things
//		object["version"][0] = json["v"][0];
//	}
//	return object;
//}
///**
// * Similar to {@link SyncClient_merged}, but works on lists of objects and internally invokes {@link SyncClient_merged}.
// * @param {!string} type
// * @param {!Object} json
// * @returns {trakit.fleetfreedom.MVCObject}
// **/
//function SyncClient_list(type, json) {
//	if (CLIENT_DEBUG) console.log("SyncClient_list", type, json);
//	/**
//	 * The name of the collection being updated.
//	 * @type {!string}
//	 **/
//	var collectionName;
//	/**
//	 * A way to forcibly filter collections so that some objects can be removed.
//	 * @type {Function}
//	 **/
//	var filter;

//	// find the object colection by type name
//	switch (type.toCapital(true)) {
//		// special cases go here
//		case "company":
//		case "companyGeneral":
//		case "companyBilling":
//		case "companyDirectory":
//		case "companyLabels":
//		case "companyPolicies":
//		case "companyReseller":
//			// return, not break
//			return json["companies"].map(function(obj) {
//				return SyncClient_merged(type, obj);
//			});
//		case "asset":
//		case "assetGeneral":
//		case "assetAdvanced":
//		case "assetDispatch":
//			// return, not break
//			return json["assets"].map(function(obj) {
//				return SyncClient_merged(type, obj);
//			});
//		case "translation":
//			// return, not break
//			return json["translations"].map(function(trans) {
//				return new DbTranslation(trans);
//			});

//		// renaming types goes down here
//		case "assetMessage":
//			collectionName = type + "s";	// assetMessages
//			type = "message";
//			break;
//		case "placeGeneral":
//		case "userGeneral":
//		case "userAdvanced":
//		case "providerGeneral":
//		case "providerAdvanced":
//		case "providerControl":
//			type = type.match(/[a-z]+/)[0];
//			collectionName = PLURAL(type);	// places/providers/users
//			break;

//		case "dispatchTask":
//			collectionName = PLURAL(type);
//			filter = SyncClient_filterDispatchTask;
//			break;
//		case "dispatchJob":
//			collectionName = PLURAL(type);
//			filter = SyncClient_filterDispatchJob;
//			break;
//		case "dashcam":
//			return json["dashcams"].map(function(/** @type {trakit.json.DashcamData} */dashcam) {
//				return new DashcamData(dashcam);
//			});
//		default:
//			collectionName = PLURAL(type);
//			break;
//	}

//	/**
//	 * The name of the klass of objects being updated.
//	 * This is just the type capitalized.
//	 * @type {!string}
//	 **/
//	var zombieName = type.toCapital();
//	/**
//	 * Name of the "unique identifier" for this type of object.
//	 * @type {!string}
//	 **/
//	var keyName = syncKeyName(type);
//	/**
//	 * The objects as sent by the server.
//	 * @type {!Array.<Object>}
//	 **/
//	var objects = json[collectionName];
//	/**
//	 * The company that owns the object being merged.
//	 * @type {trakit.fleetfreedom.Company}
//	 **/
//	var company = getOrAddCompanyById(json["company"]["id"]);
//	/**
//	 * All the exising identifiers.
//	 * @type {!Array.<number>|Array.<string>}
//	 **/
//	var toBeRemoved = company[collectionName].map(function(obj) {
//		return obj[keyName];
//	});
//	/**
//	 * The objects as instances of a Zombie class.
//	 * @type {!Array.<trakit.fleetfreedom.MVCObject>}
//	 **/
//	var instances = objects.map(function(obj) {
//		var id = obj[keyName],
//			owner = obj["company"] === company.id
//				// this object is from the requested company
//				? company
//				// but some listing command responses are for IGlobal objects and will be from other companies...
//				// we aren't getting a full list from that company though, so we only add/update, not replace the collection
//				: getOrAddCompanyById(obj["company"]),
//			// get the existing instance
//			instance = owner["get" + zombieName + "ById"](id);
//		// if the instance exists, update it; otherwise create it
//		if (instance) instance.fromJSON(obj);
//		else instance = owner["create" + zombieName](obj);
//		// if results are filtered, and the filter returns true
//		// force the instance to be removed in the next phase
//		if (filter && filter(instance)) {
//			toBeRemoved.push(id);
//			instance = null;
//		} else {
//			// remove ID from list of "to-be-removed" IDs
//			toBeRemoved.remove(id);
//		}
//		return instance;
//	}).remove(null);
//	/**
//	 * Maximum ID, in case a new object is added by socket before the list loads.
//	 * We should only remove items with a smaller ID (like in Headless Horseman).
//	 * Unfortunately, this does not work for Users, Machines, Providers, ProviderRegistrations, or Sessions.
//	 * @type {!number|string}
//	 **/
//	var maxToBeRemoved = toBeRemoved.max();
//	// now we loop through all the IDs from before synchronizing the list
//	// and remove anything that was not given
//	toBeRemoved.forEach(
//		// if the max ID is numeric, then we only remove those objects with a smaller ID.
//		IS_AN(maxToBeRemoved)
//			? function(id) {
//				if (id <= maxToBeRemoved) company["remove" + zombieName](id);
//			}
//			: function(id) {
//				company["remove" + zombieName](id);
//			}
//	);

//	// return the instances
//	return instances;
//}
///**
// * Returns true if the task should be removed (it was completed on a previous day).
// * @param {!trakit.fleetfreedom.DispatchTask} task
// * @return {!boolean}
// **/
//function SyncClient_filterDispatchTask(task) {
//	return task.status === TaskStatus.cancelled
//		|| task.completed < Date.midnight();
//}
///**
// * Returns true if the job should be removed (it was completed on a previous day).
// * @param {!trakit.fleetfreedom.DispatchJob} job
// * @return {!boolean}
// **/
//function SyncClient_filterDispatchJob(job) {
//	return job.tags.includes(DISPATCH_JOB_CANCELLED)
//		|| (
//			job.status === DispatchStepStatus.completed
//			&& job.updated < Date.midnight()
//		);
//}


///**
// * Replaces the version array with an array with the appropriate version key in the correct index
// * @param {!Object} json
// * @param {!number} index
// * @return {!Object} json
// **/
//function VERSION_KEYS_FIXER(json, index) {
//	if (IS_AN(index)) {
//		var version = json["v"] ? json["v"][0] : -1;
//		json["v"] = [];
//		for (var i = 0, l = index + 1; i < l; i++) {
//			json["v"][i] = i === index ? version : -1;
//		}
//	}
//	return json;
//}
///**
// * A map of merge message types for Asset objects.
// * @type {Object.<string,number>}
// **/
//var VERSION_KEYS_ASSET = {
//	"general": 0,
//	"advanced": 1,
//	"dispatch": 2,
//};
///**
// * A map of merge message types for objects that follow the __GeneralMerged and __AdvancedMerged formats
// * @type {Object.<string,number>}
// **/
//var VERSION_KEYS_GENADV = {
//	"general": 0,
//	"advanced": 1,
//};
///**
// * A map of merge message types for the Place objects
// * @type {Object.<string,number>}
// **/
//var VERSION_KEYS_PLACE = {
//	"general": 0,
//	"extended": 1,
//};
///**
// * A map of merge message types for the Company objects
// * @type {Object.<string,number>}
// **/
//var VERSION_KEYS_COMPANY = {
//	"general": 0,
//	//"settings": 1,
//	"directory": 2,
//	"labels": 3,
//	"policies": 4,
//	"reseller": 5,
//};
///**
// * A map of merge message types for Provider objects.
// * @type {Object.<string,number>}
// **/
//var VERSION_KEYS_PROVIDER = {
//	"general": 0,
//	"advanced": 1,
//	"control": 2,
//};

///**
// * Timer to wait to send preferences.
// * @type {!number}
// **/
//var SyncClient_sessionGeneral_updateLanguage = 0;
///**
// * Handles changes to the session details and permissions
// **/
//function SyncClient_sessionGeneralMerged() {
//	SERVER_EVENT_DTS.setFormat(SESSION.formats.get("date") + " " + SESSION.formats.get("time"));
//	if (SESSION.passwordExpired) {
//		DOC.location = "/password";
//	} else if (!SESSION.language) {
//		SyncClient_sessionGeneral_updateLanguage = CLEAR_TIMER(SyncClient_sessionGeneral_updateLanguage) || 0;
//		SyncClient_sessionGeneral_updateLanguage = SET_TIMER(function() {
//			if (REGION_STRING) {
//				me.updateOwnPreferences({
//					"language": REGION_STRING,
//				});
//			}
//			SyncClient_sessionGeneral_updateLanguage = 0;
//		}, 5 * 1000);
//	}
//}
///**
// * Handles changes to the session details and permissions
// **/
//function SyncClient_sessionAdvancedMerged() {
//	SESSION_GROUP_PERMISSIONS = SESSION.getUserGroups().gather("permissions").flatten();
//}
////#endregion SyncClient

///**
// * Finds a company by id, and if not found will add it.
// * @param {!number} id		Unieque identifier of the company.
// * @param {number=} parent	Default 0.
// * @return {trakit.fleetfreedom.Company}
// **/
//function getOrAddCompanyById(id, parent) {
//	return IS_NAN(id)
//		? null
//		: COMPANIES.getOrSetResult(id, function() {
//			return new Company({
//				"id": id,
//				"parent": parent || 0,
//				"name": ns.words["unknown"] + " " + id,
//			});
//		});
//}
	



////#region Generics
//// these don't work for all object types like: CompanyReseller, BehaviourLog, Session, Dashcam, DispatchTasks
//me.get = function(type, id) { return MINDFLAYER_GET(type, ESCAPE((id || "").trim())); };
//me.list = function(type, companyId, constraints) { return MINDFLAYER_LIST_BY_COMPANY(type, companyId, null, constraints); };
//me.listByAsset = function(type, assetId, constraints) {
//	return MINDFLAYER_LIST_BY_ASSET(
//		type,
//		assetId,
//		null,
//		constraints
//	);
//}
//me.merge = function(type, json) { return MINDFLAYER_MERGE(type, json); };
//me.remove = function(type, id) { return MINDFLAYER_DELETE(type, id); };
//me.restore = function(type, id) { return MINDFLAYER_RESTORE(type, id); };
//me.suspend = function(type, id) { return MINDFLAYER_SUSPEND(type, id); };
//me.revive = function(type, id) { return MINDFLAYER_REVIVE(type, id); };
//me.batch = function(type, array) { return MINDFLAYER_MULTI_MERGE(type, array); };
//me.purge = function(type, array) { return MINDFLAYER_MULTI_DELETE(type, array); };
////#endregion Generics








/**
 * This is the class which does the work in the background {@link Worker} for the {@link SyncClient}.
 * It handles synchronizing regions, maintaining a connection to Trak-iT's WebSocket, and send HTTP requests to Trak-iT's RESTful service.
 * This class also maintains a queue of up-going messages.
 **/
export class TrakitSyncCommander extends TrakitCommander<any> {
	/**
	 * The Trak-iT WebSocket's main connection.
	 **/
	#socket: TrakitSocketCommander;
	/**
	 * The Trak-iT RESTful service.
	 **/
	#rest: TrakitRestfulCommander;

	//#region Subscriptions
	/**
	 * All active subscriptions per company.
	 **/
	#subscriptions: Map<number, SubscribedRegions> = new Map;
    
	/**
	 * Callback used to clear expired subscriptions from the dictionary.
	 * Also resets the timer after sending unsubscribe Promise to Trak-iT's WebSocket is resolved.
	 **/
	#subscriptionExpirer() {
		const expirations: Promise<Reply>[] = [];
		if (this.#socket.state === TrakitSocketStatus.open) {
			this.#subscriptions.forEach((subscribed, companyId) => {
				const expired = subscribed.purgeExpired();
				if (expired.length) expirations.push(this.#unsubscribe(companyId, expired));
			});
		}
		Promise.allSettled(expirations).finally(() => {
			this.#subscriptionTimer = setTimeout(
				() => this.#subscriptionExpirer(),
				TIMEOUT_SUBSCRIPTION
			);
		});
	}
	/**
	 * Handle for the auto-remove expired subscription types.
	 **/
	#subscriptionTimer!: number;

	/**
	 * Sends a (un)subscribe command to the Trak-iT WebSocket for the given company and regions.
	 **/
	#subscribe(company: ulong, regions: SubscriptionType[]): Promise<RepSubscription> {
		return this.#socket.command(new PaySubscriptionMerge({
			company: { id: company },
			subscriptionTypes: regions,
		}));
	}
	/**
	 * Sends a (un)subscribe command to the Trak-iT WebSocket for the given company and regions.
	 **/
	#unsubscribe(company: ulong, regions: SubscriptionType[]): Promise<RepSubscription> {
		return this.#socket.command(new PaySubscriptionDelete({
			company: { id: company },
			subscriptionTypes: regions,
		}));
	}
	/**
	 * Returns (and creates a reference if needed) the subscriptions for the given company.
	 * @param company
	 **/
	#getCurrentSubscriptions(company: ulong): SubscribedRegions {
		let subs = this.#subscriptions.get(company);
		if (!subs) this.#subscriptions.set(company, subs = new SubscribedRegions)
		return subs;
	}
	//#endregion Subscriptions


	onOpen?: (account: RepSelfGet) => void;
	onAccount?: (account: RepSelfGet) => void;
	onMessage?: (kind: string, content: JsonObject) => void;
	onResponse?: (response: Reply) => void;
	onClose?: (account: Reply) => void;

	onReplace?: (kind: SyncName, companyId: ulong, list: IRequestable[]) => void;
	onUpdate?: (kind: SyncName, companyId: ulong, object: IRequestable) => void;
	onDelete?: (kind: SyncName, companyId: ulong, key: ulong | string) => void;


	constructor(
		account?: RepSelfGet | { machine: { key: string } }
			| Machine | { key: string }
			| { ghostId: guid }
			| guid
			| nothing,
		useBeta?: boolean | nothing
	) {
		super(null, account);
		this.#rest = new TrakitRestfulCommander(
			useBeta
				? TrakitRestfulCommander.URI_BETA
				: TrakitRestfulCommander.URI_PROD,
			this.account
		);
		this.#socket = new TrakitSocketCommander(
			useBeta
				? TrakitSocketCommander.URI_BETA
				: TrakitSocketCommander.URI_PROD,
			this.account
		);
		this.#socket.onOpen = (account) => this.#onOpen(account);
		this.#socket.onAccount = (account) => this.#onAccount(account);
		this.#socket.onClose = (reply) => this.#onClose(reply);
		this.#socket.onMessage = (kind, body) => this.#onMessage(kind, body);
		this.#socket.onError =  (reply) => this.#onError(reply);
	}
	/**
	 * Disconnects the Trak-iT WebSocket then sends a message to the {@link SyncClient} about it, then dies.
	 * Does not terminate the {@link Worker}.
	 **/
	dispose() {
		// this.#rest?.dispose();
		this.#socket.dispose();
		(this.#rest as any) =
			(this.#socket as any) = null;
	}

	/**
	 * Overridden to set the authentication for both the RESTful service and WebSocket.
	 * @param value 
	 */
	override setAuth(
		value?: RepSelfGet | { machine: { key: string } }
				| Machine | { key: string; }
				| { ghostId: guid; }
				| guid
				| nothing
	): void {
		super.setAuth(value);
		this.#rest?.setAuth(this.account);
		this.#socket?.setAuth(this.account);
	}

	/**
	 * Overridden to route commands to either the Trak-iT WebSocket or RESTful service based on the type of action.
	 * @param payload 
	 * @returns 
	 */
	override command<TReply extends Reply>(payload: Payload): Promise<TReply> {
		const action = payload.getAction();
		switch (action.object as string) {
			case "Subscription":
			case "Self":
				return this.#socket.command<TReply>(payload);
			default:
				return this.#rest.command<TReply>(payload);
		}
	}
	override _createRequest(payload: Payload): any { throw new Error("Method not implemented."); }
	override _relayRequest(request: Payload): Promise<any> { throw new Error("Method not implemented."); }

	/**
	 * Handles the "connection" event from the Trak-iT WebSocket.
	 * This will update the global {@link SESSION_ID}, sends a {@link SyncMessage} to the {@link SyncClient},
	 * and re-subscribe to any regions that were subscribed to before the disconnection occured.
	 * Also restarts the subscription expirer.
	 * @param account 
	 */
	#onOpen(account: RepSelfGet) {
		this.setAuth(account);
		this.#subscriptions.forEach((current, companyId) => {
			// remove all regions from in-sync list; ALL OF THEM.
			// but, re-sync to the ones that were not going to expire
			// this will also auto-get lists of objects
			this.sync(
				companyId,
				SUBS_TO_SYNCS(current.reset())
			);
		});
		// start expired subscription timer
		this.#subscriptionExpirer();
		this.onOpen?.(account);
		this.onAccount?.(account);
	}
	/**
	 * 
	 * @param account 
	 */
	#onAccount(account: RepSelfGet) {
		this.setAuth(account);
		this.onAccount?.(account);
	}
	/**
	 * Handles the "disconnection" event from the Trak-iT WebSocket.
	 * Stops the subscription expirer (it is restarted on re-connection).
	 * Also sends a {@link SyncMessage} to the {@link SyncClient}.
	 * @param reply 
	 **/
	#onClose(reply: Reply) {
		// stop trying to remove expired subscriptions
		clearTimeout(this.#subscriptionTimer);
		this.#subscriptionTimer = 0;
		// we don't remove any subscriptions, they remain until explicitly unsubscribed or expired
		// they are re-subscribed when we reconnect in {@link #onOpen}
		this.onClose?.(reply);
	}

	/**
	 * Handles message events from the Trak-iT WebSocket.
	 * Also sends a {@link SyncMessage} to the {@link SyncClient}.
	 * @param kind 
	 * @param content 
	 **/
	#onMessage(kind: string, content: JsonObject) {
		this.onMessage?.(kind, content);
		const operation = MSG_SYNC.exec(kind) as string[];
		if (operation?.length) {
			const type = makeObjectName(operation[1]),
				companyId = (type.startsWith("Company") ? content["parent"] : content["company"]) as ulong,
				key = getJsonKeyValue(content, type);
			switch (operation[2]) {
				case "Merged":
				case "Suspended":
					const object = storage[type].get(key);
					if (object) this.onUpdate?.(type, companyId, object);
					break;
				case "Deleted":
					this.onDelete?.(type, companyId, key);
					break;
			}
		}
	}
	/**
	 * 
	 * @param error 
	 **/
	#onError(error: Reply) {
		// what do?
	}

	/**
	 * Checks if the given {@link types} are currently synchronized for the given {@param companyId}.
	 * @param companyId 
	 * @param types 
	 * @returns 
	 */
	isSynced(companyId: ulong, types: SyncName[]): boolean {
		const current = this.#getCurrentSubscriptions(companyId),
			requested = SYNCS_TO_SUBS(types);
		return requested.every(sub => current.regions.includes(sub))
			&& this.#socket.state === TrakitSocketStatus.open;
	}
	/**
	 * Begins synchronizing the given regions.
	 * If all regions are in-sync, the returned Promise is resolve immediately.
	 * Otherwise it sends a subscribe command to the Trak-iT WebSocket for any out-of-sync regions,
	 * and when the subscribe is resolved, it sends commands to list the objects for the requested {@param types} (except Company, which is not listed, but "getted").
	 * @param companyId
	 * @param types
	 **/
	async sync(companyId: ulong, types: SyncName[]) {
		const promises: Promise<Reply>[] = [],
			current = this.#getCurrentSubscriptions(companyId),
			requested = SYNCS_TO_SUBS(types).filter(sub => !current.regions.includes(sub));
		if (requested.length > 0) {
			const subscribed = (await this.#socket.subscribe(companyId, requested)).merged as SubscriptionType[];
			// remove expiration from any requested subscriptions, not new subscriptions
			// some subscriptions may have been requested to be removed before re-synching
			current.removeExpiries(requested);
			
			// once subscriptions are made, find the SyncNames that need to be requested
			SUBS_TO_SYNCS(subscribed).forEach(type => {
				const SyncPayload = makePayloadClass(
					type,
					type.startsWith("Company")
						? "Get" :
						"ListByCompany"
				);
				if (SyncPayload) {
					promises.push(this.command<Reply>(new SyncPayload({
						company: { id: companyId },
					})));
				} else {
					console.warn(`No payload could be made for sync type ${type}`);
				}
			});
		}
		return Promise.all(promises);
	}
	/**
	 * Adds the {@param types} to the list of expiring subscriptions.
	 * The process is not immediate, but happens after a timeout.
	 * This allows the service to re-request sync on a region, like when switching sections.
	 * @param companyId
	 * @param types
	 **/
	async desync(companyId: ulong, types: SyncName[]) {
		const current = this.#getCurrentSubscriptions(companyId),
			requested = types.reduce((acc, s) => acc.concat(OBJECT_SUBSCRIPTIONS[s] || []), [] as SubscriptionType[])
				.filter(sub => current.regions.includes(sub))
				.filter((sub, index, array) => array.indexOf(sub) === index); // make unique
		// does not send "unsubscribe" to the Trak-iT WebSocket, this is done in the {@link #subscriptionTimer} process.
		current.addExpiries(requested);
	}
	///**
	// * Sends an XHR to Trak-iT's RESTful service, and when a response is returned (or timeout occurs, or JSON parsing error occurs),
	// * the response is added to the message and add to the queue to go back to the main {@link Window}.
	// * @param msg
	// **/
	//rest(msg: SyncRestful) {
	//	// if the socket is not open, we would miss sync events
	//	// so if the socket is not open, we should open it and then send the REST command
	//	// but we also don't need to worry about that for GET requests; which are got getting an object or a list of them

	//	const action = (response: Reply) => {
	//		msg.response = response;
	//		self.postMessage(msg);
	//	}



	//	return msg.method === "GET" || this.#socket.state === TrakitSocketStatus.open
	//		? XHR_MINDFLAYER(
	//			msg.path,
	//			msg.method,
	//			msg.body
	//				? msg.body instanceof FormData
	//					? msg.body
	//					: JSON_STRINGIFY(msg.body)
	//				: null
	//		).then(action, action)
	//		: this.#socket.open().finally(() => this.rest(msg));
	//}
	///**
	// * Sends a command to the Trak-iT WebSocket, and when a response is returned (or timeout occurs),
	// * the response is added to the message and add to the queue to go back to the main {@link Window}.
	// * @param msg
	// **/
	//socket(msg: SyncSocket) {
	//	const action = (response: Reply) => {
	//		msg.response = response;
	//		self.postMessage(msg);
	//	};
	//	this.#socket._relayRequest(msg.name, msg.body).then(action, action);
	//}
}