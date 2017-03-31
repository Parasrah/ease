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
    signaler: object;
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
            signaler: {},
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
        let stream;
        let cb;

        beforeEach(function() {
            stream = {
                name: "stream",
            };
            cb = td.function();
        });

        it("Should set stream", function() {
            (ClientPeerManager as any).prototype.resolveStream.call(subject, stream);
            Assert.equal(subject.stream, stream, "Should have set stream");
        });

        it("Should deliver stream async if callback exists", function(done) {
            subject.deliverStream = cb;
            (ClientPeerManager as any).prototype.resolveStream.call(subject, stream);
            td.verify(cb(), { ignoreExtraArgs: true, times: 0 });
            setTimeout(function() {
                td.verify(cb(stream), { times: 1 });
                done();
            }, 0);
        });

    });

    describe("#setupPeer", function() {
        let mockCreatePeer: td.TestDouble;
        let mockOn: td.TestDouble;
        let mockDispatch: td.TestDouble;
        let mockGetMessenger: td.TestDouble;
        let mockGetReceiver: td.TestDouble;
        let mockRenewMessenger: td.TestDouble;
        let mockRenewReceiver: td.TestDouble;
        let mockOnResponse: td.TestDouble;
        let mockPeer;

        beforeEach(function() {
            mockPeer = {
                name: "peer",
                signal() {},
            };

            // Setup mocks
            mockCreatePeer = mockMethod(subject, "createPeer");
            mockOn = mockMethod(mockPeer, "on");
            mockDispatch = mockMethod(subject.storeWrapper, "dispatch");
            mockGetMessenger = mockMethod(subject, "getMessenger");
            mockGetReceiver = mockMethod(subject, "getReceiver");
            mockOnResponse = mockMethod(subject.signaler, "onResponse");
            mockRenewMessenger = td.function();
            mockRenewReceiver = td.function();

            // Setup return values
            td.when(mockCreatePeer()).thenReturn(mockPeer);
            td.when(mockGetMessenger()).thenReturn({
                renewPeer: mockRenewMessenger,
            });
            td.when(mockGetReceiver()).thenReturn({
                renewPeer: mockRenewReceiver,
            });
        });

        it("Should assign new peer to peer", function() {
            (ClientPeerManager as any).prototype.setupPeer.call(subject);
            Assert.equal(subject.peer, mockPeer, "Should have assigned new peer");
        });

        it("Should setup peer listeners", function() {
            (ClientPeerManager as any).prototype.setupPeer.call(subject);
            td.verify(mockOn("stream"), { ignoreExtraArgs: true, times: 1 });
            td.verify(mockOn("signal"), { ignoreExtraArgs: true, times: 1 });
            td.verify(mockOn("close"), { ignoreExtraArgs: true, times: 1 });
        });

        it("Should renew peer for messenger and receiver", function() {
            (ClientPeerManager as any).prototype.setupPeer.call(subject);
            td.verify(mockRenewMessenger(mockPeer), { times: 1 });
            td.verify(mockRenewReceiver(mockPeer), { times: 1 });
        });

        it("Should setup listener for signaler", function() {
            (ClientPeerManager as any).prototype.setupPeer.call(subject);
            td.verify(mockOnResponse(), { ignoreExtraArgs: true, times: 1 });
        });

    });

    // Helper Functions

    function mockMethod(target: object, functionName: string): td.TestDouble {
        const testDouble = td.function("." + functionName);
        target[functionName] = testDouble;

        return testDouble;
    }
});
