import * as net from 'net';
import * as fs from 'fs';

import VideoStream from './VideoStream';
import { LogCallback } from '../constants/CallbackDefinitions'

const HOST : string = '127.0.0.1';

/**
 * Host to send and watch the video stream
 */
export default class VideoStreamHost extends VideoStream {
    private server: net.Server;

    constructor(filepath: string) {
        super(filepath);
        this.filepath = filepath;
        this.server = this.getServer();
    }

    public listen() {
        if (!this.server) {
            throw "Cannot setup server before initialized";
        }
        this.server.on('error', (err) => {
            throw err;
        });
        this.server.on('close', () => {
            console.log('Server shutdown');
        });
        this.server.listen(this.port, HOST, () => {
            console.log('server bound');
        });
    }

    private getStream() {
        return fs.createReadStream(this.filepath);
    }

    private getServer() {
        return net.createServer((client) => {
            client.on('end', () => {
                console.log('client disconnected');
            })

            let stream = this.getStream();
            stream.on('open', (fd) => {
                stream.pipe(client);
            });
        });
    }
}
