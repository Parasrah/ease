import { Page } from "./Definitions";

/**
 * The various action types
 */
export const ActionType = {
    containerAction: {
        changePage: "CHANGE_PAGE",
        resizePage: "RESIZE_PAGE",
    },
    videoPageAction: {
        playPause: "PLAY_PAUSE",
        seekVideo: "SEEK_VIDEO",
        fullscreenVideo: "FULLSCREEN_VIDEO",
    },
};

/**
 * Defines the action interfaces
 */
export interface IAction {
    readonly type: string;
}
/*************************************************************/
/********************* Action Definitions ********************/
/*************************************************************/

/************************* Container *************************/

export type ContainerAction = IChangePage;

export interface IChangePage extends IAction {
    readonly page: Page;
}

export interface IResizePage extends IAction {
    readonly height: number;
    readonly width: number;
}

/************************* Video Page ************************/

export type VideoPageAction = IPlayPause | ISeekVideo | IFullscreen;

export interface IPlayPause extends IAction {
    readonly play: boolean;
    readonly time: number;
}

export interface ISeekVideo extends IAction {
    readonly time: number;
}

export interface IFullscreen extends IAction {
    readonly fullscreen: boolean;
}
