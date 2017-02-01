// Setup the event listeners for the index
export let setupIndex = (ipc: Electron.IpcMain) => {

    ipc.on('upload-click', () => {
        console.log('Test click');
    });

};
