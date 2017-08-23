import * as SimplePeer from "simple-peer";

import { addClientSignalDataAction, addHostSignalDataAction, clearClientSignalDataAction, clearHostSignalDataAction, createPeerAction } from "../actions/HostPeerActions";
import { IState } from "../redux/State";
import { IPeer } from "../utils/Definitions";
import { AbstractSignaler, IOfferMessage, IResponseMessage } from "./AbstractSignaler";

interface IInitMessage {
    id: string;
}

type deliverSignalData = (clientID: string, ...signalData: SimplePeer.SignalData[]) => void;

/**
 * Object to handle all socket.io interactions with signaling server.
 */
export class HostSignaler extends AbstractSignaler {
    /**
     * Callback through with to deliver signal data up the chain.
     *
     * **DO NOT** call this if the video is not ready.
     */
    private deliverSignalData: deliverSignalData;

    constructor() {
        super();

        // Bind functions
        this.handleSignalData = this.handleSignalData.bind(this);
        this.subscribe = this.subscribe.bind(this);
        this.discover = this.discover.bind(this);
        this.handleOffer = this.handleOffer.bind(this);

        // Finish setup
        this.deliverSignalData = null;
        this.socket.on("offer", this.handleOffer);
    }

    /**
     * Send signal data from the host peer to the appropriate location
     *
     * @param clientID - Target of signal data
     * @param signalData - simple-peer signal data payload
     */
    public handleSignalData(clientID: string, signalData: SimplePeer.SignalData) {
        if (this.getServerStatus()) {
            this.respond(clientID, signalData);
        }
        else {
            this.dispatch(addHostSignalDataAction(clientID, signalData));
        }
    }

    /**
     * Subscribe to signal data from the signaler
     *
     * @param callback - callback through which to deliver signal data to subscriber
     */
    public subscribe(callback: deliverSignalData) {
        this.deliverSignalData = callback;
        this.checkSignalStore(this.getHostState().hostPeers);
    }

    /**
     * Called when state changes
     *
     * @param oldState - Previous value of state
     * @param nextState - New value of state
     */
    protected notify(oldState: IState, nextState: IState) {
        this.checkServerStatus(oldState.commonPeerState.serverStatus, nextState.commonPeerState.serverStatus);
        this.checkSignalStore(nextState.hostPeerState.hostPeers);
    }

    /**
     * If the server reconnects, send discovery message
     *
     * @param oldServerStatus Previous state of server
     * @param newServerStatus New state of server
     */
    private checkServerStatus(oldServerStatus, newServerStatus) {
        if (!oldServerStatus && newServerStatus) {
            this.discover();
        }
    }

    /**
     * Run through the hostPeers, checking for stored signal data
     *
     * @param hostPeers - hostPeers from store
     */
    private checkSignalStore(hostPeers: IPeer[]) {
        hostPeers.forEach((peer) => {
            if (peer.clientSignalData.length && this.getVideoReady() && this.deliverSignalData) {
                this.dispatch(clearClientSignalDataAction(peer.clientID)); // TODO check order of this
                this.deliverSignalData(peer.clientID, ...peer.clientSignalData);
            }
            if (peer.hostSignalData.length && this.getServerStatus()) {
                for (let i = 0; i < peer.hostSignalData.length; i++) {
                    this.respond(peer.clientID, peer.hostSignalData[i]);
                }
                this.dispatch(clearHostSignalDataAction(peer.clientID));
            }
        });
    }

    /**
     * Send discovery message to the server
     */
    private discover() {
        const initMessage: IInitMessage = {
            id: this.getID(),
        };
        this.socket.emit("discover", initMessage);
    }

    /**
     * Handle offer message from a client
     *
     * @param offer - Offer message
     */
    private handleOffer(offer: IOfferMessage) {
        // Check if peer exists in store
        const hostPeers = this.getHostState().hostPeers;
        let found: IPeer = null;
        for (let i = 0; i < hostPeers.length; i++) {
            if (hostPeers[i].clientID === offer.clientID) {
                found = hostPeers[i];
            }
        }

        // If no peer in store, create one
        if (!found) {
            const signalData = this.getVideoReady() ? [] : [ offer.signalData ];
            this.dispatch(createPeerAction(offer.clientID, ...signalData));
        }

        // If video is ready, deliver signal data
        if (this.getVideoReady()) {
            const signalData = [ offer.signalData ];
            if (found && found.clientSignalData.length) {
                signalData.push(...found.clientSignalData);
                this.dispatch(clearClientSignalDataAction(offer.clientID));
            }
            this.deliverSignalData(offer.clientID, ...signalData);
        }

        // If video is not ready, store signal data
        else {
            this.dispatch(addClientSignalDataAction(offer.clientID, offer.signalData));
        }
    }

    /**
     * Send a response message to the server
     *
     * @param clientID - Intended client for message
     * @param signalData - simple-peer signal data
     */
    private respond(clientID: string, signalData: SimplePeer.SignalData) {
        const responseMessage: IResponseMessage = {
            signalData,
            clientID,
        };
        this.socket.emit("respond", responseMessage);
    }
}
