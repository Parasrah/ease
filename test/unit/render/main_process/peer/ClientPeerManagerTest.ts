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

        it("", function() {

        });

    });

    describe("#onStream", function() {

        it("", function() {

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
