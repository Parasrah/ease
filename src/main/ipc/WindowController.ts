import { WindowChannelAction as type } from "../../constants/ChannelActions";

export function windowController(window: Electron.BrowserWindow, event: Electron.IpcMainEvent, windowAction: string) {
    switch (windowAction) {
        case type.close:

            break;

        case type.maximize:

            break;

        case type.minimize:

            break;

        default:
            console.error("No such action type: " + windowAction);
    }
}
