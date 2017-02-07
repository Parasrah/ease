import * as fs from 'fs';
import * as net from 'net';

import { PORT } from '../constants/Constants'

export default class VideoStream {
    private filepath : string;
    protected port: number;

    constructor(filepath: string) {
        this.filepath = filepath;
        this.port = PORT;
    }

    getStream() {
        return fs.createReadStream(this.filepath);
    }
}