import { ToAction, ActionType } from "./Action";
import { Action } from "redux";

/*************************************************************/
/********************* Action Definitions ********************/
/*************************************************************/

export type WindowAction = IResizePageAction;

export interface IResizePageAction extends Action {
    readonly height: number;
    readonly width: number;
}

/*************************************************************/
/*********************** Action Creators *********************/
/*************************************************************/

export const resizePageAction = (width: number, height: number): ToAction<IResizePageAction> => {
    return {
        type: ActionType.windowAction.resizePageAction,
        width,
        height,
    };
};

export type resizePageAction = (width: number, height: number) => ToAction<IResizePageAction> ;