import { combineReducers } from "redux";

import { ActionType , IChangePage, VideoPageAction, ContainerAction } from "./Actions";
import { IVideoState, IAppState } from "./State";
import { Page } from "./Definitions";

/************************* Container *************************/

const initialAppState: IAppState = {
    height: 600,
    width: 800,
    page: Page.START,
};

const containerReducer = (state: IAppState = initialAppState, action: ContainerAction): IAppState => {
    return state;
};

/************************* Video Page ************************/

const initialVideoState: IVideoState = {
    play: false,
    fullscreen: false,
};

const videoPageReducer = (state: IVideoState = initialVideoState, action: VideoPageAction): IVideoState => {
    return state;

    // const types = ActionType.videoPageAction;

    // switch (action.type) {
    //     case types.fullscreenVideo:

    //         break;

    //     case types.playPause:

    //         break;

    //     case types.seekVideo:

    //         break;

    //     default:
    //         return state;
    // }
};

/*************************** End *****************************/

const app = combineReducers({
    containerReducer,
    videoPageReducer,
});

export default app;
