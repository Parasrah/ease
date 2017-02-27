import { IVideoState } from "../redux/State";
import { Action, ActionType } from "../Actions/Action";
import { VideoAction, IFullscreenAction, IPlayPauseAction, ISetVideoReadyAction } from "../Actions/VideoActions";

const initialVideoState: IVideoState = {
    play: false,
    fullscreen: false,
    subtitles: null,
    jumpToTime: null,
    controlStatus: null,
    volume: null,
    videoReady: false,
};

const videoState = (state: IVideoState = initialVideoState, action: Action<VideoAction>): IVideoState => {
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

export default videoState;
