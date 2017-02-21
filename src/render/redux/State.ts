import * as Def from "./Definitions";

export interface IState {
    readonly appState: IAppState;
    readonly videoState: IVideoState;
    readonly peerState: IPeerState;
}

export interface IAppState {
    page?: Def.Page;
    height?: number;
    width?: number;
    id?: string;
}

export interface IVideoState {
    play?: boolean;
    fullscreen?: boolean;
}

export interface IPeerState {
    serverStatus?: Def.ServerStatus;
    signalStatus?: Def.SignalStatus;
    webrtcStatus?: Def.WebrtcStatus;
}

export default IState;
