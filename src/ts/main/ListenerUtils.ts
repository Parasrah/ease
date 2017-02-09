import { ipcMain, dialog } from 'electron';
import * as Channel from '../constants/Channels';
import * as Command from '../constants/Commands';

export class ListenerUtils {

    static listen = () => {
        ipcMain.on(Channel.UPLOAD_REQUEST, (event, command: Command.UploadCommand, payload: any) => {
            
            console.log('receiving: ' + command);

            switch (command) {
                case Command.UploadCommand.CLICK:
                    dialog.showOpenDialog({
                        title: 'Select your movie',
                        properties: ['openFile'],
                        filters: [
                            { name: 'Movies', extensions: ['mp4'] },
                        ]
                    }, (fileNames) => {
                        if (!fileNames) {
                            console.log('No file chosen');
                        }
                        else if (fileNames.length != 1) {
                            throw "Too many files";
                        }
                        else {
                            console.log('sending: ' + fileNames[0]);
                            event.sender.send(Channel.UPLOAD_RESPONSE, fileNames[0]);
                        }
                    });
                    break;
                default: 
                    throw "Command does not exist";
            }

        });
    };
}
