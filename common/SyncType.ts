import { TrakitSocketCommander } from "../commands/TrakitSocketCommander";

/**
 * The types of subscriptions available using {@link TrakitSocketCommander#subscribe}/{@link TrakitSocketCommander#unsubscribe}.
 * Each type has a different synchronization messages and objects.
 **/
export enum SyncType {
    /**
     * Sent by the {@link Worker} meaning it is initialized.
     **/
    init = "init",
    /**
     * Sent by the {@link Window} requesting the immediate {@link Worker} state and variables.
     **/
    status = "status",
    /**
     * Sent by the {@link Window} requesting a region be synchronized, and all objects in that region returned.
     * Sent by the {@link Worker} with a list (with rank) of all objects in the region.
     **/
    sync = "sync",
    /**
     * Sent by the {@link Window} requesting objects updates of a certain type can be ignored.
     * Sent by the {@link Worker} when the region is ignored. (after a timeout of a few minutes)
     **/
    desync = "desync",
    /**
     * Sent by the {@link Window} making a request to Trak-iT's RESTful directly.
     * Sent by the {@link Worker} Trak-iT's RESTful response.
     **/
    rest = "rest",
    /**
     * Sent by the {@link Window} making a request to Trak-iT WebSocket directly.
     * Sent by the {@link Worker} Trak-iT WebSocket's response.
     **/
    socket = "socket",
    /**
     * Sent by the {@link Worker} when a Trak-iT WebSocket message is received outside of an executed command.
     **/
    event = "event",
    /**
     * For the {@link Window}, it means it is ready to accept a new message.
     **/
    dispose = "dispose",
}