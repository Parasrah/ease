import VideoStreamHost from '../../src/ts/video/VideoStreamHost';

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

    });
    
});
