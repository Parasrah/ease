export const MessageType = {
    PLAY_PAUSE: "play-pause",
    SEEK: "seek",
};

export interface IControlMessage {
    readonly type: string;
};

export interface ISeekMessage extends IControlMessage {
    readonly time: number;
}
