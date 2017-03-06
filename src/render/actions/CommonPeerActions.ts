import { Action } from "redux";
import { ActionType, ToAction } from "./Action";

/*************************************************************/
/********************* Action Definitions ********************/
/*************************************************************/

export type CommonPeerAction = ISetServerStatusAction | ISetIDAction;

export interface ISetServerStatusAction extends Action {
    readonly serverStatus: boolean;
}

export interface ISetIDAction extends Action {
    readonly id: string;
}

/*************************************************************/
/*********************** Action Creators *********************/
/*************************************************************/

export const setIDAction = (id: string): ToAction<ISetIDAction> => {
    return {
        type: ActionType.commonPeerAction.setIDAction,
        id,
    };
};

export type setIDAction = (id: string) => ToAction<ISetIDAction>;

const setServerStatusAction = (serverStatus: boolean): ToAction<ISetServerStatusAction> => {
    return {
        type: ActionType.commonPeerAction.setServerStatusAction,
        serverStatus,
    };
};

export const watchServerStatusAction = (socket: SocketIOClient.Socket) => {
    return (dispatch, getState) => {

        if (socket.connected) {
            dispatch(setServerStatusAction(true));
        }

        socket.on("connect", () => {
            dispatch(setServerStatusAction(true));
        });

        socket.on("disconnect", () => {
            dispatch(setServerStatusAction(false));
        });

        // TODO watch for errors and log to store via `dispatch(action)`

    };
};

export type watchServerStatusAction = (socket: SocketIOClient.Socket) => ToAction<ISetServerStatusAction>;
