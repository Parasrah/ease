import * as net from 'net';

import VideoStream from './VideoStream';
import { LogCallback } from '../constants/CallbackDefinitions'

const HOST : string = 'localhost';

/**
 * Host to send and watch the video stream
 */
export default class VideoStreamHost extends VideoStream {
    private server: net.Server;

    constructor(filepath: string) {
        super(filepath)
        this.server = net.createServer((socket) => {

        });
    }

    host() {
        this.server.listen(this.port, HOST, () => {
            console.log('VideoStreamHost bound to: ' + HOST + ':' + this.port);

            this.server.on('connection', (socket) => {
                console.log('connection made to: ' + socket.address());
            })

            this.server.on('end', () => {
                console.log('connection terminated');
            });

            this.server.on('error', (err) => {
                console.log(err);
            });
        });
    }

}
