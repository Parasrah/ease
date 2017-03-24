import { assert as Assert } from "chai";
import * as td from "testdouble";

import { HostPeerManager } from "../../../../../src/render/peer/HostPeerManager";

describe("HostPeerManager Unit Tests", function() {
    let subject: HostPeerManager;
    let clientID: string;

    before(function() {
        clientID = "test-client-id";
    });

    beforeEach(function() {
        subject = new HostPeerManager();
    });

    afterEach(function() {
        subject = null;
    });

    describe("#registerStream", function() {
        let stream;

        before(function() {
            stream = Object.freeze({
                test: "This is a stream!",
            });
        });

        it("Should set the stream of the subject without mutation", function() {
            subject.registerStream(stream);

            // Will have thrown exception at this point if stream is mutated

            // Manager should have stream
            Assert.equal((subject as any).stream, stream, "Stream should have been set properly");
        });

    });

    describe("#receiveSignalData", function() {
        let mockSignalData: any;

        before(function() {
            mockSignalData = Object.freeze({
                test: "This is mock signal data!",
            });
        });

        it("Should signal peer if peer is present", function() {
            // Create the mocked peer
            const mockSignal = td.function();
            const mockPeer = {
                signal: mockSignal,
                clientID,
            };
            (subject as any).peers.push(mockPeer);

            // Push mock signal data to host peer manager
            (subject as any).recieveSignalData(clientID, mockSignalData);

            // Verify signal data was delivered to peer
            td.verify(mockSignal(mockSignalData));
        });

        it("Should find peer among an array of peers and deliver signal data", function() {
             // Create the mocked peer
            const mockSignal = td.function();
            const mockPeer = {
                signal: mockSignal,
                clientID,
            };

            // Add some peers with different clientID's
            function createPeer(clientID: string) {
                return Object.freeze({
                    clientID,
                });
            }

            const mockedPeers = [];

            // Add some bad peers
            mockedPeers.push(createPeer(clientID + "_changed"));
            mockedPeers.push(createPeer("$p3c14L-ch4r4ch74r5-*"));
            mockedPeers.push(createPeer(clientID.toUpperCase()));

            // Insert the mocked peer at end of array
            mockedPeers.push(mockPeer);

            // Add mockedPeers to HostPeerManager peers
            (subject as any).peers.push(...mockedPeers);

            // Deliver signal data
            (subject as any).recieveSignalData(clientID, mockSignalData);

            // Verify signal data was delivered to peer
            td.verify(mockSignal(mockSignalData));
        });

    });

    describe("#createPeer", function() {
        Assert.fail("Not implemented");
    });

    describe("#watchPeer", function() {
        Assert.fail("Not implemented");
    });

    describe("#removePeer", function() {
        Assert.fail("Not implemented");
    });

});
