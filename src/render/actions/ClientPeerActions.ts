import { Instance, SignalData } from "simple-peer";
import { ToAction, ActionType } from "./Action";
import { Action } from "redux";

/*************************************************************/
/********************* Action Definitions ********************/
/*************************************************************/

export type ClientPeerAction = ISetHostIDAction | IStoreOfferAction | IClearOfferDataAction | ISetPeerStatusAction;

export interface ISetHostIDAction extends Action {
    readonly hostID: string;
}

export interface IStoreOfferAction {
    signalData: SignalData;
}

export interface IClearOfferDataAction extends Action {

}

export interface ISetPeerStatusAction extends Action {
    peerStatus: boolean;
}

/*************************************************************/
/*********************** Action Creators *********************/
/*************************************************************/

export const setHostIDAction = (hostID: string): ToAction<ISetHostIDAction> => {
    return {
        type: ActionType.clientPeerAction.setHostIDAction,
        hostID,
    };
};

export type setHostIDAction = (hostID: string) => ToAction<ISetHostIDAction>;

export const storeOfferDataAction = (signalData: SignalData): ToAction<IStoreOfferAction> => {
    return {
        type: ActionType.clientPeerAction.storeOfferDataAction,
        signalData,
    };
};

export type storeOfferDataAction = (signalData: SignalData) => ToAction<IStoreOfferAction>;

export const clearOfferDataAction: clearOfferDataAction = () => {
    return {
        type: ActionType.clientPeerAction.clearOfferDataAction,
    };
};

export type clearOfferDataAction = () => ToAction<IClearOfferDataAction>;

export const setPeerStatusAction: setPeerStatusAction = (peerStatus) => {
    return {
        type: ActionType.clientPeerAction.setPeerStatusAction,
        peerStatus,
    };
};

export type setPeerStatusAction = (peerStatus: boolean) => ToAction<ISetPeerStatusAction>;

export const watchPeerStatusAction = (peer: Instance) => {
    return (dispatch) => {
        peer.on("connect", () => {
            dispatch(setPeerStatusAction(true));
        });

        peer.on("close", () => {
            dispatch(setPeerStatusAction(false));
        });
    };
};

export type watchPeerStatusAction = (peer: Instance) => void;
