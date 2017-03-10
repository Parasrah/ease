import { ActionType } from "../actions/Action";
import { IFullscreenAction, IPlayPauseAction, ISetVideoReadyAction, VideoAction } from "../actions/VideoActions";
import { IVideoState } from "../redux/State";

const initialVideoState: IVideoState = {
    play: false,
    fullscreen: false,
    subtitles: null,
    jumpToTime: null,
    controlStatus: null,
    volume: null,
    videoReady: false,
};

const videoState = (state: IVideoState = initialVideoState, action: VideoAction): IVideoState => {
    const types = ActionType.videoAction;

    switch (action.type) {
        case types.fullscreenAction:
            return Object.assign({}, state, {
                fullscreen: (action as IFullscreenAction).fullscreen,
            });

        case types.setPlayStatusAction:
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

export default videoState;
