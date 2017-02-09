import * as peer from 'simple-peer';

export default class VideoStreamClient {
    private video : any;

    constructor() {

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