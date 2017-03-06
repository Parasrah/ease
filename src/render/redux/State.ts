import * as Def from "../utils/Definitions";

export interface IState {
    readonly appState: IAppState;
    readonly windowState: IWindowState;
    readonly videoState: IVideoState;
    readonly commonPeerState: ICommonPeerState;
    readonly clientPeerState: IClientPeerState;
    readonly hostPeerState: IHostPeerState;
    readonly settingsState: ISettingsState;
}

export interface IAppState {
    page: Def.Page;
    error: string[];
}

export interface IWindowState {
    height: number;
    width: number;
}

export interface IVideoState {
    play: boolean;
    videoReady: boolean;
    fullscreen: boolean;
    subtitles: null;
    jumpToTime: null;
    controlStatus: null;
    volume: null;
}

export interface ICommonPeerState {
    id: string;
    serverStatus: boolean;
}

export interface IHostPeerState {
    hostPeers: Def.IPeer[];
}

export interface IClientPeerState {
    hostID: string;
    peerStatus: boolean;
}

export interface ISettingsState {
    signalHost: string;
}

export default IState;
