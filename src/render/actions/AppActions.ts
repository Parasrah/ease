import { Action, ActionType, ICheck } from "./Action";
import { Page } from "../utils/Definitions";

/*************************************************************/
/********************* Action Definitions ********************/
/*************************************************************/

export type AppAction = IChangePageAction;

export interface IChangePageAction extends ICheck {
    readonly page: Page;
}

/*************************************************************/
/*********************** Action Creators *********************/
/*************************************************************/

export const changePageAction = (page: Page): Action<IChangePageAction> => {
    return {
        type: ActionType.appAction.changePageAction,
        page,
    };
};

export type changePageAction = (page: Page) => Action<IChangePageAction>;
