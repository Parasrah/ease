import VideoStream from './VideoStream';
import { LogCallback } from '../constants/CallbackDefinitions'

/**
 * Host to send and watch the video stream
 */
export default class VideoStreamHost extends VideoStream {

    constructor(filepath: string) {
        super(filepath, true)
        this.socket.on
    }

    host(room: string, password: string) {
        this.socket.emit('host', [room, password]);
    }

    public log(callback: LogCallback) {
        this.socket.on('connection', (socket) => {
            socket.on('log', (...args: any[]) => {
                let log : string = '';
                for (let arg in args) {
                    log.concat(arg + '\n');
                }
                callback(log);
            });
        });
    }
}
