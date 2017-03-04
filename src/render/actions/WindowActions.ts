import { Action, ActionType, ICheck } from "./Action";

/*************************************************************/
/********************* Action Definitions ********************/
/*************************************************************/

export type WindowAction = IResizePageAction;

export interface IResizePageAction extends ICheck {
    readonly height: number;
    readonly width: number;
}

/*************************************************************/
/*********************** Action Creators *********************/
/*************************************************************/

export const resizePageAction = (width: number, height: number): Action<IResizePageAction> => {
    return {
        type: ActionType.windowAction.resizePageAction,
        width,
        height,
    };
};

export type resizePageAction = (width: number, height: number) => Action<IResizePageAction> ;
