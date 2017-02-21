import * as Def from "./Definitions";
import * as State from "./State";
import "socket.io-client";

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
        fullscreen: "FULLSCREEN",
    },
    peerAction: {
        signalServer: "SIGNAL_SERVER",
        simplePeer: "SIMPLE_PEER",
        serverStatus: "SERVER_STATUS",
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

export interface IServerStatus extends IAction {
    readonly serverStatus: Def.ServerStatus;
}

/*************************************************************/
/*********************** Action Creators *********************/
/*************************************************************/

/**************************** App ****************************/

export const createChangePage = (page: Def.Page): IChangePage => {
    return {
        type: ActionType.appAction.changePage,
        page,
    };
};

export const createResizePage = (width: number, height: number): IResizePage => {
    return {
        type: ActionType.appAction.resizePage,
        width,
        height,
    };
};

/**************************** Video **************************/

export const createPlayPause = (play: boolean): IPlayPause => {
    return {
        type: ActionType.videoAction.playPause,
        play,
    };
};

export const createSeekVideo = (): ISeekVideo => {
    return {
        type: ActionType.videoAction.seekVideo,
    };
};

export const createFullscreen = (fullscreen: boolean): IFullscreen => {
    return {
        type: ActionType.videoAction.fullscreen,
        fullscreen,
    };
};

/**************************** Peer ***************************/

export const setServerStatus = (serverStatus: Def.ServerStatus): IServerStatus => {
    return {
        type: ActionType.peerAction.serverStatus,
        serverStatus,
    };
};

const shouldConnectToServer = (state: State.IPeerState) => {
    return (state.serverStatus === Def.ServerStatus.DISCONNECTED);
};

export const connectToSignalServer = (socket: SocketIOClient.Socket, callback: Function) => {
    return (dispatch, getState) => {
        if (shouldConnectToServer(getState().peerState)) {
            if (socket.connected) {
                dispatch(setServerStatus(Def.ServerStatus.CONNECTED));
                callback();
            }
            else {
                dispatch(setServerStatus(Def.ServerStatus.PENDING));
                socket.on("connect", () => {
                    dispatch(setServerStatus(Def.ServerStatus.CONNECTED));
                    callback();
                });
            }
        }
    };
};
