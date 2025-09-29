import { RepSelfGet } from '@trakit/commands';
import { TrakitSocketCommander } from './TrakitSocketCommander';

/**
 * Describes the state of the {@link TrakitSocketCommander}'s connection to the Trak-iT WebSocket service.
 */
export enum TrakitSocketStatus {
	/**
	 * A connection is being established and is awaiting the initial {@link RepSelfGet|connectionResponse} message.
	 */
	opening = WebSocket.CONNECTING,
	/**
	 * A connection is established and the {@link RepSelfGet|connectionResponse} message has been received.
	 */
	open = WebSocket.OPEN,
	/**
	 * Either the client or the server has initiated a disconnection.
	 */
	closing = WebSocket.CLOSING,
	/**
	 * The underlying {@link WebSocket} connection has been terminated.
	 */
	closed = WebSocket.CLOSED,
}