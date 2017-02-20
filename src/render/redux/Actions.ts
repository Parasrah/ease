import * as Def from "./Definitions";

/**
 * The various action types
 */
export const ActionType = {
    appAction: {
        changePage: "CHANGE_PAGE",
        resizePage: "RESIZE_PAGE",
    },
    videoAction: {
        playPause: "PLAY_PAUSE",
        seekVideo: "SEEK_VIDEO",
        fullscreenVideo: "FULLSCREEN_VIDEO",
    },
    peerAction: {
        signalServer: "SIGNAL_SERVER",
        simplePeer: "SIMPLE_PEER",
    },
};

/**
 * Defines the action interfaces
 */
export interface IAction {
    readonly type: string;
}
/*************************************************************/
/********************* Action Definitions ********************/
/*************************************************************/

/**************************** App ****************************/

export type AppAction = IChangePage;

export interface IChangePage extends IAction {
    readonly page: Def.Page;
}

export interface IResizePage extends IAction {
    readonly height: number;
    readonly width: number;
}

/**************************** Video **************************/

export type VideoAction = IPlayPause | ISeekVideo | IFullscreen;

export interface IPlayPause extends IAction {
    readonly play: boolean;
}

// Used to change behaviour of seeking in reducer
export type ISeekVideo = IAction;

export interface IFullscreen extends IAction {
    readonly fullscreen: boolean;
}

/**************************** Peer ***************************/

export type PeerAction = ISignalServer | ISimplePeer;

export interface ISignalServer extends IAction {
    readonly signalStatus: Def.SignalStatus;
}

export interface ISimplePeer extends IAction {
    readonly webrtcStatus: Def.WebrtcStatus;
}
