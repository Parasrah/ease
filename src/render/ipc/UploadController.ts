import { ChannelAction } from "../../constants/ChannelActions";
import { IReturnPathMessage, UploadMessage } from "../../ipc-common/messages/UploadMessage";
import { setPathAction } from "../actions/VideoActions";
import { StoreWrapper } from "../redux/Store";

export function uploadController(event: Electron.IpcRendererEvent, message: UploadMessage) {
    const type = ChannelAction.uploadChannelAction;

    switch (message.type) {
        case type.returnPath:
            StoreWrapper.getInstance().dispatch(setPathAction((message as IReturnPathMessage).path));
            break;

        default:
            throw new Error("Was not prepared to receive message of type `%s`".replace("%s", message.type));
    }
}
