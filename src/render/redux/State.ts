import * as Def from "./Definitions";

export interface IState {
    readonly appState: IAppState;
    readonly videoState: IVideoState;
    readonly peerState: IPeerState;
}

export interface IAppState {
    page: Def.Page;
    height: number;
    width: number;
}

export interface IVideoState {
    play: boolean;
    fullscreen: boolean;
}

export interface IPeerState {
    signalStatus: Def.SignalStatus;
    webrtcStatus: Def.WebrtcStatus;
}
