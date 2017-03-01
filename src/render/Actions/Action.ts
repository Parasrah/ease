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
        storeOfferDataAction: "STORE_OFFER_DATA",
        clearOfferDataAction: "CLEAR_OFFER_DATA_ACTION",
        setHostIDAction: "SET_HOST_ID",
        setPeerStatusAction: "SET_PEER_STATUS_ACTION",
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
