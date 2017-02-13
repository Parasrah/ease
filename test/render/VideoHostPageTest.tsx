import { assert as Assert } from "chai";
import * as TestUtils from "react-addons-test-utils";
import { spyOnComponentMethod, stubComponentMethod } from "sinon-spy-react";
import * as React from "react";
import { app } from "electron";

import { VideoHostPage } from "../../src/ts/render/video/VideoHostPage";

import {AppContainer} from "../../src/ts/render/AppContainer";

const TEST_DATA = __dirname + "/../../../test/data";
const VIDEO_SOURCE = TEST_DATA + "/small.mp4";
const EXPECTED_SOURCE_FILE = "file:///home/bradpf/Projects/ease/test/data/small.mp4";

describe("VideoClientPage Logic", () => {
    let host: VideoHostPage;

    beforeEach(() => {

    });

    afterEach(() => {
        host = null;
    });

    describe("#testSourceFile", () => {
        it("Should have a host with a valid video src", function(done) {
            const component = TestUtils.renderIntoDocument(<VideoHostPage videoSource={VIDEO_SOURCE} signalHost="" id="testHostMount" />) as VideoHostPage;

            // Assert video src
            Assert.equal(component.getVideo().src, EXPECTED_SOURCE_FILE, "Incorrect video source");
            done();
        });
    });

    describe("#constructor", () => {
        it("", function(done) {
            done(Error("Not implemented"));
        });
    });

});
