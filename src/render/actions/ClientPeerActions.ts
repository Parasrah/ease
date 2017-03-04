import { Action, ActionType, ICheck } from "./Action";
import { SignalData, Instance } from "simple-peer";

/*************************************************************/
/********************* Action Definitions ********************/
/*************************************************************/

export type ClientPeerAction = ISetHostIDAction | IStoreOfferAction | IClearOfferDataAction | ISetPeerStatusAction;

export interface ISetHostIDAction extends ICheck {
    readonly hostID: string;
}

export interface IStoreOfferAction {
    signalData: SignalData;
}

export interface IClearOfferDataAction extends ICheck {

}

export interface ISetPeerStatusAction extends ICheck {
    peerStatus: boolean;
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

export const setPeerStatusAction: setPeerStatusAction = (peerStatus) => {
    return {
        type: ActionType.clientPeerAction.setPeerStatusAction,
        peerStatus,
    };
};

export type setPeerStatusAction = (peerStatus: boolean) => Action<ISetPeerStatusAction>;

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
