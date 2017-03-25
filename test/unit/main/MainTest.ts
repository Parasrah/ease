import * as Assert from "assert";

describe("Main", () => {
    describe("#fakeTest", () => {
        it("should pass", (done) => {
            Assert.equal(true, true);
            done();
        });
    });
});
