import { Action } from "redux";
import { ActionType } from "./Action";

/*************************************************************/
/********************* Action Definitions ********************/
/*************************************************************/

export type SettingsAction = ISetSignalHostAction;

export interface ISetSignalHostAction extends Action {
    signalHost: string;
}

/*************************************************************/
/*********************** Action Creators *********************/
/*************************************************************/

export const setSignalHostAction = (signalHost: string) => {
    return {
        type: ActionType.settingsAction.setSignalHostAction,
        signalHost,
    };
};

export type setSignalHostAction = (signalHost: string) => ISetSignalHostAction;
