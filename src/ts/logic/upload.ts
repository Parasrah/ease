/**
 * Logic for the file upload 
 */

import { IndexChannel } from '../constants/ChannelConst';
import { ipcRenderer } from 'electron';

let uploadClick = document.querySelector('.test-click');
uploadClick.addEventListener('click', () => {
    ipcRenderer.send(IndexChannel.UPLOAD_CLICK);
})
