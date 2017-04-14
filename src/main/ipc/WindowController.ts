import { ChannelAction } from "../../constants/ChannelActions";
import { IResizeMessage, WindowMessage, IMinimumSizeMessage } from "../../ipc-common/messages/WindowMessage";

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
            // If window is maximized, should not resize page
            if (window.isMaximized()) {
                break;
            }
            (function() {
                // Get current window dimensions
                const dimensions = window.getSize();

                // Get message dimensions
                let width = (message as IResizeMessage).width;
                let height = (message as IResizeMessage).height;

                // Determine which to use
                width = (width == -1) ? dimensions[0] : width;
                height = (height == -1) ? dimensions[1] : height;

                // Determine whether a page resize is necessary
                if (width != dimensions[0] || height != dimensions[1]) {
                    window.setSize(width, height);
                }
            })();
            break;

        case type.minimumSize:
            (function() {
                const width = (message as IMinimumSizeMessage).width;
                const height = (message as IMinimumSizeMessage).height;
                window.setMinimumSize(width, height);
            })();
            break;

        default:
            throw new Error("No such message type: " + message.type);
    }
}
