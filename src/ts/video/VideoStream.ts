import * as net from 'net';

import { PORT } from '../constants/Constants'

export default class VideoStream {
    protected port: number;

    constructor() {
        this.port = PORT;
    }

    
}