import { WindowChannelAction as type } from "../../constants/ChannelActions";

export function windowController(window: Electron.BrowserWindow, event: Electron.IpcMainEvent, windowAction: string) {
    switch (windowAction) {
        case type.close:
            window.close();
            break;

        case type.maximize:
            window.isMaximized() ? window.unmaximize() : window.maximize();
            break;

        case type.minimize:
            window.minimize();
            break;

        default:
            console.error("No such action type: " + windowAction);
    }
}
