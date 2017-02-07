import * as net from 'net';
import * as fs from 'fs';

import VideoStream from './VideoStream';

export default class VideoStreamClient extends VideoStream {
    private client: net.Socket;
    private host: string;
    private movie: fs.WriteStream;

    constructor(filepath: string, host: string) {
        super(filepath);
        this.client = new net.Socket();
        this.host = host;
        this.movie = fs.createWriteStream(this.filepath);
        this.setupListener();
    }

    public connect() {
        this.client.connect(this.port, this.host, () => {
            console.log('connected to server at ' + this.host + ':' + this.port);
        })
    }

    private setupListener() {
        this.client.on('data', (data) => {
            this.movie.write(data);
        });

        this.client.on('error', (err) => {
            throw(err);
        });

        this.client.on('close', (hadErr) => {
            console.log('connection terminated');
        })
    }

}