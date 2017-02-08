import VideoStreamHost from '../../src/ts/render/video/VideoStreamHost';

import * as Assert from 'assert';

const TEST_DATA = __dirname + '/../../../testData';
const ROOM : string = 'testingRoom';
const PASSWORD : string = 'testing-password';

describe('VideoStreamHost', () => {
    let subject : VideoStreamHost;

    beforeEach(() => {
        subject = new VideoStreamHost(TEST_DATA + '/small.mp4');
    });

    afterEach(() => {
        subject = null;
    });

    describe('#fakeTest', () => {
        it('should pass', (done) => {
            Assert.equal(true, true);
            done();
        });
    });
    
});
