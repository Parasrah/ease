import { SignalData } from "simple-peer";
import "socket.io-client";

import * as Def from "./Definitions";
import * as State from "./State";

/**
 * The various action types
 */
export const ActionType = {
    appAction: {
        changePage: "CHANGE_PAGE",
    },
    windowAction: {
        resizePage: "RESIZE_PAGE",
    },
    videoAction: {
        playPause: "PLAY_PAUSE",
        jumpToTime: "JUMP_TO_TIME",
        fullscreen: "FULLSCREEN",
        setVideoReady: "SET_VIDEO_STATUS",
    },
    peerAction: {
        createPeer: "CREATE_PEER",
        setServerStatus: "SET_SERVER_STATUS",
        addSignalData: "ADD_SIGNAL_DATA",
        setID: "SET_ID",
        setHostID: "SET_HOST_ID",
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

export type AppAction = IChangePage | ISetID;

export interface IChangePage extends IAction {
    readonly page: Def.Page;
}

/**************************** Window *************************/

export type WindowAction = IResizePage;

export interface IResizePage extends IAction {
    readonly height: number;
    readonly width: number;
}

/**************************** Video **************************/

export type VideoAction = IPlayPause | IFullscreen | ISetVideoReady;

export interface IPlayPause extends IAction {
    readonly play: boolean;
}

export interface IFullscreen extends IAction {
    readonly fullscreen: boolean;
}

export interface ISetVideoReady extends IAction {
    readonly videoReady: boolean;
}

/**************************** Peer ***************************/

export type PeerAction = ICreatePeer | ISetServerStatus | ISetID | IAddSignalData;

export interface ICreatePeer extends IAction {
    id: string;
    signalData?: SignalData[];
}

export interface ISetServerStatus extends IAction {
    readonly serverStatus: boolean;
}

export interface ISetID extends IAction {
    readonly id: string;
}

export interface ISetHostID extends IAction {
    readonly hostID: string;
}

export interface IAddSignalData extends IAction {
    signalData: SignalData;
    id: string;
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

/**************************** Window *************************/

export const resizePage = (width: number, height: number): IResizePage => {
    return {
        type: ActionType.windowAction.resizePage,
        width,
        height,
    };
};

/**************************** Video **************************/

export const playPause = (play: boolean): IPlayPause => {
    return {
        type: ActionType.videoAction.playPause,
        play,
    };
};

export const setFullscreen = (fullscreen: boolean): IFullscreen => {
    return {
        type: ActionType.videoAction.fullscreen,
        fullscreen,
    };
};

export const setVideoReady = (videoReady: boolean): ISetVideoReady => {
    return {
        type: ActionType.videoAction.setVideoReady,
        videoReady,
    };
};

/**************************** Peer ***************************/

export const setID = (id: string): ISetID => {
    return {
        type: ActionType.peerAction.setID,
        id,
    };
};

export const setHostID = (hostID: string): ISetHostID => {
    return {
        type: ActionType.peerAction.setHostID,
        hostID,
    };
};

export const createPeer = (id: string, ...signalData: SignalData[]): ICreatePeer => {
    return {
        type: ActionType.peerAction.createPeer,
        id,
        signalData,
    };
};

export const addSignalData = (id: string, signalData: SignalData): IAddSignalData => {
    return {
        type: ActionType.peerAction.addSignalData,
        signalData,
        id,
    };
};

const setServerStatus = (serverStatus: boolean): ISetServerStatus => {
    return {
        type: ActionType.peerAction.setServerStatus,
        serverStatus,
    };
};

export const watchServerStatus = (socket: SocketIOClient.Socket) => {
    return (dispatch, getState) => {

        if (socket.connected) {
            dispatch(setServerStatus(true));
        }

        socket.on("connect", () => {
            dispatch(setServerStatus(true));
        });

        socket.on("disconnect", () => {
            dispatch(setServerStatus(false));
        });

        // TODO watch for errors and log to store via `dispatch(action)`

    };
};
