import * as SimplePeer from 'simple-peer';
import * as SocketIO from 'socket.io';

import { SIGNAL_URL } from '../constants/Constants'

export default class VideoStream {
    private filepath : string;
    protected peer: SimplePeer.Instance;
    protected socket : SocketIO.Server;

    constructor(filepath: string, initiator: boolean) {
        this.filepath = filepath;
        this.peer = new SimplePeer(initiator);
        this.socket = SocketIO(SIGNAL_URL);
    }
}