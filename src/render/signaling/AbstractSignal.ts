import { SignalData } from "simple-peer";
import store from "../redux/Store";
import { IState } from "../redux/State";
import { Client, SocketIO } from "socket.io-client";

export interface IOfferMessage {
    hostID: string;
    clientID: string;
    signalData: SignalData;
}

export interface IResponseMessage {
    clientID: string;
    signalData: SignalData;
}

export abstract class AbstractSignal {
    protected socket: Client;
    private state: IState;

    constructor() {
        this.state = store.getState();
        this.socket = SocketIO.connect(this.state.settingsState.signalHost);
        this.listen();
    }

    private listen() {
        store.subscribe(() => {
            const oldState = this.state;
            this.state = store.getState();
            this.notify(oldState, this.state);
        });
    }

    protected abstract notify(oldState: IState, nextState: IState);
}
