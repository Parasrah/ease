import { Action } from "redux";
import { Page } from "../utils/Definitions";
import { ActionType, ToAction } from "./Action";

/*************************************************************/
/********************* Action Definitions ********************/
/*************************************************************/

export type AppAction = IChangePageAction;

export interface IChangePageAction extends Action {
    readonly page: Page;
}

/*************************************************************/
/*********************** Action Creators *********************/
/*************************************************************/

export const changePageAction = (page: Page): ToAction<IChangePageAction> => {
    return {
        type: ActionType.appAction.changePageAction,
        page,
    };
};

export type changePageAction = (page: Page) => ToAction<IChangePageAction>;
