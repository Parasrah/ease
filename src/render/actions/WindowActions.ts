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

export function maximizeAction(): IMaximizeAction {
    return {
        type: ActionType.windowAction.maximizeAction,
    };
}

export type maximizeAction = () => IMaximizeAction;

export function unmaximizeAction(): IUnmaximizeAction {
    return {
        type: ActionType.windowAction.unmaximizeAction,
    };
}

export type unmaximizeAction = () => IUnmaximizeAction;
