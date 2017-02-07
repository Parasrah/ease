import * as net from 'net';

import VideoStream from './VideoStream';

export default class VideoStreamClient extends VideoStream {
    private client: net.Socket;

    constructor(filepath: string, host: string) {
        super(filepath);
        this.client = new net.Socket();
    }

}