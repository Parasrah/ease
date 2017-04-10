import { ChannelAction } from "../../constants/ChannelActions";
import { WindowMessage } from "../../ipc-common/messages/WindowMessage";
import { createMaximizeAction, createUnmaximizeAction } from "../actions/WindowActions";
import { StoreWrapper } from "../redux/Store";

export function windowController(event: Electron.IpcRendererEvent, message: WindowMessage) {
    const type = ChannelAction.windowChannelAction;

    switch (message.type) {
        case type.maximize:
            StoreWrapper.getInstance().dispatch(createMaximizeAction());
            break;

        case type.unmaximize:
            StoreWrapper.getInstance().dispatch(createUnmaximizeAction());
            break;

        default:
            throw new Error("Was not prepared to receive message of type `%s`".replace("%s", message.type));
    }
}
