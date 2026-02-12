import {
	Payload,
	Reply,
	RepSelfGet,
	RepSubscription,
	RepSubscriptionList,
	SubscriptionType
} from "@trakit/commands";
import {
	guid,
	Machine,
	nothing,
	SyncName,
	ulong,
	url
} from '@trakit/objects';
import { TrakitEventAccount, TrakitEventDelete, TrakitEvent, TrakitEventList, TrakitEventUpdate } from "../API/Events";
import { makePayloadClass } from "../API/Functions";
import { TrakitObjectCommander } from "../API/TrakitObjectCommander";
import { TrakitRestfulCommander } from "../RESTful/TrakitRestfulCommander";
import { OBJECT_SUBSCRIPTIONS } from "../WebSocket/Constants";
import { TrakitEventSocketClose } from "../WebSocket/Events";
import { SubscribedRegions } from "../WebSocket/SubscribedRegions";
import { TrakitSocketCommander, TrakitSocketStatus } from "../WebSocket/TrakitSocketCommander";
import { SUBS_TO_SYNCS, SYNCS_TO_SUBS } from "./Functions";

/**
 * The amount of time (in milliseconds) to wait between intervals checking for expired subscriptions.
 */
const TIMEOUT_SUBSCRIPTION = 10 * 1000;	// 10 seconds

/**
 * This is the class which does the work in the background {@link Worker} for the {@link SyncClient}.
 * It handles synchronizing regions, maintaining a connection to Trak-iT's WebSocket, and send HTTP requests to Trak-iT's RESTful service.
 * This class also maintains a queue of up-going messages.
 */
export class TrakitSyncCommander extends TrakitObjectCommander<any> {
	/**
	 * The Trak-iT WebSocket's main connection.
	 */
	#socket: TrakitSocketCommander;
	/**
	 * The Trak-iT RESTful service.
	 */
	#rest: TrakitRestfulCommander;

	/**
	 * When true, the Trak-iT WebSocket will automatically attempt to establish a connection.
	 * This value defaults to true if the commander is instantiated with a `ghostId`.
	 */
	get autoConnect(): boolean {
		return this.#socket.reconnectEnabled;
	}
	set autoConnect(value: boolean) {
		this.#socket.reconnectEnabled = !!value;
		if (value && this.#socket.state === TrakitSocketStatus.closed) {
			this.#socket.open();
		}
	}
	/**
	 * Indicates whether the Trak-iT WebSocket is currently connected.
	 */
	get online(): boolean {
		return this.#socket.state === TrakitSocketStatus.open;
	}

	///**
	// * Event raised when the Trak-iT WebSocket connection is opened.
	// */
	//onOpen?: ((this: TrakitSyncCommander, account: RepSelfGet) => any) | null;
	///**
	// * Event raised when an error occurs on the Trak-iT WebSocket connection.
	// */
	//onError?: ((this: TrakitSyncCommander, account: Reply) => any) | null;
	///**
	// * Gets invoked any time a message is received by the Trak-iT WebSocket connection.
	// * This is useful for logging or debugging, but you should use the {@link onUpdate}, {@link onDelete},
	// * and {@link onList} events to track changes to objects.
	// */
	//onMessage?: (this: TrakitSyncCommander, kind: string, content: JsonObject) => void;
	///**
	// * Event raised when the Trak-iT WebSocket connection is closed.
	// */
	//onClose?: ((this: TrakitSyncCommander, account: Reply) => any) | null;

	constructor(
		account?: RepSelfGet | { machine: { key: string } }
				| Machine | { key: string }
				| { ghostId: guid }
				| guid
				| nothing,
		httpAddress?: URL | url | nothing,
		wssAddress?: URL | url | nothing,
	) {
		super(account);
		const onOpen = (event: TrakitEvent) => this.#socketOpen((event as TrakitEventAccount).account),
			onClose = (event: TrakitEvent) => this.#socketClose((event as TrakitEventSocketClose).reply),
			onAccount = (event: TrakitEvent) => this.setAuth((event as TrakitEventAccount).account),
			onList = (event: TrakitEvent) => this._handleList(
				(event as TrakitEventList).kind,
				(event as TrakitEventList).companyId,
				(event as TrakitEventList).objects
			),
			onUpdate = (event: TrakitEvent) => this._handleUpdate(
				(event as TrakitEventUpdate).kind,
				(event as TrakitEventUpdate).companyId,
				(event as TrakitEventUpdate).object
			),
			onDelete = (event: TrakitEvent) => this._handleDelete(
				(event as TrakitEventDelete).kind,
				(event as TrakitEventDelete).companyId,
				(event as TrakitEventDelete).key
			);
		this.#rest = new TrakitRestfulCommander(this.account, httpAddress ?? TrakitRestfulCommander.URI_PROD);
		this.#rest.on("account", onAccount);
		this.#rest.on("list", onList);
		this.#rest.on("update", onUpdate);
		this.#rest.on("delete", onDelete);
		
		this.#socket = new TrakitSocketCommander(this.account, wssAddress ?? TrakitSocketCommander.URI_PROD);
		this.#socket.on("account", onAccount);
		this.#socket.on("list", onList);
		this.#socket.on("update", onUpdate);
		this.#socket.on("delete", onDelete);
		this.#socket.on("open", onOpen);
		this.#socket.on("close", onClose);
		
		this.autoConnect = !!(
			this.account.ghostId
			|| this.account.machine?.key
		);
	}
	/**
	 * Disposes of the Trak-iT WebSocket connection, and cleans up references.
	 */
	override dispose() {
		this.#rest.dispose();
		this.#socket.dispose();
		(this.#rest as any) =
			(this.#socket as any) = null;
	}
	/**
	 * Overridden to set the authentication for both the RESTful service and WebSocket.
	 * @inheritdoc
	 */
	override setAuth(
		account?: RepSelfGet | { machine: { key: string } }
			| Machine | { key: string; }
			| { ghostId: guid; }
			| guid
			| nothing
	): void {
		super.setAuth(account);
		if (account !== this.#rest?.account) this.#rest?.setAuth(this.account);
		if (account !== this.#socket?.account) this.#socket?.setAuth(this.account);
	}
	/**
	 * Overridden to route commands to either the Trak-iT WebSocket or RESTful service based on the type of action.
	 * @inheritdoc
	 */
	override command<TReply extends Reply>(payload: Payload): Promise<TReply> {
		const action = payload.getAction();
		switch (action.object as string) {
			case "Subscription":
			case "Self":
				return this.socket<TReply>(payload);
			default:
				return this.rest<TReply>(payload);
		}
	}
	/**
	 * Overridden to throw an error if used; it shouldn't be in use because of the {@link command} override.
	 * @inheritdoc
	 */
	override _createRequest(payload: Payload): any { throw new Error("Method not implemented."); }
	/**
	 * Overridden to throw an error if used; it shouldn't be in use because of the {@link command} override.
	 * @inheritdoc
	 */
	override _relayRequest(request: Payload): Promise<any> { throw new Error("Method not implemented."); }

	/**
	 * Sends a command specifically to the Trak-iT RESTful service.
	 * @param payload
	 * @returns 
	 */
	rest<TReply extends Reply>(payload: Payload): Promise<TReply> {
		return this.#rest.command<TReply>(payload);
	}
	/**
	 * Sends a command specifically to the Trak-iT WebSocket service.
	 * @param payload 
	 * @returns 
	 */
	socket<TReply extends Reply>(payload: Payload): Promise<TReply> {
		return this.#socket.command<TReply>(payload);
	}

	//#region Events
	/**
	 * Handles the `connection` event from the Trak-iT WebSocket.
	 * This will re-subscribe to any regions that were subscribed to before the disconnection occured.
	 * Also restarts the subscription expirer, and raises the `onOpen` event.
	 * @param account 
	 */
	#socketOpen(account: RepSelfGet) {
		this.#syncRegions.forEach((current, companyId) => {
			// remove all regions from in-sync list; ALL OF THEM.
			// but, re-sync to the ones that were not going to expire
			// this will also auto-get lists of objects
			this.sync(
				companyId,
				SUBS_TO_SYNCS(current.reset())
			);
		});
		// start expired subscription timer
		this.#syncExpirer();
	}
	/**
	 * Handles the `disconnection` event from the Trak-iT WebSocket.
	 * Stops the subscription expirer (it is restarted on re-connection).
	 * Finally, it raises the `onClose` event.
	 * @param reply 
	 */
	#socketClose(reply: Reply) {
		// stop trying to remove expired subscriptions
		clearTimeout(this.#syncTimer);
		this.#syncTimer = 0;
		// we don't remove any subscriptions, they remain until explicitly unsubscribed or expired
		// they are re-subscribed when we reconnect in {@link #onOpen}
	}
	//#endregion Events
	//#region Sync
	/**
	 * Checks if the given {@link types} are currently synchronized for the given {@param companyId}.
	 * @param companyId 
	 * @param types 
	 * @returns 
	 */
	isSynced(companyId: ulong, types: SyncName[]): boolean {
		let synced = this.#socket.state === TrakitSocketStatus.open;
		if (synced) {
			const current = this.#getCurrentSync(companyId),
				requested = SYNCS_TO_SUBS(types);
			synced = requested.every(sub => current.regions.includes(sub));
		}
		return synced;
	}
	/**
	 * Begins synchronizing the given regions.
	 * If all regions are in-sync, the returned Promise is resolved immediately.
	 * Otherwise it sends a subscribe command to the Trak-iT WebSocket for any out-of-sync regions,
	 * and when the subscribe is resolved, it sends commands to list the objects for the requested {@param types} (except Company, which is not listed, but "getted").
	 * @param companyId
	 * @param types
	 */
	async sync(companyId: ulong, types: SyncName[]) {
		const promises: Promise<Reply>[] = [],
			current = this.#getCurrentSync(companyId),
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
	 */
	async desync(companyId: ulong, types: SyncName[]) {
		const current = this.#getCurrentSync(companyId),
			requested = types.reduce((acc, s) => acc.concat(OBJECT_SUBSCRIPTIONS[s] || []), [] as SubscriptionType[])
				.filter(sub => current.regions.includes(sub))
				.filter((sub, index, array) => array.indexOf(sub) === index); // make unique
		// does not send "unsubscribe" to the Trak-iT WebSocket, this is done in the {@link #subscriptionTimer} process.
		current.addExpiries(requested);
	}
	/**
	 * All active subscriptions per company.
	 */
	#syncRegions: Map<number, SubscribedRegions> = new Map;
	/**
	 * Callback used to clear expired subscriptions from the dictionary.
	 * Also resets the timer after sending unsubscribe Promise to Trak-iT's WebSocket is resolved.
	 */
	#syncExpirer() {
		const expirations: Promise<Reply>[] = [];
		if (this.#socket.state === TrakitSocketStatus.open) {
			this.#syncRegions.forEach((subscribed, companyId) => {
				const expired = subscribed.purgeExpired();
				if (expired.length) expirations.push(this.unsubscribe(companyId, expired));
			});
		}
		Promise.allSettled(expirations).finally(() => {
			this.#syncTimer = setTimeout(
				() => this.#syncExpirer(),
				TIMEOUT_SUBSCRIPTION
			);
		});
	}
	/**
	 * Handle for the auto-remove expired subscription types.
	 */
	#syncTimer!: number;
	/**
	 * Returns (and creates a reference if needed) the subscriptions for the given company.
	 * @param companyId
	 */
	#getCurrentSync(companyId: ulong): SubscribedRegions {
		let subs = this.#syncRegions.get(companyId);
		if (!subs) this.#syncRegions.set(companyId, subs = new SubscribedRegions)
		return subs;
	}
	//#endregion Sync
	//#region Subscriptions
	/**
	 * Subscribes to the specified subscription types for the given company.
	 * @param companyId 
	 * @param subscriptions 
	 * @returns 
	 */
	subscribe(companyId: ulong, subscriptions: SubscriptionType[]): Promise<RepSubscription> {
		return this.#socket.subscribe(companyId, subscriptions);
	}
	/**
	 * Unsubscribes from the specified subscription types for the given company.
	 * @param companyId 
	 * @param subscriptions 
	 * @returns 
	 */
	unsubscribe(companyId: ulong, subscriptions: SubscriptionType[]): Promise<RepSubscription> {
		return this.#socket.unsubscribe(companyId, subscriptions);
	}
	/**
	 * Retrieves the list of active subscriptions for the current account.
	 * @returns 
	 */
	listSubscriptions(): Promise<RepSubscriptionList> {
		return this.#socket.listSubscriptions();
	}
	//#endregion Subscriptions
	////#region Generics
	//// these don't work for all object types like: CompanyReseller, BehaviourLog, Session, Dashcam, DispatchTasks
	//get(type: SyncName, key: ulong | guid | email | codified | string) { }
	//list(type: SyncName, companyId: ulong, constraints: JsonObject) { }
	//merge(type: SyncName, json: JsonObject) { }
	//remove(type: SyncName, key: ulong | guid | email | codified | string) { }
	//restore(type: SyncName, key: ulong | guid | email | codified | string) { }
	//suspend(type: SyncName, key: ulong | guid | email | codified | string) { }
	//revive(type: SyncName, key: ulong | guid | email | codified | string) { }
	//multiMerge(type: SyncName, array: JsonObject[]) { }
	//multiRemove(type: SyncName, array: (ulong | guid | email | codified | string)[]) { }
	////#endregion Generics
}