import { combineReducers } from "redux";

import { Action, ActionType, AppAction, WindowAction, VideoAction, PeerAction, SettingsAction, IChangePageAction, IResizePageAction, IFullscreenAction, IAddSignalDataAction, IClearSignalDataAction, ISetPeerSignalStatusAction, ICreatePeerAction, IPlayPauseAction, IStoreOfferAction, ISetIDAction, ISetServerStatusAction, ISetVideoReadyAction, ISetSignalHostAction, ISetHostIDAction } from "./Actions";
import { SIGNAL_HOST } from "../../constants/Constants";
import { addSignalData } from "./ReduxUtils";
import * as State from "./State";
import * as Def from "./Definitions";

/**************************** App ****************************/

const initialAppState: State.IAppState = {
    page: Def.Page.START,
    error: [],
};

const appState = (state: State.IAppState = initialAppState, action: Action<AppAction>): State.IAppState => {
    const types = ActionType.appAction;

    switch (action.type) {

        case types.changePageAction:
            return Object.assign({}, state, {
                page: (action as IChangePageAction).page,
            });

        default:
            return state;
    }
};

/**************************** Window *************************/

const initialWindowState = {
    height: 600,
    width: 800,
};

const windowState = (state: State.IWindowState = initialWindowState, action: Action<WindowAction>): State.IWindowState => {
    const types = ActionType.windowAction;

    switch (action.type) {

        case types.resizePageAction:
            return Object.assign({}, state, {
                height: (action as IResizePageAction).height,
                width: (action as IResizePageAction).width,
            });

        default:
            return state;
    }
};

/**************************** Video **************************/

const initialVideoState: State.IVideoState = {
    play: false,
    fullscreen: false,
    subtitles: null,
    jumpToTime: null,
    controlStatus: null,
    volume: null,
    videoReady: false,
};

const videoState = (state: State.IVideoState = initialVideoState, action: Action<VideoAction>): State.IVideoState => {
    const types = ActionType.videoAction;

    switch (action.type) {
        case types.fullscreenAction:
            return Object.assign({}, state, {
                fullscreen: (action as IFullscreenAction).fullscreen,
            });

        case types.playPauseAction:
            return Object.assign({}, state, {
                play: (action as IPlayPauseAction).play,
            });

        case types.setVideoReadyAction:
            return Object.assign({}, state, {
                videoReady: (action as ISetVideoReadyAction).videoReady,
            });

        default:
            return state;
    }
};

/*************************** Peer ****************************/

const initialPeerState: State.IPeerState = {
    id: "",
    serverStatus: false,
    hostPeers: [],
    hostID: "",
    offerData: [],
};

const peerState = (state: State.IPeerState = initialPeerState, action: Action<PeerAction>): State.IPeerState => {
    const types = ActionType.peerAction;

    switch (action.type) {

        case types.addClientSignalDataAction:
            return addSignalData(state, action as IAddSignalDataAction, Def.DataType.HOST);

        case types.addHostSignalDataAction:
            return addSignalData(state, action as IAddSignalDataAction, Def.DataType.HOST);

        case types.createPeerAction:
            return Object.assign({}, state, {
                hostPeers: state.hostPeers.concat({
                    signalStatus: false,
                    clientID: (action as ICreatePeerAction).clientID,
                    clientSignalData: (action as ICreatePeerAction).signalData,
                    hostSignalData: [],
                }),
            });

        case types.storeOfferDataAction:
            return Object.assign({}, state, {
                offerData: state.offerData.concat((action as IStoreOfferAction).signalData),
            });

        case types.clearSignalDataAction:
            return Object.assign({}, state, {
                hostPeers: state.hostPeers.map((peer) => {
                    if (peer.clientID === (action as IClearSignalDataAction).id) {
                        Object.assign(peer, {
                            hostSignalData: [],
                        });
                    }
                    else {
                        return peer;
                    }
                }),
            });

        case types.setServerStatusAction:
            return Object.assign({}, state, {
                serverStatus: (action as ISetServerStatusAction).serverStatus,
            });

        case types.setIDAction:
            return Object.assign({}, state, {
                id: (action as ISetIDAction).id,
            });

        case types.setHostIDAction:
            return Object.assign({}, state, {
                hostID: (action as ISetHostIDAction).hostID,
            });

        case types.setPeerSignalStatusAction:
            return Object.assign({}, state, {
                hostPeers: state.hostPeers.map((peer) => {
                    if (peer.clientID === (action as ISetPeerSignalStatusAction).clientID) {
                        return Object.assign(peer, {
                            signalStatus: (action as ISetPeerSignalStatusAction).status,
                        });
                    }
                }),
            });

        case types.clearOfferDataAction:
            return Object.assign({}, state, {
                offerData: [],
            });

        default:
            return state;
    }
};

/************************* Settings **************************/

const initialSettingsState: State.ISettingsState = {
    signalHost: SIGNAL_HOST,
};

const settingsState = (state: State.ISettingsState = initialSettingsState, action: Action<SettingsAction>) => {
    const types = ActionType.settingsAction;

    switch (action.type) {
        case types.setSignalHostAction:
            return Object.assign({}, state, {
                signalHost: (action as ISetSignalHostAction).signalHost,
            });

        default:
            return state;
    }
};

/*************************** End *****************************/

const appReducer = combineReducers({
    appState,
    windowState,
    videoState,
    peerState,
    settingsState,
});

export default appReducer;
