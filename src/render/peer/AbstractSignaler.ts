import { Action } from "redux";
import { ThunkAction } from "redux-thunk";

import { SignalData } from "simple-peer";
import * as SocketIOClient from "socket.io-client";
import { watchServerStatusAction } from "../actions/CommonPeerActions";
import { IClientPeerState, IHostPeerState, IState } from "../redux/State";
import { StoreWrapper } from "../redux/Store";

export interface IOfferMessage {
    hostID: string;
    clientID: string;
    signalData: SignalData;
}

export interface IResponseMessage {
    clientID: string;
    signalData: SignalData;
}

export abstract class AbstractSignaler {
    protected socket: SocketIOClient.Socket;
    private state: IState;
    private storeWrapper: StoreWrapper;

    constructor() {
        this.storeWrapper = StoreWrapper.getInstance();
        this.state = this.getState();
        this.socket = SocketIOClient.connect(this.state.settingsState.signalHost);
        this.dispatch(watchServerStatusAction(this.socket));
        this.listen();
    }

    protected dispatch<T extends Action>(action: T | ThunkAction<void, IState, void>) {
        this.storeWrapper.getStore().dispatch(action as T);
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
