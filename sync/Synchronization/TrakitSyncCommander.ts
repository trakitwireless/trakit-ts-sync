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
	protected _socket: TrakitSocketCommander;
	/**
	 * The Trak-iT RESTful service.
	 */
	protected _rest: TrakitRestfulCommander;

	/**
	 * When true, the Trak-iT WebSocket will automatically attempt to establish a connection.
	 * This value defaults to true if the commander is instantiated with a `ghostId`.
	 */
	get autoConnect(): boolean {
		return this._socket.reconnectEnabled;
	}
	set autoConnect(value: boolean) {
		this._socket.reconnectEnabled = !!value;
		if (value && this._socket.state === TrakitSocketStatus.closed) {
			this._socket.open();
		}
	}
	/**
	 * Indicates whether the Trak-iT WebSocket is currently connected.
	 */
	get socketOnline(): boolean {
		return this._socket.state === TrakitSocketStatus.open;
	}
	/**
	 * Address of the underlying Trak-iT WebSocket service.
	 */
	get socketDetails() {
		return {
			state: this._socket.state,
			ready: this._socket.ready,
			lastConnected: this._socket.lastConnected,
			lastSent: this._socket.lastSent,
			lastReceived: this._socket.lastReceived,
			lastMessage: this._socket.lastMessage,
		};
	}
	/**
	 * URL of the underlying Trak-iT WebSocket service.
	 */
	get socketAddress(): URL | null { return this._socket.baseAddress; }
	set socketAddress(value: URL) { this._socket.baseAddress = value; }
	/**
	 * URL of the underlying Trak-iT RESTful service.
	 */
	get restAddress(): URL | null { return this._rest.baseAddress; }
	set restAddress(value: URL) { this._rest.baseAddress = value; }

	constructor(
		account?: RepSelfGet | { machine: { key: string } }
			| Machine | { key: string }
			| { ghostId: guid }
			| guid
			| nothing,
		restAddress?: URL | url | nothing,
		socketAddress?: URL | url | nothing,
	) {
		super(account);

		const onOpen = (event: TrakitEvent) => this.#handleOpen((event as TrakitEventAccount).account),
			onClose = (event: TrakitEvent) => this.#handleClose((event as TrakitEventSocketClose).reply),
			onAccount = (event: TrakitEvent) => this.setAuth((event as TrakitEventAccount).account),
			onUplift = (event: TrakitEvent) => this.fire(event.type, () => event);

		this._rest = new TrakitRestfulCommander(this.account, restAddress ?? TrakitRestfulCommander.URI_PROD);
		this._rest.on("account", onAccount);

		this._socket = new TrakitSocketCommander(this.account, socketAddress ?? TrakitSocketCommander.URI_PROD);
		this._socket.on("account", onAccount);
		this._socket.on("open", onOpen);
		this._socket.on("close", onClose);
		for (const type of ["account", "list", "update", "delete"]) {
			this._rest.on(type, onUplift);
			this._socket.on(type, onUplift);
		}
		for (const type of ["open", "close", "broadcast"]) {
			this._socket.on(type, onUplift);
		}

		this.autoConnect = !!(
			this.account.ghostId
			|| this.account.machine?.key
		);
	}
	/**
	 * Disposes of the Trak-iT WebSocket connection, and cleans up references.
	 */
	override dispose() {
		super.dispose();
		this._rest.dispose();
		this._socket.dispose();
		(this._rest as any) =
			(this._socket as any) = null;
	}

	/**
	 * @inheritDoc
	 */
	override setAuth(
		account?: RepSelfGet | { machine: { key: string } }
			| Machine | { key: string }
			| { ghostId: guid }
			| guid
			| nothing
	): void {
		super.setAuth(account);
		this._rest?.setAuth(this.account);
		this._socket?.setAuth(this.account);
	}

	/**
	 * Overridden to route commands to either the Trak-iT WebSocket or RESTful service based on the type of action.
	 * @inheritdoc
	 */
	override command<TReply extends Reply>(payload: Payload): Promise<TReply> {
		const action = payload.getAction(),
			channel = action.object as string;
		if (channel === "Subscription" || (channel === "Self" && this.socketOnline)) {
			return this.socket<TReply>(payload);
		}
		return this.rest<TReply>(payload);
	}
	/**
	 * Overridden to throw an error if used; it shouldn't be in use because of the {@link command} override.
	 * @inheritdoc
	 */
	override requestCreate(payload: Payload): any { throw new Error("Method not implemented."); }
	/**
	 * Overridden to throw an error if used; it shouldn't be in use because of the {@link command} override.
	 * @inheritdoc
	 */
	override requestRelay(request: Payload): Promise<any> { throw new Error("Method not implemented."); }

	/**
	 * Sends a command specifically to the Trak-iT RESTful service.
	 * @param payload
	 * @returns 
	 */
	rest<TReply extends Reply>(payload: Payload): Promise<TReply> {
		return this._rest.command<TReply>(payload);
	}
	/**
	 * Sends a command specifically to the Trak-iT WebSocket service.
	 * @param payload 
	 * @returns 
	 */
	socket<TReply extends Reply>(payload: Payload): Promise<TReply> {
		return this._socket.command<TReply>(payload);
	}

	//#region Events
	/**
	 * Handles the `connection` event from the Trak-iT WebSocket.
	 * This will re-subscribe to any regions that were subscribed to before the disconnection occured.
	 * Also restarts the subscription expirer, and raises the `onOpen` event.
	 * @param account 
	 */
	#handleOpen(account: RepSelfGet) {
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
	#handleClose(reply: Reply) {
		// stop trying to remove expired subscriptions
		clearTimeout(this.#syncTimer);
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
		let synced = this._socket.state === TrakitSocketStatus.open;
		if (synced) {
			const current = this.#getCurrentSync(companyId),
				requested = SYNCS_TO_SUBS(types);
			synced = requested.every(sub => current.regions.includes(sub));
		}
		return synced;
	}
	/**
	 * Retrieves the list of currently synchronized regions for the given {@param companyId}.
	 * @param companyId 
	 * @param includeExpiring 
	 * @returns 
	 */
	getSyncs(companyId: ulong, includeExpiring: boolean = false): SyncName[] {
		const current = this.#getCurrentSync(companyId),
			except = includeExpiring ? [] : current.getExpiring();
		return SUBS_TO_SYNCS(current.regions.filter(sub => !except.includes(sub)));
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
			const subscribed = (await this._socket.subscribe(companyId, requested)).merged as SubscriptionType[];
			// remove expiration from any requested subscriptions, not new subscriptions
			// some subscriptions may have been requested to be removed before re-synching
			current.removeExpiries(requested);

			// once subscriptions are made, find the SyncNames that need to be requested
			SUBS_TO_SYNCS(subscribed).forEach(type => {
				const SyncPayload = makePayloadClass(
					type,
					type.startsWith("Company")
						? "Get"
						: "ListByCompany"
				);
				if (!SyncPayload) throw new Error(`No payload class could be made for sync type ${type}`);
				promises.push(this.command<Reply>(new SyncPayload({
					company: { id: companyId },
				})));
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
	desync(companyId: ulong, types: SyncName[]) {
		const current = this.#getCurrentSync(companyId),
			requested = types.reduce((acc, s) => acc.concat(OBJECT_SUBSCRIPTIONS[s] || []), [] as SubscriptionType[])
				.filter(sub => current.regions.includes(sub))
				.filter((sub, index, array) => array.indexOf(sub) === index); // make unique
		// does not send "unsubscribe" to the Trak-iT WebSocket, this is done in the {@link #subscriptionTimer} process.
		current.addExpiries(requested);
		return requested;
	}
	/**
	 * All active subscriptions per company.
	 */
	#syncRegions: Map<ulong, SubscribedRegions> = new Map;
	/**
	 * Callback used to clear expired subscriptions from the dictionary.
	 * Also resets the timer after sending unsubscribe Promise to Trak-iT's WebSocket is resolved.
	 */
	#syncExpirer() {
		const expirations: Promise<Reply>[] = [];
		if (this._socket.state === TrakitSocketStatus.open) {
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
		return this._socket.subscribe(companyId, subscriptions);
	}
	/**
	 * Unsubscribes from the specified subscription types for the given company.
	 * @param companyId 
	 * @param subscriptions 
	 * @returns 
	 */
	unsubscribe(companyId: ulong, subscriptions: SubscriptionType[]): Promise<RepSubscription> {
		return this._socket.unsubscribe(companyId, subscriptions);
	}
	/**
	 * Retrieves the list of active subscriptions for the current account.
	 * @returns 
	 */
	listSubscriptions(): Promise<RepSubscriptionList> {
		return this._socket.listSubscriptions();
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