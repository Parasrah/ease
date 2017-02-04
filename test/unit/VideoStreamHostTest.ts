import VideoStreamHost from '../../src/ts/video/VideoStreamHost';

import { Torrent } from 'webtorrent';

const TEST_DIR = '../test';

describe('VideoStreamHost', () => {
    let subject = new VideoStreamHost(TEST_DIR + '/data/small.mp4');

    describe('seed', () => {
        subject.seed((torrent: Torrent) => {
            
        })
    });
});
