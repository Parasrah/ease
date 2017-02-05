import * as SimplePeer from 'simple-peer'

export default class VideoStream {
    private filepath : string;
    private peer: SimplePeer.Instance;

    constructor(filepath: string, initiator: boolean) {
        this.filepath = filepath;
        this.peer = new SimplePeer(initiator);
    }
}