import { SubscriptionType } from "./SubscriptionType";
import { SyncBase } from "./SyncBase";
import { SyncType } from "./SyncType"; // Adjust the path if SyncType is elsewhere

/**
 * In order to sychronize objects, we need to know what types of objects are being synchronized.
 **/
export class SyncSubscriptions extends SyncBase {
    /**
     * The {@link trait.json.Company#id} of the objects requested.
     **/
    company: number;
    /**
     * The list of all subscription regions
     **/
    subs: SubscriptionType[];

	constructor(add: boolean, company: number, subs: SubscriptionType[]) {
		super(add ? SyncType.sync : SyncType.desync);
		this.company = company;
		this.subs = subs.filter((v, i, a) => a.indexOf(v) === i); // Remove duplicates
	}
}