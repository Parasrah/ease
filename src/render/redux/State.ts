import * as Def from "./Definitions";

export interface IState {
    readonly appState: IAppState;
    readonly windowState: IWindowState;
    readonly videoState: IVideoState;
    readonly peerState: IPeerState;
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

export interface IPeerState {
    id: string;
    hostID: string;
    serverStatus: boolean;
    hostSignalData: boolean; // Host only
    hostPeers: Def.IPeer[]; // Host only
}

export interface ISettingsState {
    signalHost: string;
}

export default IState;
