import * as net from 'net';

import { PORT } from '../constants/Constants'

export default class VideoStream {
    protected port: number;
    protected filepath : string;

    constructor(filepath: string) {
        this.port = PORT;
        this.filepath = filepath;
    }

    
}