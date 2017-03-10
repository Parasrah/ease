import { SignalData } from "simple-peer";

/*
 * Contains any definitions required in the redux logic
 */

export enum Page {
    START = 1, VIDEO_HOST, VIDEO_CLIENT,
}

/**
 * @field PENDING - waiting for signal data to be ready
 * @field HAS_DATA - has signaling data to share with other peer
 * @field CONNECTED - connection between peers is successful
 * @field ERROR - error has occurred
 * TODO remove if unused
 */
export enum WebrtcStatus {
    PENDING = 1, CONNECTED, ERROR,
}

export interface IPeer {
    peerStatus: boolean;
    clientID: string;
    clientSignalData: SignalData[];
    hostSignalData: SignalData[];
}

export enum UserType {
    HOST = 1,
    CLIENT,
    PENDING,
}
