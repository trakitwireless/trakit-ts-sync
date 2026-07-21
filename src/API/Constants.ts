import { SyncName } from "@trakit/objects";

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
		"UserAuthentication",
		"UserState",
	],
};
