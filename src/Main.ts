/**
 * Entry file for the electron application. 
 * 
 * Written from a template found here [http://blog.dmbcllc.com/typescript-and-electron-the-right-way/]
 */

import { BrowserWindow, ipcMain } from 'electron';
import { ListenerUtils } from './ts//main/ListenerUtils';
import * as Constants from './ts/constants/Constants';

export default class Main {
    static mainWindow: Electron.BrowserWindow;
    static application: Electron.App;
    static BrowserWindow : typeof BrowserWindow;
    
    private static onWindowAllClosed() {
        if (process.platform !== 'darwin') {
            Main.application.quit();
        }
    }

    private static onClose() {
        // Dereference the window object.
        Main.mainWindow = null;
    }

    private static onReady() {
        Main.mainWindow = new Main.BrowserWindow({width: Constants.DEFAULT_WIDTH, height: Constants.DEFAULT_HEIGHT, webPreferences: { experimentalFeatures: true }});
        Main.mainWindow.loadURL('file://' + __dirname + '/../../src/index.html');
        ListenerUtils.listen();
        Main.mainWindow.on('closed', Main.onClose);
    }

    private static onFileOpen(event: Event) {
        event.preventDefault();
        console.log('File open');
    }

    static main(app: Electron.App, browserWindow: typeof BrowserWindow) {
        Main.BrowserWindow = browserWindow;
        Main.application = app;
        Main.application.on('window-all-closed', Main.onWindowAllClosed);
        Main.application.on('open-file', Main.onFileOpen);
        Main.application.on('ready', Main.onReady);
    }
}
