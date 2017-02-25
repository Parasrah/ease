import { SignalData } from "simple-peer";
import "socket.io-client";

import * as Def from "./Definitions";
import * as State from "./State";

/*************************************************************/
/************************* Structure *************************/
/*************************************************************/

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
        addClientSignalData: "ADD_CLIENT_SIGNAL_DATA",
        addHostSignalData: "ADD_HOST_SIGNAL_DATA",
        setID: "SET_ID",
        setHostID: "SET_HOST_ID",
        clearSignalData: "CLEAR_SIGNAL_DATA",
        storeOfferData: "STORE_OFFER_DATA",
    },
    settingsAction: {
        setSignalHost: "SET_SIGNAL_HOST",
    },
};

/**
 * A simple check, all action definitions must extend this interface
 */
export interface ICheck {}

/**
 * Defines the action interfaces
 */
interface IType {
    readonly type: string;
}

export type Action<T extends ICheck> = T & IType;

/*************************************************************/
/********************* Action Definitions ********************/
/*************************************************************/

/**************************** App ****************************/

export type AppAction = IChangePage | ISetID;

export interface IChangePage extends ICheck {
    readonly page: Def.Page;
}

/**************************** Window *************************/

export type WindowAction = IResizePage;

export interface IResizePage extends ICheck {
    readonly height: number;
    readonly width: number;
}

/**************************** Video **************************/

export type VideoAction = IPlayPause | IFullscreen | ISetVideoReady;

export interface IPlayPause extends ICheck {
    readonly play: boolean;
}

export interface IFullscreen extends ICheck {
    readonly fullscreen: boolean;
}

export interface ISetVideoReady extends ICheck {
    readonly videoReady: boolean;
}

/**************************** Peer ***************************/

export type PeerAction = ICreatePeer | ISetServerStatus | ISetID | IAddSignalData | ISetHostID;

export interface ICreatePeer extends ICheck {
    clientID: string;
    signalData?: SignalData[];
}

export interface ISetServerStatus extends ICheck {
    readonly serverStatus: boolean;
}

export interface ISetID extends ICheck {
    readonly id: string;
}

export interface ISetHostID extends ICheck {
    readonly hostID: string;
}

export interface IAddSignalData extends ICheck {
    signalData: SignalData;
    clientID: string;
}

export interface IStoreOffer {
    signalData: SignalData;
}

export interface IClearSignalData extends ICheck {
    id: string;
}

/************************** Settings *************************/

export type SettingsAction = ISetSignalHost;

export interface ISetSignalHost extends ICheck {
    signalHost: string;
}

/*************************************************************/
/*********************** Action Creators *********************/
/*************************************************************/

/**************************** App ****************************/

export const changePage = (page: Def.Page): Action<IChangePage> => {
    return {
        type: ActionType.appAction.changePage,
        page,
    };
};

export type changePage = (page: Def.Page) => Action<IChangePage>;

/**************************** Window *************************/

export const resizePage = (width: number, height: number): Action<IResizePage> => {
    return {
        type: ActionType.windowAction.resizePage,
        width,
        height,
    };
};

export type resizePage = (width: number, height: number) => Action<IResizePage> ;

/**************************** Video **************************/

export const playPause = (play: boolean): Action<IPlayPause> => {
    return {
        type: ActionType.videoAction.playPause,
        play,
    };
};

export type playPause = (play: boolean) => Action<IPlayPause>;

export const setFullscreen = (fullscreen: boolean): Action<IFullscreen> => {
    return {
        type: ActionType.videoAction.fullscreen,
        fullscreen,
    };
};

export type setFullscreen = (fullscreen: boolean) => Action<IFullscreen>;

export const setVideoReady = (videoReady: boolean): Action<ISetVideoReady> => {
    return {
        type: ActionType.videoAction.setVideoReady,
        videoReady,
    };
};

export type setVideoReady = (videoReady: boolean) => Action<ISetVideoReady>;

/**************************** Peer ***************************/

export const setID = (id: string): Action<ISetID> => {
    return {
        type: ActionType.peerAction.setID,
        id,
    };
};

export type setID = (id: string) => Action<ISetID>;

export const setHostID = (hostID: string): Action<ISetHostID> => {
    return {
        type: ActionType.peerAction.setHostID,
        hostID,
    };
};

export type setHostID = (hostID: string) => Action<ISetHostID>;

export const createPeer = (clientID: string, ...signalData: SignalData[]): Action<ICreatePeer> => {
    return {
        type: ActionType.peerAction.createPeer,
        clientID,
        signalData,
    };
};

export type createPeer = (clientID: string, ...signalData: SignalData[]) => Action<ICreatePeer>;

export const addClientSignalData = (clientID: string, signalData: SignalData): Action<IAddSignalData> => {
    return {
        type: ActionType.peerAction.addClientSignalData,
        signalData,
        clientID,
    };
};

export type addClientSignalData = (clientID: string, signalData: SignalData) => Action<IAddSignalData>;

export const addHostSignalData = (clientID: string, signalData: SignalData): Action<IAddSignalData> => {
    return {
        type: ActionType.peerAction.addHostSignalData,
        signalData,
        clientID,
    };
};

export type addHostSignalData = (clientID: string, signalData: SignalData) => Action<IAddSignalData>;

export const storeOfferData = (signalData: SignalData): Action<IStoreOffer> => {
    return {
        type: ActionType.peerAction.storeOfferData,
        signalData,
    };
};

export type storeOfferData = (signalData: SignalData) => Action<IStoreOffer>;

export const clearSignalData = (id: string): Action<IClearSignalData> => {
    return {
        type: ActionType.peerAction.clearSignalData,
        id,
    };
};

export type clearSignalData = (id: string) => Action<IClearSignalData>;

const setServerStatus = (serverStatus: boolean): Action<ISetServerStatus> => {
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

export type watchServerStatus = (socket: SocketIOClient.Socket) => Action<ISetServerStatus>;

/************************** Settings *************************/

export const setSignalHost = (signalHost: string) => {
    return {
        type: ActionType.settingsAction.setSignalHost,
        signalHost,
    };
};

export type setSignalHost = (signalHost: string) => Action<ISetSignalHost>;
