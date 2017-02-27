import { Action, ActionType, ICheck } from "./Action";

/*************************************************************/
/********************* Action Definitions ********************/
/*************************************************************/

export type VideoAction = IPlayPauseAction | IFullscreenAction | ISetVideoReadyAction;

export interface IPlayPauseAction extends ICheck {
    readonly play: boolean;
}

export interface IFullscreenAction extends ICheck {
    readonly fullscreen: boolean;
}

export interface ISetVideoReadyAction extends ICheck {
    readonly videoReady: boolean;
}

/*************************************************************/
/*********************** Action Creators *********************/
/*************************************************************/

// TODO split this into two separate actions
export const playPauseAction = (play: boolean): Action<IPlayPauseAction> => {
    return {
        type: ActionType.videoAction.playPauseAction,
        play,
    };
};

export type playPauseAction = (play: boolean) => Action<IPlayPauseAction>;

export const setFullscreenAction = (fullscreen: boolean): Action<IFullscreenAction> => {
    return {
        type: ActionType.videoAction.fullscreenAction,
        fullscreen,
    };
};

export type setFullscreenAction = (fullscreen: boolean) => Action<IFullscreenAction>;

export const setVideoReadyAction = (videoReady: boolean): Action<ISetVideoReadyAction> => {
    return {
        type: ActionType.videoAction.setVideoReadyAction,
        videoReady,
    };
};

export type setVideoReadyAction = (videoReady: boolean) => Action<ISetVideoReadyAction>;
