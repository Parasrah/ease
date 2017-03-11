import * as SimplePeer from "simple-peer";

import { addHostSignalDataAction, clearClientSignalDataAction, clearHostSignalDataAction } from "../actions/HostPeerActions";
import { IState } from "../redux/State";
import { IPeer } from "../utils/Definitions";
import { AbstractSignaler, IOfferMessage, IResponseMessage } from "./AbstractSignaler";

interface IInitMessage {
    id: string;
}

type deliverSignalData = (clientID: string, ...signalData: SimplePeer.SignalData[]) => void;

export class HostSignaler extends AbstractSignaler {
    private deliverSignalData: deliverSignalData;

    constructor() {
        super();

        this.deliverSignalData = null;
        this.socket.on("offer", this.handleOffer);
    }

    /**
     * Send signal data from the host peer to the appropriate location
     *
     * @param clientID - Target of signal data
     * @param signalData - simple-peer signal data payload
     */
    public handleSignalData = (clientID: string, signalData: SimplePeer.SignalData) => {
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
    public subscribe = (callback: deliverSignalData) => {
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
                this.deliverSignalData(peer.clientID, ...peer.clientSignalData);
                this.dispatch(clearClientSignalDataAction(peer.clientID));
            }
            if (peer.hostSignalData.length && this.getServerStatus()) {
                for (let i = 0; i < peer.hostSignalData.length; i++) {
                    this.respond(peer.clientID, peer.hostSignalData[i]);
                }
                this.dispatch(clearHostSignalDataAction(peer.clientID));
            }
        });
    }

    private discover = () => {
        const initMessage: IInitMessage = {
            id: this.getID(),
        };
        this.socket.emit("discover", initMessage);
    }

    private handleOffer = (offer: IOfferMessage) => {
        // TODO
    }

    private respond = (clientID: string, signalData: SimplePeer.SignalData) => {
        const responseMessage: IResponseMessage = {
            signalData,
            clientID,
        };
        this.socket.emit("respond", responseMessage);
    }
}
