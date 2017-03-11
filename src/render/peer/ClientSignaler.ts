import * as SimplePeer from "simple-peer";
import { IState } from "../redux/State";
import { AbstractSignaler, IOfferMessage, IResponseMessage } from "./AbstractSignaler";

interface IResponseStore {
    id: string;
    signalData: SimplePeer.SignalData;
}

export class ClientSignaler extends AbstractSignaler {
    private deliverSignal: (signalData: SimplePeer.SignalData) => void;

    // NOTE: If these object get any more complicated, add to store
    private responseData: IResponseStore[];
    private offerData: SimplePeer.SignalData[];

    constructor() {
        super();
        this.offerData = [];
        this.responseData = [];
        this.socket.on("response", this.dealWithResponse);
    }

    public onResponse(deliverSignal: (signalData: SimplePeer.SignalData) => void) {
        this.deliverSignal = deliverSignal;
        for (const data of this.responseData) {
            if (this.getID() === data.id) {
                deliverSignal(data);
            }
        }
        this.responseData = [];
    }

    public sendSignal = (signalData: SimplePeer.SignalData) => {
        if (!this.getServerStatus()) {
            this.offerData.push(signalData);
        }
        else {
            this.sendOffer(this.formOffer(signalData));
        }
    }

    protected notify(oldState: IState, nextState: IState) {
        if (nextState.commonPeerState.serverStatus && this.offerData.length > 0) {
            for (const signalData of this.offerData) {
                this.sendOffer(this.formOffer(signalData));
            }
            this.offerData = [];
        }
    }

    private sendOffer = (offerMessage: IOfferMessage) => {
        this.socket.emit("offer", offerMessage);
    }

    private formOffer = (data: SimplePeer.SignalData): IOfferMessage => {
        return {
            clientID: this.getID(),
            hostID: this.getClientState().hostID,
            signalData: data,
        };
    }

    private dealWithResponse = (responseMessage: IResponseMessage) => {
        if (responseMessage.clientID === this.getID()) {
            if (this.deliverSignal) {
                this.deliverSignal(responseMessage.signalData);
            }
            else {
                this.responseData.push({
                    id: responseMessage.clientID,
                    signalData: responseMessage.signalData,
                });
            }
        }
    }
}
