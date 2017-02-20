/*
 * Contains any definitions required in the redux logic
 */

export enum Page {
    START = 1, VIDEO_HOST, VIDEO_CLIENT,
}

/**
 * @field PENDING - waiting for socket connection
 * @field SENDING - ready to send signal information
 * @field RECIEVING - ready to receive signal information
 * @field COMPLETE - signaling is complete
 */
export enum SignalStatus {
    PENDING = 1, SENDING, RECIEVING, COMPLETE,
}

/**
 * @field PENDING - waiting for signal data to be ready
 * @field HAS_DATA - has signaling data to share with other peer
 * @field CONNECTED - connection between peers is successful
 */
export enum WebrtcStatus {
    PENDING = 1, HAS_DATA, CONNECTED,
}
