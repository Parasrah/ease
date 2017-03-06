import { Action } from "redux";

export const ActionType = {
    appAction: {
        changePageAction: "CHANGE_PAGE",
    },
    windowAction: {
        resizePageAction: "RESIZE_PAGE",
    },
    videoAction: {
        setPlayStatusAction: "PLAY_PAUSE",
        jumpToTimeAction: "JUMP_TO_TIME",
        fullscreenAction: "FULLSCREEN",
        setVideoReadyAction: "SET_VIDEO_STATUS",
    },
    commonPeerAction: {
        setServerStatusAction: "SET_SERVER_STATUS",
        setIDAction: "SET_ID",
    },
    hostPeerAction: {
        createPeerAction: "CREATE_PEER",
        addClientSignalDataAction: "ADD_CLIENT_SIGNAL_DATA",
        addHostSignalDataAction: "ADD_HOST_SIGNAL_DATA",
        clearSignalDataAction: "CLEAR_SIGNAL_DATA",
        setPeerStatusAction: "SET_PEER_SIGNAL_STATUS",
    },
    clientPeerAction: {
        setHostIDAction: "SET_HOST_ID",
        setPeerStatusAction: "SET_PEER_STATUS_ACTION",
    },
    settingsAction: {
        setSignalHostAction: "SET_SIGNAL_HOST",
    },
};

/**
 * Defines the action interfaces
 */
interface IType {
    readonly type: string;
}

export type ToAction<T extends Action> = T & IType;
