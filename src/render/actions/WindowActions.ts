import { Action } from "redux";
import { ActionType } from "./Action";

/*************************************************************/
/********************* Action Definitions ********************/
/*************************************************************/

export type WindowAction = IMaximizeAction | IUnmaximizeAction;

export interface IMaximizeAction extends Action {}
export interface IUnmaximizeAction extends Action {}

/*************************************************************/
/*********************** Action Creators *********************/
/*************************************************************/

export function createMaximizeAction(): IMaximizeAction {
    return {
        type: ActionType.windowAction.maximizeAction,
    };
}

export type createMaximizeAction = () => IMaximizeAction;

export function createUnmaximizeAction(): IUnmaximizeAction {
    return {
        type: ActionType.windowAction.unmaximizeAction,
    };
}

export type createUnmaximizeAction = () => IUnmaximizeAction;
