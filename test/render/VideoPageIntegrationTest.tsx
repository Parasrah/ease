import { expect as Expect, assert as Assert, should as Should } from "chai";
import * as ReactTestUtils from "react-addons-test-utils";
import * as React from "react";
import { app } from "electron";

import { VideoClientPage } from "../../src/ts/render/video/VideoClientPage";
import { VideoHostPage } from "../../src/ts/render/video/VideoHostPage";

const TEST_DATA = __dirname + "/../../../testData";
const VIDEO_SOURCE = TEST_DATA + "/small.mp4";
const VIDEO_EXPECTED_SOURCE = "file:///home/bradpf/Projects/ease/testData/small.mp4";
const SIGNAL_SERVER = "https://bread-signal.mybluemix.net/";

describe("VideoClientPage Logic", () => {
    let client: VideoClientPage;
    let host: VideoHostPage;
    let hostID = 234234;
    let clientID = 3429;

    beforeEach(() => {
        host = ReactTestUtils.renderIntoDocument(<VideoHostPage id="myHostID" videoSource={VIDEO_SOURCE} signalHost={SIGNAL_SERVER} />) as VideoHostPage;
        client = ReactTestUtils.renderIntoDocument(<VideoClientPage hostID="myHostID" id="myClientID" signalHost={SIGNAL_SERVER} videoSource="" />) as VideoClientPage;
    });

    afterEach(() => {
        host = null;
        client = null;
    });

    describe("#testHostSource", () => {
        it("Should have a host with a valid video src", function(done) {
            // Wait for render to finish
            host.registerListener(function() {
                Assert.equal(host.getVideo().src, VIDEO_EXPECTED_SOURCE);
                done();
            });
        });
    });

    describe("#testClientSource", () => {
        it("Should have a client with a valid video src", function(done) {
            done(Error("Not implemented"));
        });
    });

});
