import { assert as Assert } from "chai";
import * as TestUtils from "react-addons-test-utils";
import { spyOnComponentMethod, stubComponentMethod } from "sinon-spy-react";
import * as React from "react";
import { app } from "electron";

import { VideoHostPage } from "../../src/ts/render/video/VideoHostPage";

const TEST_DATA = __dirname + "/../../../testData";
const VIDEO_SOURCE = TEST_DATA + "/small.mp4";

describe("VideoClientPage Logic", () => {
    let host: VideoHostPage;

    beforeEach(() => {

    });

    afterEach(() => {
        host = null;
    });

    describe("#testHostMount", () => {
        it("Should have a host with a valid video src", function(done) {
            const stub = stubComponentMethod(VideoHostPage, "connect").returns({});
            const componentDidMountSpy = spyOnComponentMethod(VideoHostPage, "componentDidMount");
            const component = TestUtils.renderIntoDocument(<VideoHostPage videoSource={VIDEO_SOURCE} signalHost="" id="testHostMount" />) as VideoHostPage;

            // Assert componentDidMount() called once
            Assert.isTrue(componentDidMountSpy.calledOnce);

            // Assert video src
            Assert.equal(component.getVideo().src, VIDEO_SOURCE, "Incorrect video source");

            stub.restore();
        });
    });

    describe("#constructor", () => {
        it("", function(done) {
            done(Error("Not implemented"));
        });
    });

});
