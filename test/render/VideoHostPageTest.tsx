import { assert as Assert } from "chai";
import * as TestUtils from "react-addons-test-utils";
import { spyOnComponentMethod, stubComponentMethod } from "sinon-spy-react";
import * as React from "react";
import { app } from "electron";

import { VideoHostPage } from "../../src/ts/render/video/VideoHostPage";

import {AppContainer} from "../../src/ts/render/AppContainer";

const TEST_DATA = __dirname + "/../../../test/data";
const VIDEO_SOURCE = TEST_DATA + "/small.mp4";

const EXPECTED_SOURCE_FILE = "file://" + __dirname + "/ease/test/data/small.mp4";
const EXPECTED_POSTER = "file://" + __dirname + "/ease/src/data/heart.gif";

describe("VideoClientPage Logic", () => {

    beforeEach(() => {

    });

    afterEach(() => {

    });

    describe("#dummyTest", function() {
        it("Should pass", function(done) {
            done();
        });
    });

});
