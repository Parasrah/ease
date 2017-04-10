import { WindowChannelAction } from "../constants/ChannelActions";
import { IMessage } from "./Message";

// Message Definitions

export type WindowMessage = ICloseMessage | IMaximizeMessage | IMinimizeMessage | IResizeMessage;

export interface ICloseMessage extends IMessage {}

export interface IMaximizeMessage extends IMessage {}

export interface IUnmaximizeMessage extends IMessage {}

export interface IMinimizeMessage extends IMessage {}

export interface IResizeMessage extends IMessage {
    width: number;
    height: number;
}

// Message Creators

export function createCloseMessage(): ICloseMessage {
    return {
        type: WindowChannelAction.close,
    };
}

export function createMaximizeMessage(): IMaximizeMessage {
    return {
        type: WindowChannelAction.maximize,
    };
}

export function createUnmaximizeMessage(): IUnmaximizeMessage {
    return {
        type: WindowChannelAction.unmaximize,
    };
}

export function createMinimizeMessage(): IMinimizeMessage {
    return {
        type: WindowChannelAction.minimize,
    };
}

export function createResizeMessage(width: number, height: number): IResizeMessage {
    return {
        type: WindowChannelAction.resize,
        width,
        height,
    };
}
