import { combineReducers } from "redux";

import { Action, ActionType, AppAction, WindowAction, VideoAction, PeerAction, SettingsAction, IChangePage, IResizePage, IFullscreen, IAddSignalData, IClearSignalData, ICreatePeer, IPlayPause, ISetHostID, IStoreOffer, ISetID, ISetServerStatus, ISetVideoReady, ISetSignalHost } from "./Actions";
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

        case types.changePage:
            return Object.assign({}, state, {
                page: (action as IChangePage).page,
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

        case types.resizePage:
            return Object.assign({}, state, {
                height: (action as IResizePage).height,
                width: (action as IResizePage).width,
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
        case types.fullscreen:
            return Object.assign({}, state, {
                fullscreen: (action as IFullscreen).fullscreen,
            });

        case types.playPause:
            return Object.assign({}, state, {
                play: (action as IPlayPause).play,
            });

        case types.setVideoReady:
            return Object.assign({}, state, {
                videoReady: (action as ISetVideoReady).videoReady,
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

        case types.addClientSignalData:
            return addSignalData(state, action as IAddSignalData, Def.DataType.HOST);

        case types.addHostSignalData:
            return addSignalData(state, action as IAddSignalData, Def.DataType.HOST);

        case types.createPeer:
            return Object.assign({}, state, {
                hostPeers: state.hostPeers.concat({
                    signalStatus: false,
                    clientID: (action as ICreatePeer).clientID,
                    clientSignalData: (action as ICreatePeer).signalData,
                    hostSignalData: [],
                }),
            });

        case types.storeOfferData:
            return Object.assign({}, state, {
                offerData: state.offerData.concat((action as IStoreOffer).signalData),
            });

        case types.clearSignalData:
            return Object.assign({}, state, {
                hostPeers: state.hostPeers.map((peer) => (peer.clientID === (action as IClearSignalData).id) ? [] : peer),
            });

        case types.setServerStatus:
            return Object.assign({}, state, {
                serverStatus: (action as ISetServerStatus).serverStatus,
            });

        case types.setID:
            return Object.assign({}, state, {
                id: (action as ISetID).id,
            });

        case types.setHostID:
            return Object.assign({}, state, {
                hostID: (action as ISetHostID).hostID,
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
        case types.setSignalHost:
            return Object.assign({}, state, {
                signalHost: (action as ISetSignalHost).signalHost,
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
