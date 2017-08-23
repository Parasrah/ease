import { Action } from "redux";
import { SignalData } from "simple-peer";
import { ActionType } from "./Action";

/*************************************************************/
/********************* Action Definitions ********************/
/*************************************************************/

export type HostPeerAction = ICreatePeerAction | IAddSignalDataAction | IClearClientSignalDataAction | ISetPeerStatusAction;

export interface ICreatePeerAction extends Action {
    clientID: string;
    signalData?: SignalData[];
}

export interface IAddSignalDataAction extends Action {
    signalData: SignalData;
    clientID: string;
}

export interface IClearClientSignalDataAction extends Action {
    id: string;
}

export interface IClearHostSignalDataAction extends Action {
    id: string;
}

export interface IRemovePeerAction extends Action {
    id: string;
}

export interface ISetPeerStatusAction extends Action {
    clientID: string;
    status: boolean;
}

/*************************************************************/
/*********************** Action Creators *********************/
/*************************************************************/

export const createPeerAction = (clientID: string, ...signalData: SignalData[]): ICreatePeerAction => {
    return {
        type: ActionType.hostPeerAction.createPeerAction,
        clientID,
        signalData,
    };
};

export type createPeerAction = (clientID: string, ...signalData: SignalData[]) => ICreatePeerAction;

export const addClientSignalDataAction = (clientID: string, signalData: SignalData): IAddSignalDataAction => {
    return {
        type: ActionType.hostPeerAction.addClientSignalDataAction,
        signalData,
        clientID,
    };
};

export type addClientSignalDataAction = (clientID: string, signalData: SignalData) => IAddSignalDataAction;

export const addHostSignalDataAction = (clientID: string, signalData: SignalData): IAddSignalDataAction => {
    return {
        type: ActionType.hostPeerAction.addHostSignalDataAction,
        signalData,
        clientID,
    };
};

export type addHostSignalDataAction = (clientID: string, signalData: SignalData) => IAddSignalDataAction;

export const clearClientSignalDataAction: clearClientSignalDataAction = (id) => {
    return {
        type: ActionType.hostPeerAction.clearClientSignalDataAction,
        id,
    };
};

export type clearClientSignalDataAction = (id: string) => IClearClientSignalDataAction;

export const clearHostSignalDataAction: clearHostSignalDataAction = (id) => {
    return {
        type: ActionType.hostPeerAction.clearHostSignalDataAction,
        id,
    };
};

export type clearHostSignalDataAction = (id: string) => IClearHostSignalDataAction;

export const removePeerAction: removePeerAction = (id) => {
    return {
        type: ActionType.hostPeerAction.removePeerAction,
        id,
    };
};

export type removePeerAction = (id: string) => IRemovePeerAction;

export const setPeerStatusAction: setPeerStatusAction = (clientID, status) => {
    return {
        type: ActionType.hostPeerAction.setPeerStatusAction,
        clientID,
        status,
    };
};

export type setPeerStatusAction = (clientID: string, status: boolean) => ISetPeerStatusAction;
