import { Action, ActionType, ICheck } from "./Action";

/*************************************************************/
/********************* Action Definitions ********************/
/*************************************************************/

export type SettingsAction = ISetSignalHostAction;

export interface ISetSignalHostAction extends ICheck {
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

export type setSignalHostAction = (signalHost: string) => Action<ISetSignalHostAction>;
