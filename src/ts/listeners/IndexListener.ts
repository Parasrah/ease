import { ipcMain, dialog } from 'electron';

// Setup the event listeners for the index
export class IndexListener {

    static setupIndex = (browserWindow: Electron.BrowserWindow) => {
        ipcMain.on('upload-click', () => {
            dialog.showOpenDialog(browserWindow, {
                title: 'Select your movie',
                properties: ['openFile'],
                filters: [
                    {name: 'Movies', extensions: ['mkv', 'avi', 'mp4']},
                ]
            }, (fileNames) => {
                console.log(fileNames.length);
            });
        });
    };
} 
