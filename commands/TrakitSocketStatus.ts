import { RepSelfGet } from '@trakit/commands';
import { TrakitSocketCommander } from './TrakitSocketCommander';

/**
 * Describes the state of the {@link TrakitSocketCommander}'s connection to the Trak-iT WebSocket service.
 */
export enum TrakitSocketStatus {
    /**
     * A connection is being established and is awaiting the initial {@link RepSelfGet|connectionResponse} message.
     */
    opening,
    /**
     * A connection is established and the {@link RepSelfGet|connectionResponse} message has been received.
     */
    open,
    /**
     * Either the client or the server has initiated a disconnection.
     */
    closing,
    /**
     * The underlying {@link WebSocket} connection has been terminated.
     */
    closed,
}