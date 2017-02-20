import * as Assert from "assert";

import { app, BrowserWindow } from "electron";

import Main from "../../src/main/Main";

describe("Main", () => {
    describe("#fakeTest", () => {
        it("should pass", (done) => {
            Assert.equal(true, true);
            done();
        });
    });
});
