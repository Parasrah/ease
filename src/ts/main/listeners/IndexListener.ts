import { ipcMain, dialog } from 'electron';

// Setup the event listeners for the index
export class IndexListener {

    static setupIndex = () => {
        ipcMain.on('upload-click', () => {
            dialog.showOpenDialog({
                title: 'Select your movie',
                properties: ['openFile'],
                filters: [
                    {name: 'Movies', extensions: ['mkv', 'avi', 'mp4']},
                ]
            }, (fileNames) => {
                console.log(fileNames);
            });
        });
    };
} 
