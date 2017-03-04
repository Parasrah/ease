import { ToAction, ActionType } from "./Action";
import { Action } from "redux";

/*************************************************************/
/********************* Action Definitions ********************/
/*************************************************************/

export type VideoAction = IPlayPauseAction | IFullscreenAction | ISetVideoReadyAction;

export interface IPlayPauseAction extends Action {
    readonly play: boolean;
}

export interface IFullscreenAction extends Action {
    readonly fullscreen: boolean;
}

export interface ISetVideoReadyAction extends Action {
    readonly videoReady: boolean;
}

/*************************************************************/
/*********************** Action Creators *********************/
/*************************************************************/

// TODO split this into two separate actions
export const setPlayStatusAction = (play: boolean): ToAction<IPlayPauseAction> => {
    return {
        type: ActionType.videoAction.setPlayStatusAction,
        play,
    };
};

export type setPlayStatusAction = (play: boolean) => ToAction<IPlayPauseAction>;

export const setFullscreenAction = (fullscreen: boolean): ToAction<IFullscreenAction> => {
    return {
        type: ActionType.videoAction.fullscreenAction,
        fullscreen,
    };
};

export type setFullscreenAction = (fullscreen: boolean) => ToAction<IFullscreenAction>;

export const setVideoReadyAction = (videoReady: boolean): ToAction<ISetVideoReadyAction> => {
    return {
        type: ActionType.videoAction.setVideoReadyAction,
        videoReady,
    };
};

export type setVideoReadyAction = (videoReady: boolean) => ToAction<ISetVideoReadyAction>;
