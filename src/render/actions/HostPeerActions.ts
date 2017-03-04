import { SignalData } from "simple-peer";
import { ToAction, ActionType } from "./Action";
import { Action } from "redux";

/*************************************************************/
/********************* Action Definitions ********************/
/*************************************************************/

export type HostPeerAction = ICreatePeerAction | IAddSignalDataAction | IClearSignalDataAction | ISetPeerStatusAction;

export interface ICreatePeerAction extends Action {
    clientID: string;
    signalData?: SignalData[];
}

export interface IAddSignalDataAction extends Action {
    signalData: SignalData;
    clientID: string;
}

export interface IClearSignalDataAction extends Action {
    id: string;
}

export interface ISetPeerStatusAction extends Action {
    clientID: string;
    status: boolean;
}

/*************************************************************/
/*********************** Action Creators *********************/
/*************************************************************/

export const createPeerAction = (clientID: string, ...signalData: SignalData[]): ToAction<ICreatePeerAction> => {
    return {
        type: ActionType.hostPeerAction.createPeerAction,
        clientID,
        signalData,
    };
};

export type createPeerAction = (clientID: string, ...signalData: SignalData[]) => ToAction<ICreatePeerAction>;

export const addClientSignalDataAction = (clientID: string, signalData: SignalData): ToAction<IAddSignalDataAction> => {
    return {
        type: ActionType.hostPeerAction.addClientSignalDataAction,
        signalData,
        clientID,
    };
};

export type addClientSignalDataAction = (clientID: string, signalData: SignalData) => ToAction<IAddSignalDataAction>;

export const addHostSignalDataAction = (clientID: string, signalData: SignalData): ToAction<IAddSignalDataAction> => {
    return {
        type: ActionType.hostPeerAction.addHostSignalDataAction,
        signalData,
        clientID,
    };
};

export type addHostSignalDataAction = (clientID: string, signalData: SignalData) => ToAction<IAddSignalDataAction>;

export const clearSignalDataAction: clearSignalDataAction = (id) => {
    return {
        type: ActionType.hostPeerAction.clearSignalDataAction,
        id,
    };
};

export type clearSignalDataAction = (id: string) => ToAction<IClearSignalDataAction>;

export const setPeerStatusAction: setPeerStatusAction = (clientID, status) => {
    return {
        type: ActionType.hostPeerAction.setPeerStatusAction,
        clientID,
        status,
    };
};

export type setPeerStatusAction = (clientID: string, status: boolean) => ToAction<ISetPeerStatusAction>;
