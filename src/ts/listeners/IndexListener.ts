import { IndexChannel } from '../constants/ChannelConst';

// Setup the event listeners for the index
export let setupIndex = (ipc: Electron.IpcMain) => {
    
    ipc.on(IndexChannel.UPLOAD_CLICK, () => {
        console.log('Test click');
    });

};
