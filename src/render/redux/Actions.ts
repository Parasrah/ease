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
        changePageAction: "CHANGE_PAGE",
    },
    windowAction: {
        resizePageAction: "RESIZE_PAGE",
    },
    videoAction: {
        playPauseAction: "PLAY_PAUSE",
        jumpToTimeAction: "JUMP_TO_TIME",
        fullscreenAction: "FULLSCREEN",
        setVideoReadyAction: "SET_VIDEO_STATUS",
    },
    peerAction: {
        createPeerAction: "CREATE_PEER",
        setServerStatusAction: "SET_SERVER_STATUS",
        addClientSignalDataAction: "ADD_CLIENT_SIGNAL_DATA",
        addHostSignalDataAction: "ADD_HOST_SIGNAL_DATA",
        setPeerSignalStatusAction: "SET_PEER_SIGNAL_STATUS",
        setIDAction: "SET_ID",
        setHostIDAction: "SET_HOST_ID",
        clearSignalDataAction: "CLEAR_SIGNAL_DATA",
        storeOfferDataAction: "STORE_OFFER_DATA",
        clearOfferDataAction: "CLEAR_OFFER_DATA_ACTION",
    },
    settingsAction: {
        setSignalHostAction: "SET_SIGNAL_HOST",
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

export type AppAction = IChangePageAction;

export interface IChangePageAction extends ICheck {
    readonly page: Def.Page;
}

/**************************** Window *************************/

export type WindowAction = IResizePageAction;

export interface IResizePageAction extends ICheck {
    readonly height: number;
    readonly width: number;
}

/**************************** Video **************************/

export type VideoAction = IPlayPauseAction | IFullscreenAction | ISetVideoReadyAction;

export interface IPlayPauseAction extends ICheck {
    readonly play: boolean;
}

export interface IFullscreenAction extends ICheck {
    readonly fullscreen: boolean;
}

export interface ISetVideoReadyAction extends ICheck {
    readonly videoReady: boolean;
}

/**************************** Peer ***************************/

export type PeerAction = ICreatePeerAction | ISetServerStatusAction | ISetIDAction | IAddSignalDataAction | ISetHostIDAction | IStoreOfferAction | IClearSignalDataAction | ISetPeerSignalStatusAction | IClearOfferDataAction;

export interface ICreatePeerAction extends ICheck {
    clientID: string;
    signalData?: SignalData[];
}

export interface ISetServerStatusAction extends ICheck {
    readonly serverStatus: boolean;
}

export interface ISetIDAction extends ICheck {
    readonly id: string;
}

export interface ISetHostIDAction extends ICheck {
    readonly hostID: string;
}

export interface IAddSignalDataAction extends ICheck {
    signalData: SignalData;
    clientID: string;
}

export interface IStoreOfferAction {
    signalData: SignalData;
}

export interface IClearSignalDataAction extends ICheck {
    id: string;
}

export interface ISetPeerSignalStatusAction extends ICheck {
    clientID: string;
    status: boolean;
}

export interface IClearOfferDataAction extends ICheck {

}

/************************** Settings *************************/

export type SettingsAction = ISetSignalHostAction;

export interface ISetSignalHostAction extends ICheck {
    signalHost: string;
}

/*************************************************************/
/*********************** Action Creators *********************/
/*************************************************************/

/**************************** App ****************************/

export const changePageAction = (page: Def.Page): Action<IChangePageAction> => {
    return {
        type: ActionType.appAction.changePageAction,
        page,
    };
};

export type changePageAction = (page: Def.Page) => Action<IChangePageAction>;

/**************************** Window *************************/

export const resizePageAction = (width: number, height: number): Action<IResizePageAction> => {
    return {
        type: ActionType.windowAction.resizePageAction,
        width,
        height,
    };
};

export type resizePageAction = (width: number, height: number) => Action<IResizePageAction> ;

/**************************** Video **************************/

// TODO split this into two separate actions
export const playPauseAction = (play: boolean): Action<IPlayPauseAction> => {
    return {
        type: ActionType.videoAction.playPauseAction,
        play,
    };
};

export type playPauseAction = (play: boolean) => Action<IPlayPauseAction>;

export const setFullscreenAction = (fullscreen: boolean): Action<IFullscreenAction> => {
    return {
        type: ActionType.videoAction.fullscreenAction,
        fullscreen,
    };
};

export type setFullscreenAction = (fullscreen: boolean) => Action<IFullscreenAction>;

export const setVideoReadyAction = (videoReady: boolean): Action<ISetVideoReadyAction> => {
    return {
        type: ActionType.videoAction.setVideoReadyAction,
        videoReady,
    };
};

export type setVideoReadyAction = (videoReady: boolean) => Action<ISetVideoReadyAction>;

/**************************** Peer ***************************/

export const setIDAction = (id: string): Action<ISetIDAction> => {
    return {
        type: ActionType.peerAction.setIDAction,
        id,
    };
};

export type setIDAction = (id: string) => Action<ISetIDAction>;

export const setHostIDAction = (hostID: string): Action<ISetHostIDAction> => {
    return {
        type: ActionType.peerAction.setHostIDAction,
        hostID,
    };
};

export type setHostIDAction = (hostID: string) => Action<ISetHostIDAction>;

export const createPeerAction = (clientID: string, ...signalData: SignalData[]): Action<ICreatePeerAction> => {
    return {
        type: ActionType.peerAction.createPeerAction,
        clientID,
        signalData,
    };
};

export type createPeerAction = (clientID: string, ...signalData: SignalData[]) => Action<ICreatePeerAction>;

export const addClientSignalDataAction = (clientID: string, signalData: SignalData): Action<IAddSignalDataAction> => {
    return {
        type: ActionType.peerAction.addClientSignalDataAction,
        signalData,
        clientID,
    };
};

export type addClientSignalDataAction = (clientID: string, signalData: SignalData) => Action<IAddSignalDataAction>;

export const addHostSignalDataAction = (clientID: string, signalData: SignalData): Action<IAddSignalDataAction> => {
    return {
        type: ActionType.peerAction.addHostSignalDataAction,
        signalData,
        clientID,
    };
};

export type addHostSignalDataAction = (clientID: string, signalData: SignalData) => Action<IAddSignalDataAction>;

export const storeOfferDataAction = (signalData: SignalData): Action<IStoreOfferAction> => {
    return {
        type: ActionType.peerAction.storeOfferDataAction,
        signalData,
    };
};

export type storeOfferDataAction = (signalData: SignalData) => Action<IStoreOfferAction>;

export const clearSignalDataAction: clearSignalDataAction = (id) => {
    return {
        type: ActionType.peerAction.clearSignalDataAction,
        id,
    };
};

export type clearSignalDataAction = (id: string) => Action<IClearSignalDataAction>;

export const setPeerSignalStatusAction: setPeerSignalStatusAction = (clientID, status) => {
    return {
        type: ActionType.peerAction.setPeerSignalStatusAction,
        clientID,
        status,
    };
};

export type setPeerSignalStatusAction = (clientID: string, status: boolean) => Action<ISetPeerSignalStatusAction>;

export const clearOfferDataAction: clearOfferDataAction = () => {
    return {
        type: ActionType.peerAction.clearOfferDataAction,
    };
};

export type clearOfferDataAction = () => Action<IClearOfferDataAction>;

const setServerStatusAction = (serverStatus: boolean): Action<ISetServerStatusAction> => {
    return {
        type: ActionType.peerAction.setServerStatusAction,
        serverStatus,
    };
};

export const watchServerStatusAction = (socket: SocketIOClient.Socket) => {
    return (dispatch, getState) => {

        if (socket.connected) {
            dispatch(setServerStatusAction(true));
        }

        socket.on("connect", () => {
            dispatch(setServerStatusAction(true));
        });

        socket.on("disconnect", () => {
            dispatch(setServerStatusAction(false));
        });

        // TODO watch for errors and log to store via `dispatch(action)`

    };
};

export type watchServerStatusAction = (socket: SocketIOClient.Socket) => Action<ISetServerStatusAction>;

/************************** Settings *************************/

export const setSignalHostAction = (signalHost: string) => {
    return {
        type: ActionType.settingsAction.setSignalHostAction,
        signalHost,
    };
};

export type setSignalHostAction = (signalHost: string) => Action<ISetSignalHostAction>;
