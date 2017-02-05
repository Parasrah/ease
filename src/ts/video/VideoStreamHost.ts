import { webrtc } from 'webrtc';
import * as fs from 'fs';

export default class VideoStreamHost {
    filepath : string;
    movieStream : fs.ReadStream;

    constructor(filepath: string) {
        this.filepath = filepath;
        this.movieStream = null;
    }

    // TODO deal with errors
    getStream() {
        if (!this.movieStream) {
            this.movieStream = fs.createReadStream(this.filepath);
        }
        return this.movieStream;
    }
    
}