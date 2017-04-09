import { ipcMain } from "electron";

import { MainChannel } from "../../constants/Channels";
import { dispatch } from "./Dispatcher";
import { uploadController } from "./UploadController";
import { windowController } from "./WindowController";

export function listen(window: Electron.BrowserWindow) {
    Object.keys(MainChannel).map(function(key) {
        const channel = MainChannel[key];
        switch (channel) {
            case MainChannel.uploadChannel:
                ipcMain.on(channel, dispatch(uploadController));
                break;
            case MainChannel.windowChannel:
                ipcMain.on(channel, dispatch(windowController, window));
                break;
            default:
                console.error("Unhandled channel type: " + channel);
        }
    });
}
