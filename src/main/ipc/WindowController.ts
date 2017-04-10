import { WindowChannelAction as type } from "../../constants/ChannelActions";

export function windowController(window: Electron.BrowserWindow, event: Electron.IpcMainEvent, windowAction: string, ...args: any[]) {
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

        case type.resize:
            const dimensions = window.getSize();
            const width = (args[0] == -1) ? dimensions[0] : args[0];
            const height = (args[1] == -1) ? dimensions[1] : args[1];
            console.log("Resizing page!\nWidth: " + width + "\nHeight: " + height);
            if (width != dimensions[0] || height != dimensions[1]) {
                window.setSize(width, height);
            }
            break;

        default:
            console.error("No such action type: " + windowAction);
    }
}
