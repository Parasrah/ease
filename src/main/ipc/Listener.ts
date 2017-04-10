import { ipcMain } from "electron";

import { MainChannel, RenderChannel } from "../../constants/Channels";
import { curry } from "../../ipc-common/Currier";
import { createMaximizeMessage, createUnmaximizeMessage } from "../../ipc-common/messages/WindowMessage";
import { uploadController } from "./UploadController";
import { windowController } from "./WindowController";

export function listen(window: Electron.BrowserWindow) {
    listenToIpc(window);
    listenToWindow(window);
}

function listenToIpc(window: Electron.BrowserWindow) {
    Object.keys(MainChannel).map(function(key) {
        const channel = MainChannel[key];
        switch (channel) {
            case MainChannel.uploadChannel:
                ipcMain.on(channel, curry(uploadController));
                break;
            case MainChannel.windowMainChannel:
                ipcMain.on(channel, curry(windowController, window));
                break;
            default:
                console.error("Unhandled channel type: " + channel);
        }
    });
}

function listenToWindow(window: Electron.BrowserWindow) {
    window.on("maximize", () => ipcMain.emit(RenderChannel.windowRenderChannel, createMaximizeMessage()));
    window.on("unmaximize", () => ipcMain.emit(RenderChannel.windowRenderChannel, createUnmaximizeMessage()));
}
