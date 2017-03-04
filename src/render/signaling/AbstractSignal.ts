import { SignalData } from "simple-peer";
import { StoreWrapper } from "../redux/Store";
import { IState, IHostPeerState, IClientPeerState } from "../redux/State";
import { Client, SocketIO } from "socket.io-client";
import { Action } from "redux";

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
    private storeWrapper: StoreWrapper;

    constructor() {
        this.state = this.getState();
        this.socket = SocketIO.connect(this.state.settingsState.signalHost);
        this.storeWrapper = StoreWrapper.getInstance();
        this.listen();
    }

    protected dispatch<T extends Action>(action: T) {
        this.storeWrapper.getStore().dispatch(action);
    }

    protected getID() {
        return this.getState().commonPeerState.id;
    }

    protected getServerStatus() {
        return this.getState().commonPeerState.serverStatus;
    }

    protected getVideoReady() {
        return this.getState().videoState.videoReady;
    }

    protected getHostState(): IHostPeerState {
        return this.getState().hostPeerState;
    }

    protected getClientState(): IClientPeerState {
        return this.getState().clientPeerState;
    }

    private getState() {
        return this.storeWrapper.getState();
    }

    private listen() {
        this.storeWrapper.getStore().subscribe(() => {
            const oldState = this.state;
            this.state = this.getState();
            this.notify(oldState, this.state);
        });
    }

    protected abstract notify(oldState: IState, nextState: IState);
}
