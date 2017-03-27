import { assert as Assert } from "chai";
import * as td from "testdouble";

import { ClientPeerManager } from "../../../../../src/render/peer/ClientPeerManager";

describe("ClientPeerManager", function() {
    let peer;
    let subject;
    let mockDispatch;
    let mockReconnect;
    let mockSetupPeer;
    let mockRemoveAllListeners;
    let mockDestroy;

    beforeEach(function() {
        mockDispatch = td.function();
        mockReconnect = td.function();
        mockSetupPeer = td.function();
        mockRemoveAllListeners = td.function();
        mockDestroy = td.function();

        peer = {
            connected: true,
            removeAllListeners: mockRemoveAllListeners,
            destroy: mockDestroy,
        };
        subject = {
            peer,
            storeWrapper: {
                dispatch: mockDispatch,
            },
        };
    });

    describe("#reconnect", function() {

        beforeEach(function() {
            subject.setupPeer = mockSetupPeer;
        });

        it("Should throw error if there is no `connected` property on peer", function() {
            peer.connected = undefined;
            Assert.throw(
                ClientPeerManager.prototype.reconnect.call(subject),
                Error,
            );
        });

        it("Should set new client-id", function() {
            ClientPeerManager.prototype.reconnect.call(subject);
            td.verify(mockDispatch(), { ignoreExtraArgs: true, times: 1 });
        });

        it("Should remove all listeners from existing peer", function() {
            ClientPeerManager.prototype.reconnect.call(subject);
            td.verify(mockRemoveAllListeners(), { times: 1 });
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

});