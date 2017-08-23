import { combineReducers } from "redux";

import { IState } from "../redux/State";
import appState from "./AppReducer";
import clientPeerState from "./ClientPeerReducer";
import commonPeerState from "./CommonPeerReducer";
import hostPeerState from "./HostPeerReducer";
import settingsState from "./SettingsReducer";
import videoState from "./VideoReducer";
import windowState from "./WindowReducer";

const easeReducer = combineReducers<IState>({
    appState,
    windowState,
    videoState,
    commonPeerState,
    hostPeerState,
    clientPeerState,
    settingsState,
});

export default easeReducer;
