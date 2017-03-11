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
     */
    public handleSignalData = (clientID: string, signalData: SimplePeer.SignalData) => {
        if (this.getServerStatus()) {
            this.respond(clientID, signalData);
        }
        else {
            this.dispatch(addHostSignalDataAction(clientID, signalData));
        }
    }

    public subscribe = (callback: deliverSignalData) => {
        this.deliverSignalData = callback;
        this.checkSignalStore(this.getHostState().hostPeers);
    }

    /**
     * Called when state changes

     * @param oldState - Previous value of state
     * @param nextState - New value of state
     */
    protected notify(oldState: IState, nextState: IState) {
        this.checkServerStatus(oldState.commonPeerState.serverStatus, nextState.commonPeerState.serverStatus);
        this.checkSignalStore(nextState.hostPeerState.hostPeers);
    }

    private checkServerStatus(oldServerStatus, newServerStatus) {
        if (!oldServerStatus && newServerStatus) {
            this.discover();
        }
    }

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

    }

    private respond = (clientID: string, signalData: SimplePeer.SignalData) => {
        const responseMessage: IResponseMessage = {
            signalData,
            clientID,
        };
        this.socket.emit("respond", responseMessage);
    }
}
