import { ChannelAction } from "../../constants/ChannelActions";
import { IMessage } from "./Message";

// Message Definitions

export type WindowMessage = ICloseMessage | IMaximizeMessage | IMinimizeMessage | IResizeMessage | IUnmaximizeMessage;

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
        type: ChannelAction.windowChannelAction.close,
    };
}

export function createMaximizeMessage(): IMaximizeMessage {
    return {
        type: ChannelAction.windowChannelAction.maximize,
    };
}

export function createUnmaximizeMessage(): IUnmaximizeMessage {
    return {
        type: ChannelAction.windowChannelAction.unmaximize,
    };
}

export function createMinimizeMessage(): IMinimizeMessage {
    return {
        type: ChannelAction.windowChannelAction.minimize,
    };
}

export function createResizeMessage(width: number, height: number): IResizeMessage {
    return {
        type: ChannelAction.windowChannelAction.resize,
        width,
        height,
    };
}
