import { ChannelAction } from "../../constants/ChannelActions";
import { IMessage } from "./Message";

// Message Definitions

export type UploadMessage = IOpenDialogMessage | IReturnPathMessage;

export interface IOpenDialogMessage extends IMessage {}

export interface IReturnPathMessage extends IMessage {
    path: string;
}

// Message Creators

export function createOpenDialogAction(): IOpenDialogMessage {
    return {
        type: ChannelAction.uploadChannelAction.openDialog,
    };
}

export type createOpenDialogAction = () => IOpenDialogMessage;

export function createReturnPathAction(path: string): IReturnPathMessage {
    return {
        type: ChannelAction.uploadChannelAction.returnPath,
        path,
    };
}

export type createReturnPathAction = (path: string) => IReturnPathMessage;
