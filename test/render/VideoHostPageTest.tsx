/* tslint:disable:only-arrow-functions */
import { assert as Assert } from "chai";
import { app } from "electron";
import * as React from "react";
import * as TestUtils from "react-addons-test-utils";
import { spyOnComponentMethod, stubComponentMethod } from "sinon-spy-react";

const TEST_DATA = __dirname + "/../../../test/data";
const VIDEO_SOURCE = TEST_DATA + "/small.mp4";

const EXPECTED_SOURCE_FILE = "file://" + __dirname + "/ease/test/data/small.mp4";
const EXPECTED_POSTER = "file://" + __dirname + "/ease/src/data/heart.gif";

describe("VideoClientPage Logic", () => {

    beforeEach(() => {
        "TODO";
    });

    afterEach(() => {
        "TODO";
    });

    describe("#dummyTest", function() {
        it("Should pass", function(done) {
            done();
        });
    });

});
