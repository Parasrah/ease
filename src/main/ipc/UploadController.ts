import { dialog } from "electron";

import { RenderChannel } from "../../constants/Channels";

export function uploadController(event: Electron.IpcMainEvent) {
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
            event.sender.send(RenderChannel.uploadResponseChannel, fileNames[0]);
        }
    });
}
