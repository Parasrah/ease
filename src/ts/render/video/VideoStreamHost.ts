import * as net from 'net';
import * as fs from 'fs';

import VideoStream from './VideoStream';


/**
 * Host to send and watch the video stream
 */
export default class VideoStreamHost extends VideoStream {
    private server: net.Server;

    constructor(filepath: string) {
        super();
    }
}
