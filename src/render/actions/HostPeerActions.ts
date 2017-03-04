import { Action, ActionType, ICheck } from "./Action";
import { SignalData } from "simple-peer";

/*************************************************************/
/********************* Action Definitions ********************/
/*************************************************************/

export type HostPeerAction = ICreatePeerAction | IAddSignalDataAction | IClearSignalDataAction | ISetPeerStatusAction;

export interface ICreatePeerAction extends ICheck {
    clientID: string;
    signalData?: SignalData[];
}

export interface IAddSignalDataAction extends ICheck {
    signalData: SignalData;
    clientID: string;
}

export interface IClearSignalDataAction extends ICheck {
    id: string;
}

export interface ISetPeerStatusAction extends ICheck {
    clientID: string;
    status: boolean;
}

/*************************************************************/
/*********************** Action Creators *********************/
/*************************************************************/

export const createPeerAction = (clientID: string, ...signalData: SignalData[]): Action<ICreatePeerAction> => {
    return {
        type: ActionType.hostPeerAction.createPeerAction,
        clientID,
        signalData,
    };
};

export type createPeerAction = (clientID: string, ...signalData: SignalData[]) => Action<ICreatePeerAction>;

export const addClientSignalDataAction = (clientID: string, signalData: SignalData): Action<IAddSignalDataAction> => {
    return {
        type: ActionType.hostPeerAction.addClientSignalDataAction,
        signalData,
        clientID,
    };
};

export type addClientSignalDataAction = (clientID: string, signalData: SignalData) => Action<IAddSignalDataAction>;

export const addHostSignalDataAction = (clientID: string, signalData: SignalData): Action<IAddSignalDataAction> => {
    return {
        type: ActionType.hostPeerAction.addHostSignalDataAction,
        signalData,
        clientID,
    };
};

export type addHostSignalDataAction = (clientID: string, signalData: SignalData) => Action<IAddSignalDataAction>;

export const clearSignalDataAction: clearSignalDataAction = (id) => {
    return {
        type: ActionType.hostPeerAction.clearSignalDataAction,
        id,
    };
};

export type clearSignalDataAction = (id: string) => Action<IClearSignalDataAction>;

export const setPeerStatusAction: setPeerStatusAction = (clientID, status) => {
    return {
        type: ActionType.hostPeerAction.setPeerStatusAction,
        clientID,
        status,
    };
};

export type setPeerStatusAction = (clientID: string, status: boolean) => Action<ISetPeerStatusAction>;
