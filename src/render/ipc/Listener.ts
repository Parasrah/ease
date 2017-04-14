import { ipcRenderer } from "electron";
import { RenderChannel } from "../../constants/Channels";
import { curry } from "../../ipc-common/Currier";
import { uploadController } from "./UploadController";
import { windowController } from "./WindowController";

/**
 * Listens to the messages from main process and updates the store
 */
export function listen() {
    Object.keys(RenderChannel).map(function(key) {
        const channel = RenderChannel[key];
        switch (channel) {
            case RenderChannel.uploadResponseChannel:
                ipcRenderer.on(channel, curry(uploadController));
                break;

            case RenderChannel.windowRenderChannel:
                ipcRenderer.on(channel, curry(windowController));
                break;

            default:
                console.error("No such channel: " + channel);
        }
    });
}
