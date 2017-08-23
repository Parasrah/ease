import { assert as Assert } from "chai";
import { AbstractPeerManager } from "../../../../../src/render/peer/AbstractPeerManager";

describe("AbstractPeerManager", function() {
    let signaler: any;
    let messenger: any;
    let receiver: any;
    let subject: AbstractPeerManager<any, any, any>;

    before(function() {
        signaler = Object.freeze({
            name: "signaler",
        });
        messenger = Object.freeze({
            name: "messenger",
        });
        receiver = Object.freeze({
            name: "receiver",
        });
    });

    beforeEach(function() {
        subject = new (AbstractPeerManager as any)(receiver, messenger, signaler);
    });

    describe("#constructor", function() {

        it("Should set receiver, messenger and signaler", function() {
            Assert.equal((subject as any).signaler, signaler, "Signaler should have been set");
            Assert.equal((subject as any).messenger, messenger, "Messenger should have been set");
            Assert.equal((subject as any).receiver, receiver, "Receiver should have been set");
        });

    });

    describe("#getReceiver", function() {

        it("Should get receiver", function() {
            Assert.equal(subject.getReceiver(), receiver, "Should have gotten receiver");
        });

    });

    describe("#getMessenger", function() {

        it("Should get messenger", function() {
            Assert.equal(subject.getMessenger(), messenger, "Should have gotten messenger");
        });

    });

});
