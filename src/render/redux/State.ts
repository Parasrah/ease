import { Page } from "./Definitions";

export interface IState {
    readonly videoState: IVideoState;
}

export interface IAppState {
    page: Page;
    height: number;
    width: number;
}

export interface IVideoState {
    play: boolean;
    fullscreen: boolean;
}
