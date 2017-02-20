import { combineReducers } from "redux";

import * as Action from "./Actions";
import * as State from "./State";
import * as Def from "./Definitions";

/**************************** App ****************************/

const initialAppState: State.IAppState = {
    height: 600,
    width: 800,
    page: Def.Page.START,
};

const containerReducer = (state: State.IAppState = initialAppState, action: Action.AppAction): State.IAppState => {
    return state;
};

/**************************** Video **************************/

const initialVideoState: State.IVideoState = {
    play: false,
    fullscreen: false,
};

const videoPageReducer = (state: State.IVideoState = initialVideoState, action: Action.VideoAction): State.IVideoState => {
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

        default:
            return state;
    }
};

/*************************** Peer ****************************/

const initialPeerState: State.IPeerState = {
    signalStatus: Def.SignalStatus.PENDING,
    webrtcStatus: Def.WebrtcStatus.PENDING,
};

const peerReducer = (state: State.IPeerState = initialPeerState, action: Action.PeerAction): State.IPeerState => {
    const types = Action.ActionType.peerAction;

    switch (action.type) {

        case types.signalServer:
            return Object.assign({}, state, {
                signalStatus: (action as Action.ISignalServer).signalStatus,
            });

        case types.simplePeer:
            return Object.assign({}, state, {
                webrtcStatus: (action as Action.ISimplePeer).webrtcStatus,
            });

        default:
            return state;
    }
};

/*************************** End *****************************/

const app = combineReducers({
    containerReducer,
    videoPageReducer,
    peerReducer,
});

export default app;
