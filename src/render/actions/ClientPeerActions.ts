import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import { Instance } from "simple-peer";
import { IState } from "../redux/State";
import { ActionType } from "./Action";

/*************************************************************/
/********************* Action Definitions ********************/
/*************************************************************/

export type ClientPeerAction = ISetHostIDAction | ISetPeerStatusAction;

export interface ISetHostIDAction extends Action {
    readonly hostID: string;
}

export interface ISetPeerStatusAction extends Action {
    peerStatus: boolean;
}

/*************************************************************/
/*********************** Action Creators *********************/
/*************************************************************/

export const setHostIDAction = (hostID: string): ISetHostIDAction => {
    return {
        type: ActionType.clientPeerAction.setHostIDAction,
        hostID,
    };
};

export type setHostIDAction = (hostID: string) => ISetHostIDAction;

export const setPeerStatusAction: setPeerStatusAction = (peerStatus) => {
    return {
        type: ActionType.clientPeerAction.setPeerStatusAction,
        peerStatus,
    };
};

export type setPeerStatusAction = (peerStatus: boolean) => ISetPeerStatusAction;

export const watchPeerStatusAction: watchPeerStatusAction = (peer) => {
    return (dispatch, getState) => {
        peer.on("connect", () => {
            dispatch(setPeerStatusAction(true));
        });

        peer.on("close", () => {
            dispatch(setPeerStatusAction(false));
        });
    };
};

export type watchPeerStatusAction = (peer: Instance) => ThunkAction<void, IState, void>;
