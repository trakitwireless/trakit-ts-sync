import {
	ErrorCode,
	PaySelfContact,
	PaySelfGet,
	PaySelfLogin,
	PaySelfLogout,
	PaySelfPassword,
	PaySelfPreferences,
	Reply,
	RepSelfGet,
	RepSelfLogout,
	RepSelfPassword,
} from '@trakit/commands';
import {
	JsonObject,
	nothing,
	serialization,
	SystemsOfUnits,
	Timezone,
	ulong,
	url,
	UserNotifications,
} from '@trakit/objects';
import { TrakitCommander } from './TrakitCommander';

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
	
	//#region Commands - Self
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
	//#endregion Commands - Self



}