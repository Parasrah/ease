import { Action } from "redux";
import { ActionType } from "./Action";

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
export const setPlayStatusAction = (play: boolean): IPlayPauseAction => {
    return {
        type: ActionType.videoAction.setPlayStatusAction,
        play,
    };
};

export type setPlayStatusAction = (play: boolean) => IPlayPauseAction;

export const setFullscreenAction = (fullscreen: boolean): IFullscreenAction => {
    return {
        type: ActionType.videoAction.fullscreenAction,
        fullscreen,
    };
};

export type setFullscreenAction = (fullscreen: boolean) => IFullscreenAction;

export const setVideoReadyAction = (videoReady: boolean): ISetVideoReadyAction => {
    return {
        type: ActionType.videoAction.setVideoReadyAction,
        videoReady,
    };
};

export type setVideoReadyAction = (videoReady: boolean) => ISetVideoReadyAction;
