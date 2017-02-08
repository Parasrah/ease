import VideoStreamHost from '../../src/ts/render/video/VideoStreamHost';

import { expect as Expect, assert as Assert, should as Should } from 'chai';
import * as ReactTestUtils from 'react-addons-test-utils';

const TEST_DATA = __dirname + '/../../../testData';
const ROOM : string = 'testingRoom';
const PASSWORD : string = 'testing-password';

describe('VideoStreamHost', () => {
    let subject;

    beforeEach(() => {

    });

    afterEach(() => {

    });

    describe('#fakeTest', () => {
        it('should pass', (done) => {
            Assert.equal(true, true);
            done();
        });
    });
    
});
