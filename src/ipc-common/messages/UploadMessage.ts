import { ChannelAction } from "../../constants/ChannelActions";
import { IMessage } from "./Message";

// Message Definitions

export type UploadMessage = IOpenDialogMessage;

export interface IOpenDialogMessage extends IMessage {}

// Message Creators

export function createOpenDialogAction(): IOpenDialogMessage {
    return {
        type: ChannelAction.uploadChannelAction.openDialog,
    };
}

export type createOpenDialogAction = () => IOpenDialogMessage;
