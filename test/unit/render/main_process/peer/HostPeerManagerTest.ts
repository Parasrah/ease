import { assert as Assert } from "chai";
import * as td from "testdouble";

import { HostPeerManager, IEnhancedPeer } from "../../../../../src/render/peer/HostPeerManager";

describe("HostPeerManager Unit Tests", function() {
    let subject: HostPeerManager;
    let clientID: string;
    let mockSignalData: any;
    let badClientIdList: string[];

    before(function() {
        clientID = "test-client-id";
        mockSignalData = Object.freeze({
            test: "This is mock signal data!",
        });

        badClientIdList = [];
        badClientIdList.push(clientID + "_changed");
        badClientIdList.push("$p3c14L-ch4r4ch74r5-*");
        badClientIdList.push(clientID.toUpperCase());
        Object.freeze(badClientIdList);
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

        it("Should signal peer if peer is present", function() {
            // Create the mocked peer
            const mockSignal = td.function();
            const mockPeer = {
                signal: mockSignal,
                clientID,
            };
            (subject as any).peers.push(mockPeer);

            // Push mock signal data to host peer manager
            (subject as any).receiveSignalData(clientID, mockSignalData);

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

            const mockedPeers = [];

            // Add some bad peers
            badClientIdList.map((value) => mockedPeers.push(createPeer(value)));

            // Insert the mocked peer at end of array
            mockedPeers.push(mockPeer);

            // Add mockedPeers to HostPeerManager peers
            (subject as any).peers.push(...mockedPeers);

            // Deliver signal data
            (subject as any).receiveSignalData(clientID, mockSignalData);

            // Verify signal data was delivered to peer
            td.verify(mockSignal(mockSignalData));
        });

        it("Should create a new peer if one doesn't already exist", function() {
            // Stub out HostPeerManager#createPeer
            const mockSetupPeer = td.function();
            (subject as any).setupPeer = mockSetupPeer;

            // Call HostPeerManager#receiveSignalData
            (subject as any).receiveSignalData(clientID, mockSignalData);

            // Verify that createPeer was called
            td.verify(mockSetupPeer(clientID, mockSignalData));
        });

        it("Should be capable of receiving `n` signalData", function() {
            // Create the mocked peer
            const mockSignal = td.function();
            const mockPeer = {
                signal: mockSignal,
                clientID,
            };
            (subject as any).peers.push(mockPeer);

            const mockSignalArray = [];
            for (let i = 0; i < 10; i++) {
                mockSignalArray.push(Object.assign({}, mockSignalData, {
                    id: i,
                }));
            }

            // Push mock signal data to host peer manager
            (subject as any).receiveSignalData(clientID, ...mockSignalArray);

            // Verify signal data was delivered to peer
            mockSignalArray.map((value) => td.verify(mockSignal(td.matchers.contains(value))));
        });

        /*********************** Helper Methods **************************/

        // Add some peers with different clientID's
        function createPeer(clientID: string) {
            return Object.freeze({
                clientID,
            });
        }

    });

    describe("#setupPeer", function() {
        let mockSignal;

        beforeEach(function() {
            mockSignal = td.function();

            // Mock out HostPeerManager#createPeer
            (subject as any).createPeer = td.when(td.function()()).thenReturn({
                on: td.function(),
                signal: mockSignal,
            });
        });

        it("Should add a new peer to array when called w/o signal data", function() {
            // Call setupPeer
            (subject as any).setupPeer(clientID);
            const peerList: IEnhancedPeer[] = (subject as any).peers;
            Assert.equal(peerList.length, 1, "Should have been a single peer added");
            Assert.equal(peerList[0].clientID, clientID, "Peer clientID should have `clientID`");
        });

        it("Should add a new peer to array and signal it when calling with signalData", function() {
            // Call setupPeer
            (subject as any).setupPeer(clientID, mockSignalData);

            // Verify peer creation
            const peerList: IEnhancedPeer[] = (subject as any).peers;
            Assert.equal(peerList.length, 1, "Should have been a single peer added");
            Assert.equal(peerList[0].clientID, clientID, "Peer clientID should have `clientID`");

            // Verify peer signaled
            td.verify(mockSignal(mockSignalData));
        });

        it("Should be capable of setting up peer with multiple instances of signal data", function() {
            const mockSignalArray = [];
            for (let i = 0; i < 10; i++) {
                mockSignalArray.push(Object.assign({}, mockSignalData, {
                    id: i,
                }));
            }

            // Call setupPeer
            (subject as any).setupPeer(clientID, ...mockSignalArray);

            // Verify peer creation
            const peerList: IEnhancedPeer[] = (subject as any).peers;
            Assert.equal(peerList.length, 1, "Should have been a single peer added");
            Assert.equal(peerList[0].clientID, clientID, "Peer clientID should have `clientID`");

            // Verify peer signaled
            mockSignalArray.map((value) => td.verify(mockSignal(td.matchers.contains(value))));
        });

    });

    describe("#watchPeer", function() {
        // Assert.fail("Not implemented");
    });

    describe("#removePeer", function() {
        // Assert.fail("Not implemented");
    });

});
