import * as net from 'net';

import VideoStream from './VideoStream';

export default class VideoStreamClient extends VideoStream {
    private client: net.Socket;
    private host: string;

    constructor(filepath: string, host: string) {
        super(filepath);
        this.client = new net.Socket();
        this.host = host;
    }

    connect() {
        this.client.connect(this.port, this.host, () => {
            console.log('connected to server at ' + this.host + ':' + this.port);
        })
    }

}