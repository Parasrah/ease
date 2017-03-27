import { assert as Assert } from "chai";
import * as td from "testdouble";

import { ClientPeerManager } from "../../../../../src/render/peer/ClientPeerManager";

describe("Test ClientPeerManager", function() {
    let peer;
    let subject;
    let mockDispatch;
    let mockReconnect;
    let mockSetupPeer;

    beforeEach(function() {
        mockDispatch = td.function();
        mockReconnect = td.function();
        mockSetupPeer = td.function();
        peer = {
            connected: true,
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
            // TODO
            ClientPeerManager.prototype.reconnect.call(subject);
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