import { combineReducers } from "redux";

import * as Action from "./Actions";
import * as State from "./State";
import * as Def from "./Definitions";

/**************************** App ****************************/

const initialAppState: State.IAppState = {
    page: Def.Page.START,
    error: [],
};

const appState = (state: State.IAppState = initialAppState, action: Action.AppAction): State.IAppState => {
    const types = Action.ActionType.appAction;

    switch (action.type) {

        case types.changePage:
            return Object.assign({}, state, {
                page: (action as Action.IChangePage).page,
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

const windowState = (state: State.IWindowState = initialWindowState, action: Action.WindowAction): State.IWindowState => {
    const types = Action.ActionType.windowAction;

    switch (action.type) {

        case types.resizePage:
            return Object.assign({}, state, {
                height: (action as Action.IResizePage).height,
                width: (action as Action.IResizePage).width,
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

const videoState = (state: State.IVideoState = initialVideoState, action: Action.VideoAction): State.IVideoState => {
    const types = Action.ActionType.videoAction;

    switch (action.type) {
        case types.fullscreen:
            return Object.assign({}, state, {
                fullscreen: (action as Action.IFullscreen).fullscreen,
            });

        case types.playPause:
            return Object.assign({}, state, {
                play: (action as Action.IPlayPause).play,
            });

        case types.setVideoReady:
            return Object.assign({}, state, {
                videoReady: (action as Action.ISetVideoReady).videoReady,
            });

        default:
            return state;
    }
};

/*************************** Peer ****************************/

const initialPeerState: State.IPeerState = {
    id: "",
    serverStatus: false,
    hostSignalData: false,
    hostPeers: [],
    hostID: "",
};

const peerState = (state: State.IPeerState = initialPeerState, action: Action.PeerAction): State.IPeerState => {
    const types = Action.ActionType.peerAction;

    switch (action.type) {

        case types.addSignalData:
            const addSignalAction = action as Action.IAddSignalData;
            return Object.assign({}, state, {
                hostPeers: state.hostPeers.map((peer) => {
                    return (peer.id === addSignalAction.id) ?
                       Object.assign(peer, {
                           signalData: peer.signalData.concat(addSignalAction.signalData),
                       }) : peer;
                }),
            });

        case types.createPeer:
            return Object.assign({}, state, {
                hostPeers: state.hostPeers.concat({
                    signalStatus: false,
                    id: (action as Action.ICreatePeer).id,
                    signalData: (action as Action.ICreatePeer).signalData,
                }),
            });

        case types.setServerStatus:
            return Object.assign({}, state, {
                serverStatus: (action as Action.ISetServerStatus).serverStatus,
            });

        case types.setID:
            return Object.assign({}, state, {
                id: (action as Action.ISetID).id,
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
});

export default appReducer;
