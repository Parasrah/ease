/**
 * Logic for the file upload 
 */

import { ipcRenderer } from 'electron';
import { UPLOAD_CHANNEL } from '../constants/Channels';

document.addEventListener('DOMContentLoaded', (event) => {
    
    let uploadClick = document.querySelector('.upload-click');
    
    uploadClick.addEventListener('click', () => {
        ipcRenderer.send(UPLOAD_CHANNEL);
    });

});


