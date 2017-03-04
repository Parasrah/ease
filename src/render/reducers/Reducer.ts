import { combineReducers } from "redux";

import appState from "./AppReducer";
import windowState from "./WindowReducer";
import videoState from "./VideoReducer";
import commonPeerState from "./CommonPeerReducer";
import hostPeerState from "./HostPeerReducer";
import clientPeerState from "./ClientPeerReducer";
import settingsState from "./SettingsReducer";

const easeReducer = combineReducers({
    appState,
    windowState,
    videoState,
    commonPeerState,
    hostPeerState,
    clientPeerState,
    settingsState,
});

export default easeReducer;
