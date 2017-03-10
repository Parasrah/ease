import { Action } from "redux";
import { Page } from "../utils/Definitions";
import { ActionType } from "./Action";

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

export const changePageAction = (page: Page): IChangePageAction => {
    return {
        type: ActionType.appAction.changePageAction,
        page,
    };
};

export type changePageAction = (page: Page) => IChangePageAction;
