import { ChannelAction } from "../../constants/ChannelActions";
import { IResizeMessage, WindowMessage } from "../../ipc-common/messages/WindowMessage";

export function windowController(window: Electron.BrowserWindow, event: Electron.IpcMainEvent, message: WindowMessage) {
    const type = ChannelAction.windowChannelAction;
    switch (message.type) {
        case type.close:
            window.close();
            break;

        case type.maximize:
            window.isMaximized() ? window.unmaximize() : window.maximize();
            break;

        case type.minimize:
            window.minimize();
            break;

        case type.resize:
            const dimensions = window.getSize();
            let width = (message as IResizeMessage).width;
            width = (width == -1) ? dimensions[0] : width;
            let height = (message as IResizeMessage).height;
            height = (height == -1) ? dimensions[1] : height;
            if (width != dimensions[0] || height != dimensions[1]) {
                window.setSize(width, height);
            }
            break;

        default:
            throw new Error("No such message type: " + message.type);
    }
}
