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
        setID: "SET_ID",
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

export type AppAction = IChangePage | IResizePage | ISetID;

export interface IChangePage extends IAction {
    readonly page: Def.Page;
}

export interface IResizePage extends IAction {
    readonly height: number;
    readonly width: number;
}

export interface ISetID extends IAction {
    readonly id: string;
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

export const changePage = (page: Def.Page): IChangePage => {
    return {
        type: ActionType.appAction.changePage,
        page,
    };
};

export const resizePage = (width: number, height: number): IResizePage => {
    return {
        type: ActionType.appAction.resizePage,
        width,
        height,
    };
};

export const setID = (id: string) => {
    return {
        type: ActionType.appAction.setID,
        id,
    };
};

/**************************** Video **************************/

export const playPause = (play: boolean): IPlayPause => {
    return {
        type: ActionType.videoAction.playPause,
        play,
    };
};

export const seekVideo = (): ISeekVideo => {
    return {
        type: ActionType.videoAction.seekVideo,
    };
};

export const setFullscreen = (fullscreen: boolean): IFullscreen => {
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
