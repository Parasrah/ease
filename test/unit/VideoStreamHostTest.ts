import VideoStreamHost from '../../src/ts/video/VideoStreamHost';

import * as Assert from 'assert';
import { Torrent } from 'webtorrent';

const TEST_DATA = __dirname + '/../../../testData';

describe('VideoStreamHost', () => {
    let subject = new VideoStreamHost(TEST_DATA + '/small.mp4');

    describe('seed', () => {
        it('should return a valid infohash', (done) => {
            subject.seed((torrent: Torrent) => {
                console.log(torrent.infoHash);
                Assert.notEqual(torrent.infoHash, null);
                done();
            });
        });
    });
});
