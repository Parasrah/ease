/**
 * Logic for the file upload 
 */

import { ipcRenderer } from 'electron';

document.addEventListener('DOMContentLoaded', (event) => {
    
    let uploadClick = document.querySelector('.upload-click');
    
    uploadClick.addEventListener('click', () => {
        ipcRenderer.send('upload-click');
    });

});


