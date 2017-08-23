import { dialog } from "electron";

import { ChannelAction } from "../../constants/ChannelActions";
import { RenderChannel } from "../../constants/Channels";
import { createReturnPathAction, UploadMessage } from "../../ipc-common/messages/UploadMessage";

export function uploadController(event: Electron.IpcMainEvent, message: UploadMessage) {
    const type = ChannelAction.uploadChannelAction;

    switch (message.type) {
        case type.openDialog:
            dialog.showOpenDialog({
                filters: [
                    { name: "Movies", extensions: ["mp4"] },
                ],
                properties: ["openFile"],
                title: "Select your movie",
            }, (fileNames) => {
                if (!fileNames) {
                    console.log("No file chosen");
                }
                else if (fileNames.length !== 1) {
                    throw new Error("Too many files");
                }
                else {
                    event.sender.send(RenderChannel.uploadResponseChannel, createReturnPathAction(fileNames[0]));
                }
            });
            break;

        default:
            throw new Error("No such message type: " + message.type);
    }
}
