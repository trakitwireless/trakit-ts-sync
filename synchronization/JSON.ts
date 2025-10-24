import {
	Asset,
	BaseComponent,
	classes,
	Company,
	Dashcam,
	email,
	guid,
	IDeserializable,
	int,
	JsonArray,
	JsonObject,
	JsonValue,
	nothing,
	objects,
	storage,
	ulong,
	utility,
} from "@trakit/objects";

/**
 * Parses the passed JSON string and returns the parsed value.
 * If there is an exception in parsing, the Error is populated with all the details of the error and `undefined` is returned.
 * @param json 
 * @returns 
 */
export function JSON_PARSE_SAFE(json: string): [JsonValue, SyntaxError | null] {
	try {
		return [JSON.parse(json), null];
	} catch (ex: SyntaxError | any) {
		return [null, ex as SyntaxError];
	}
}

/**
 * Returns the name of the identifying key for the given Trak-iT Object type.
 * @param type 
 * @returns 
 */
export function syncKeyName(type: classes) {
	switch (type) {
		case "User":
		case "UserGeneral":
		case "UserAdvanced":
			return "login";
		case "ProviderRegistration":
			return "code";
		case "Session":
			return "handle";
		case "Machine":
			return "key";
		case "Dashcam":
			return "guid";
		default:
			return "id";
	}
}

/**
 * Returns the value of the identifying key for the given Trak-iT Object.
 * @param json 
 * @param type 
 * @returns 
 */
export function syncKey(json: JsonObject, type: classes): ulong | string | guid | email {
	return json[syncKeyName(type)] as ulong | string | guid | email;
}

/**
 * Finds a company by id, and if not found will add it.
 * @param {!number} id		Unieque identifier of the company.
 * @param {number=} parent	Default 0.
 * @return {trakit.fleetfreedom.Company}
 **/
function getOrAddCompanyById(id: ulong, parent: ulong = 0) {
	let company: Company | null = null;
	if (utility.isntNaN(id)) {
		company = storage.Company.get(id) as Company | null;
		if (!company) {
			storage.Company.set(id, company = new Company({
				"id": id,
				"parent": parent || 0,
			}));
		}
	}
	return company as Company;
}


/**
 * Replaces the version array with an array with the appropriate version key in the correct index
 * @param {!Object} json
 * @param {!number} index
 * @return {!Object} json
 **/
function VERSION_KEYS_FIXER(json: JsonObject, index?: number | nothing): JsonObject {
	const copy = { ...json };
	if (utility.isntNaN(index)) {
		const version = (json?.["v"] as JsonArray)?.[0] as int ?? -1;
		copy["v"] = [];
		for (let i = 0, l = index + 1; i < l; i++) {
			copy["v"][i] = i === index ? version : -1;
		}
	}
	return copy;
}
/**
 * A map of merge message types for objects that follow the __GeneralMerged and __AdvancedMerged formats
 * @type {Object.<string,number>}
 **/
const VERSION_KEYS_GENADV = {
	"General": 0,
	"Advanced": 1,
};
/**
 * A map of merge message types for Asset objects.
 * @type {Object.<string,number>}
 **/
const VERSION_KEYS_ASSET = {
	...VERSION_KEYS_GENADV,
	"Dispatch": 2,
};
/**
 * A map of merge message types for the Company objects
 * @type {Object.<string,number>}
 **/
const VERSION_KEYS_COMPANY = {
	"General": 0,
	//"Settings": 1,
	"Directory": 2,
	"Labels": 3,
	"Policies": 4,
	"Reseller": 5,
};
/**
 * A map of merge message types for Provider objects.
 * @type {Object.<string,number>}
 **/
const VERSION_KEYS_PROVIDER = {
	...VERSION_KEYS_GENADV,
	"Control": 2,
};
	
/**
 * All objects retrieved by Mindflayer or synchonized by Kraken are updated/created using this method.
 * @param {!string} type
 * @param {!Object} json
 * @param {Array.<boolean>=} updated		An empty array given to the function which is then populated with true for each part of the object that was updated.
 * @returns {trakit.fleetfreedom.MVCObject}
 **/
export function SyncClient_merged(type:classes, json:JsonObject, updated: boolean[]) {
	/**
	 * The company that owns the object being merged.
	 * @type {trakit.fleetfreedom.Company}
	 **/
	let company = getOrAddCompanyById(json["company"] as ulong);
	/**
	 * This is the object constructed from a Zombie class from the given json literal.
	 * @type {trakit.fleetfreedom.MVCObject}
	 **/
	let object = null;
	/**
	 * The version flags from the {@link object} before it was updated.
	 * Used at the end to update the {@link updated} array.
	 * @type {Array.<number>}
	 **/
	let oldVersion: int[] = [];

	// find the object and update it based on the JSON
	switch (type) {
		case "Asset":
		case "AssetGeneral":
		case "AssetAdvanced":
		case "AssetDispatch":
			// special case for assets because they can be created with multiple Klasses...
			object = storage.Asset.get(json["id"] as ulong) as Asset | null;
			if (object) {
				oldVersion = [...object.v];
				object.fromJSON(
					VERSION_KEYS_FIXER(
						json,
						VERSION_KEYS_ASSET[type.slice("Asset".length) as keyof typeof VERSION_KEYS_ASSET]
					)
				);
			} else if (json["kind"]) {
				// only asset+assetGeneral has kind, so only creates if it has kind
				object = (objects.Asset as typeof Asset).fromJSON(
					VERSION_KEYS_FIXER(
						json,
						VERSION_KEYS_ASSET[type.slice("Asset".length) as keyof typeof VERSION_KEYS_ASSET]
					)
				);
				storage.Asset.set(object.id, object);
				oldVersion = object.v.map(() => NaN);
			}
			break;
		//case "AssetMessage":
		//	object = SyncClient_merged_addOrUpdate(
		//		type,
		//		json,
		//		company,
		//		oldVersion
		//	);
		//	break;
		//case "Place":
		//	//case "PlaceGeneral":
		//	object = SyncClient_merged_addOrUpdate(
		//		type,
		//		json,
		//		company,
		//		oldVersion
		//	);
		//	break;
		case "User":
		case "UserGeneral":
		case "UserAdvanced":
			object = SyncClient_merged_addOrUpdate(
				"User",
				VERSION_KEYS_FIXER(
					json,
					VERSION_KEYS_GENADV[type.slice("User".length) as keyof typeof VERSION_KEYS_GENADV]
				),
				company,
				oldVersion
			);
			break;
		case "Provider":
		case "ProviderGeneral":
		case "ProviderAdvanced":
		case "ProviderControl":
			object = SyncClient_merged_addOrUpdate(
				"Provider",
				VERSION_KEYS_FIXER(
					json,
					VERSION_KEYS_PROVIDER[type.slice("Provider".length) as keyof typeof VERSION_KEYS_PROVIDER]
				),
				company,
				oldVersion
			);
			break;

		case "Company":
		case "CompanyGeneral":
		//case "CompanySettings":
		case "CompanyDirectory":
		case "CompanyStyles":
		case "CompanyPolicies":
			object = getOrAddCompanyById(json["id"] as ulong, json["parent"] as ulong);
			oldVersion = [...object.v];
			object.fromJSON(VERSION_KEYS_FIXER(json, VERSION_KEYS_COMPANY[type.slice("Company".length) as keyof typeof VERSION_KEYS_COMPANY]));
			break;
		case "CompanyReseller":
			json = {
				"id": json["id"],
				"parent": json["parent"],
				"v": json["v"],
				"reseller": json,
			};
			object = getOrAddCompanyById(json["id"] as ulong, json["parent"] as ulong);
			oldVersion = object.v.slice(VERSION_KEYS_COMPANY["Reseller"]);
			company.fromJSON(VERSION_KEYS_FIXER(json, VERSION_KEYS_COMPANY[type.slice("Company".length) as keyof typeof VERSION_KEYS_COMPANY]));
			object = object.reseller;	// return reseller instead of company
			break;

		case "Dashcam":
			object = Dashcam.fromJSON(json);
			// version is not populated
			break;

		case "ProviderRegistration":
		// version is not populated
		default:
			object = SyncClient_merged_addOrUpdate(
				type,
				json,
				company,
				oldVersion
			);
	}

	if (updated && (object as any)?.["v"]) {
		// update the {@link updated} by comparing the old version of the object to the new version.
		oldVersion.forEach(function (this: int[], previous: int, index: number) {
			// since the old version could be NaN, this is the easiest way to compare that the new version is different.
			updated[index] = !(previous === this[index]);
		}, (object as any as BaseComponent).v);
	}

	// return the object
	return object;
}
/**
 * Finds the Zombie object of the given typeName, and if found, updates it with the given json.
 * If not found, creates it with the given json.
 * Also populates the given oldVersion array with the previous version flags of the found object.
 * If not found, populates it with the correct number of NaNs.
 * @param {!string} type
 * @param {!Object} json
 * @param {!trakit.fleetfreedom.Company} company
 * @param {!Array.<number>} oldVersion
 **/
function SyncClient_merged_addOrUpdate(type: classes, json: JsonObject, company: Company, oldVersion: int[]) {
	const key = syncKey(json, type);
	let object = storage[type].get(key);
	if (object) {
		if ((object as any as BaseComponent).v) oldVersion.push(...(object as any as BaseComponent).v);
	} else {
		object = new objects[type];
		storage[type].set(key, object);
		if ((object as any as BaseComponent).v) oldVersion.push(...(object as any as BaseComponent).v.map(() => NaN));
	}
	(object as any as IDeserializable).fromJSON(json);
	return object;
}
/**
 * Finds the Zombie object by the given type and removes it from its company.
 * Then, returns the object or null if not found.
 * @param {!string} type
 * @param {!Object} json
 * @returns {trakit.fleetfreedom.MVCObject}
 **/
function SyncClient_deleted(type: classes, json: JsonObject) {
	///**
	// * The company that owns the object being deleted.
	// * @type {trakit.fleetfreedom.Company}
	// **/
	//let company;

	const key = syncKey(json, type);
	let object: any;

	// find the object type name
	switch (type) {
		//	//case "asset":
		//	case "AssetGeneral":
		//	case "AssetAdvanced":
		//	case "AssetDispatch":
		//		type = "Asset";
		//		break;
		//	case "AssetMessage":
		//		type = "AssetMessage";
		//		break;
		//	case "Place":
		//	//case "PlaceGeneral":
		//		type = "Place";
		//		break;
		//	//case "user":
		//	case "UserGeneral":
		//	case "UserAdvanced":
		//		type = "User";
		//		break;
		//	//case "provider":
		//	case "ProviderGeneral":
		//	case "ProviderAdvanced":
		//	case "ProviderControl":
		//		type = "Provider";
		//		break;

		//	case "Company":
		//	case "CompanyGeneral":
		//	//case "CompanySettings":
		//	case "CompanyDirectory":
		//	case "CompanyStyles":
		//	case "CompanyPolicies":
		//		company = COMPANIES.get(json["id"]);
		//		if (company) {
		//			COMPANIES.delete(company.id);
		//			company.version[0] = json["v"][0];	// just version, not fromJSON in case it breaks things
		//		}
		//		return company || null;	// return, not break
		case "CompanyReseller":
			object = storage.Company.get(key) as Company;
			if (object?.reseller) {
				object.fromJSON(
					VERSION_KEYS_FIXER(
						{
							"id": json["id"],
							"parent": json["parent"],
							"v": [...json["v"] as int[]],
							"reseller": json,
						},
						VERSION_KEYS_COMPANY["Reseller"]
					)
				);
				// Company#fromJSON will remove the company.reseller if it's deleted
			}
			return object?.reseller || null;	// return, not break
		default:
			object = storage[type].get(key);
			if (object) storage[type].delete(key);
			return object || null;
	}
	//// get owner company
	//company = getOrAddCompanyById(json["company"]);
	//// remove it
	//var object = company["remove" + type.toCapital()](json[syncKeyName(type)]);
	//// update version key
	//if (object && object["version"]) {
	//	// just version, not MVCObject#fromJSON in case it breaks things
	//	object["version"][0] = json["v"][0];
	//}
	//return object;
}
///**
// * Similar to {@link SyncClient_merged}, but works on lists of objects and internally invokes {@link SyncClient_merged}.
// * @param {!string} type
// * @param {!Object} json
// * @returns {trakit.fleetfreedom.MVCObject}
// **/
//function SyncClient_list(type: classes, json: JsonObject) {
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