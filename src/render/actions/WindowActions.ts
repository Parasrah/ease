import { Action } from "redux";
import { ActionType } from "./Action";

/*************************************************************/
/********************* Action Definitions ********************/
/*************************************************************/

export type WindowAction = IMaximizeAction | IUnmaximizeAction | IBlockResizeAction;

export interface IMaximizeAction extends Action {}

export interface IUnmaximizeAction extends Action {}

export interface IBlockResizeAction extends Action {
    block: boolean;
}

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

export function blockResizeAction(block: boolean): IBlockResizeAction {
    return {
        type: ActionType.windowAction.blockResizeAction,
        block,
    };
}

export type blockResizeAction = (block: boolean) => IBlockResizeAction;
