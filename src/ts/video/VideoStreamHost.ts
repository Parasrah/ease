import VideoStream from './VideoStream';

/**
 * Host to send and watch the video stream
 */
export default class VideoStreamHost extends VideoStream {

    constructor(filepath: string) {
        super(filepath, true)
    }
    
}
