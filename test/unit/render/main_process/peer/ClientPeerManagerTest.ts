import { assert as Assert } from "chai";
import * as td from "testdouble";

import { ClientPeerManager } from "../../../../../src/render/peer/ClientPeerManager";

interface IPeer {
    connected: boolean;
    [x: string]: any;
}

interface ISubject {
    peer: IPeer;
    storeWrapper: object;
    [x: string]: any;
}

describe("ClientPeerManager", function() {
    let subject: ISubject;

    beforeEach(function() {
        const peer = {
            connected: true,
        };
        subject = {
            peer,
            storeWrapper: {},
        };
    });

    describe("#reconnect", function() {
        let mockSetupPeer;
        let mockDispatch;
        let mockDestroy;
        let mockRemoveAllListeners;
        let mockReconnect;

        beforeEach(function() {
            mockSetupPeer = mockMethod(subject, "setupPeer");
            mockDispatch = mockMethod(subject.storeWrapper, "dispatch");
            mockDestroy = mockMethod(subject.peer, "destroy");
            mockRemoveAllListeners = mockMethod(subject.peer, "removeAllListeners");
            mockReconnect = mockMethod(subject, "reconnect");
        });

        it("Should throw error if there is no `connected` property on peer", function() {
            subject.peer.connected = undefined;
            Assert.throw(
                function() { ClientPeerManager.prototype.reconnect.call(subject); },
                Error,
            );
        });

        it("Should set new client-id", function() {
            subject.peer = undefined;
            ClientPeerManager.prototype.reconnect.call(subject);
            td.verify(mockDispatch(), { ignoreExtraArgs: true, times: 1 });
        });

        it("Should remove all listeners from existing peer", function() {
            ClientPeerManager.prototype.reconnect.call(subject);
            td.verify(mockRemoveAllListeners(), { times: 1 });
        });

        it("Should update peer status", function() {
            ClientPeerManager.prototype.reconnect.call(subject);
            td.verify(mockDispatch(), { ignoreExtraArgs: true, times: 2 });
        });

        it("Should destroy peer if it is currently connected", function() {
            ClientPeerManager.prototype.reconnect.call(subject);
            td.verify(mockDestroy(mockSetupPeer));
        });

        it("Should call setupPeer if not currently connected", function() {
            subject.peer.connected = false;
            ClientPeerManager.prototype.reconnect.call(subject);
            td.verify(mockSetupPeer(), { times: 1 });
        });

        it("Should call setupPeer if no peer exists", function() {
            subject.peer = undefined;
            ClientPeerManager.prototype.reconnect.call(subject);
            td.verify(mockSetupPeer(), { times: 1 });
        });

    });

    describe("#getPeer", function() {

        it("Should return peer", function() {
            const returnedPeer = ClientPeerManager.prototype.getPeer.call(subject);
            Assert.equal(returnedPeer, subject.peer, "Should have returned peer");
        });

    });

    describe("#onStream", function() {
        let cb: td.TestDouble;

        beforeEach(function() {
            subject.stream = Object.freeze({
                name: "stream",
            });
            cb = td.function();
        });

        it("Should call callback async if stream exists", function(done) {
            ClientPeerManager.prototype.onStream.call(subject, cb);
            td.verify(cb(subject.stream), { times: 0 });
            setTimeout(function() {
                td.verify(cb(subject.stream), { times: 1 });
                done();
            }, 0);
        });

        it("Should set deliverStream if stream exists", function() {
            ClientPeerManager.prototype.onStream.call(subject, cb);
            Assert.equal(subject.deliverStream, cb, "Should have saved callback");
        });

        it("Should set deliverStream if stream does not exist", function() {
            subject.stream = false;
            ClientPeerManager.prototype.onStream.call(subject, cb);
            Assert.equal(subject.deliverStream, cb, "Should have saved callback");
        });

        it("Should not call callback if stream does not exist", function() {
            subject.stream = false;
            ClientPeerManager.prototype.onStream.call(subject, cb);
            td.verify(cb(subject.stream), { times: 0 });
        });

    });

    describe("#resolveStream", function() {

        it("", function() {

        });

    });

    describe("#setupPeer", function() {

        it("", function() {

        });

    });

    // Helper Functions

    function mockMethod(target: object, functionName: string): td.TestDouble {
        const testDouble = td.function("." + functionName);
        target[functionName] = testDouble;

        return testDouble;
    }
});
