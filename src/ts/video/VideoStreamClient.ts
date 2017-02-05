

import VideoStream from './VideoStream';

export default class VideoStreamClient extends VideoStream {

    constructor(filepath: string) {
        super(filepath, false);
    }

}