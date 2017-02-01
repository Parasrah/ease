/**
 * Logic for the file upload 
 */

import { ipcRenderer } from 'electron';

let uploadClick = document.querySelector('.test-click');
uploadClick.addEventListener('click', () => {
    ipcRenderer.send('upload-click');
})
