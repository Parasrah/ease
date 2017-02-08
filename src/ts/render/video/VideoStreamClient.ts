import * as peer from 'simple-peer';

import VideoStream from './VideoStream';

export default class VideoStreamClient extends VideoStream {
    private video : any;

    constructor() {
        super();
    }

    protected call() {
        console.log('initiating call');
        
    }

    protected getStream() {
        let videoElement : any = document.getElementById('video');
        if (!this.video) {
            if (videoElement.captureStream) {
                this.video = videoElement.captureStream();
            }
            else {
                throw "captureStream() not supported";
            }
        }
        return this.video;
    }

}