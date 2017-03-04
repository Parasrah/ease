import { combineReducers } from "redux";

import appState from "./AppReducer";
import clientPeerState from "./ClientPeerReducer";
import commonPeerState from "./CommonPeerReducer";
import hostPeerState from "./HostPeerReducer";
import settingsState from "./SettingsReducer";
import videoState from "./VideoReducer";
import windowState from "./WindowReducer";

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
