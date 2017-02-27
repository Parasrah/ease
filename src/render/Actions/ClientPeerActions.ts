import { Action, ActionType, ICheck } from "./Action";
import { SignalData } from "simple-peer";

/*************************************************************/
/********************* Action Definitions ********************/
/*************************************************************/

export type ClientPeerAction = ISetHostIDAction | IStoreOfferAction | IClearOfferDataAction;

export interface ISetHostIDAction extends ICheck {
    readonly hostID: string;
}

export interface IStoreOfferAction {
    signalData: SignalData;
}

export interface IClearOfferDataAction extends ICheck {

}

/*************************************************************/
/*********************** Action Creators *********************/
/*************************************************************/

export const setHostIDAction = (hostID: string): Action<ISetHostIDAction> => {
    return {
        type: ActionType.clientPeerAction.setHostIDAction,
        hostID,
    };
};

export type setHostIDAction = (hostID: string) => Action<ISetHostIDAction>;

export const storeOfferDataAction = (signalData: SignalData): Action<IStoreOfferAction> => {
    return {
        type: ActionType.clientPeerAction.storeOfferDataAction,
        signalData,
    };
};

export type storeOfferDataAction = (signalData: SignalData) => Action<IStoreOfferAction>;

export const clearOfferDataAction: clearOfferDataAction = () => {
    return {
        type: ActionType.clientPeerAction.clearOfferDataAction,
    };
};

export type clearOfferDataAction = () => Action<IClearOfferDataAction>;
