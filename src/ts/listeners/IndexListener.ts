import { IndexChannel } from '../constants/ChannelConst';

// Setup the event listeners for the index
let setupIndex = (ipc: Electron.IpcMain) => {
    
    ipc.on(IndexChannel.UPLOAD_CLICK, () => {

    });

}

export default setupIndex;
