export const ClientMessageType = {
    PLAY_PAUSE: "play-pause",
    SEEK: "seek",
};

export const HostMessageType = {
    DURATION: "duration",
    TIME: "time",
    PLAY: "play",
};

export interface IControlMessage {
    readonly type: string;
};

export interface ISeekMessage extends IControlMessage {
    readonly time: number;
}

export interface IDurationMessage extends IControlMessage {
    readonly duration: number;
}

export interface ITimeMessage extends IControlMessage {
    readonly time: number;
}

export interface IPlayMessage extends IControlMessage {
    readonly play: boolean;
}
