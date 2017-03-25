import { assert as Assert } from "chai";
import * as td from "testdouble";

import { HostPeerManager, IEnhancedPeer } from "../../../../../src/render/peer/HostPeerManager";

describe("HostPeerManager Unit Tests", function() {
    let subject: HostPeerManager;
    let clientID: string;
    let mockSignalData: any;
    let badClientIdList: string[];
    let mockSignalArray: any[];

    before(function() {
        clientID = "test-client-id";
        mockSignalData = Object.freeze({
            test: "This is mock signal data!",
        });

        mockSignalArray = [];
        for (let i = 0; i < 10; i++) {
            mockSignalArray.push(Object.assign({}, mockSignalData, {
                id: i,
            }));
        }

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

            // Push mock signal data to host peer manager
            (subject as any).receiveSignalData(clientID, ...mockSignalArray);

            // Verify signal data was delivered to peer
            mockSignalArray.map((value) => td.verify(mockSignal(td.matchers.contains(value))));
        });

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
            validatePeers((subject as any).peers);
        });

        it("Should add a new peer to array and signal it when calling with signalData", function() {
            // Call setupPeer
            (subject as any).setupPeer(clientID, mockSignalData);

            // Verify peer creation
            validatePeers((subject as any).peers);

            // Verify peer signaled
            td.verify(mockSignal(mockSignalData));
        });

        it("Should be capable of setting up peer with multiple instances of signal data", function() {
            // Call setupPeer
            (subject as any).setupPeer(clientID, ...mockSignalArray);

            // Verify peer creation
            validatePeers((subject as any).peers);

            // Verify peer signaled
            mockSignalArray.map((value) => td.verify(mockSignal(td.matchers.contains(value))));
        });

        /*********************** Helper Methods **************************/

        /**
         * Ensure that only one peer exists, and that it contains the correct clientID
         */
        function validatePeers(peers: IEnhancedPeer[]) {
            Assert.equal(peers.length, 1, "Should have been a single peer added");
            Assert.equal(peers[0].clientID, clientID, "Peer clientID should have `clientID`");
        }

    });

    describe("#watchPeer", function() {

        it("Should setup peer listeners on peer", function() {
            // Create stubs
            const stubOn = td.function();
            const mockPeer = Object.freeze({
                on: stubOn,
            });

            // Call HostPeerManager#watchPeer
            (subject as any).watchPeer(mockPeer);

            // Verify invocations
            td.verify(stubOn("connect"), { times: 1, ignoreExtraArgs: true });
            td.verify(stubOn("signal"), { times: 1, ignoreExtraArgs: true });
            td.verify(stubOn("close"), { times: 1, ignoreExtraArgs: true });
        });

    });

    describe("#removePeer", function() {
        let targetPeer;
        let stubDeregisterPeer;
        let stubDispatch;

        beforeEach(function() {
            targetPeer = createTargetPeer();

            stubDeregisterPeer = td.function();
            stubDispatch = td.function();

            (subject as any).getMessenger = td.when(td.function()()).thenReturn({ deregisterPeer: stubDeregisterPeer });
            (subject as any).storeWrapper = {
                dispatch: stubDispatch,
            };
        });

        it("Should deregister peer from messenger", function() {
            // Setup peer array
            (subject as any).peers = [ targetPeer ];

            // Call HostPeerManager#removePeer
            (subject as any).removePeer(targetPeer);

            // Verify deregisterPeer invocation
            td.verify(stubDeregisterPeer(clientID), { times: 1 });
        });

        it("Should remove peer from peers array when length 1", function() {
            // Setup peer array
            (subject as any).peers = [ targetPeer ];

            // Call HostPeerManager#removePeer
            (subject as any).removePeer(targetPeer);

            // Verify peer was removed
            Assert.equal((subject as any).peers.length, 0, "Should have been zero peers remaining");
            (subject as any).peers.map((peer) => Assert.notEqual(peer.clientID, clientID, "Peer should have been removed"));
        });

        it("Should remove peer from peers array when length n", function() {
            // Setup peer array
            (subject as any).peers = createPeerArray();

            // Call HostPeerManager#removePeer
            (subject as any).removePeer(targetPeer);

            // Verify peer was removed
            Assert.equal((subject as any).peers.length, peerArrayLength() - 1, "Should have been one less peer in array");
            (subject as any).peers.map((peer) => Assert.notEqual(peer.clientID, clientID, "Peer should have been removed"));
        });

        it("Should remove peer from store", function() {
            // Setup peer array
            (subject as any).peers = [ targetPeer ];

            // Call HostPeerManager#removePeer
            (subject as any).removePeer(targetPeer);

            // Verify deregisterPeer invocation
            td.verify(stubDispatch(), { times: 1, ignoreExtraArgs: true });
        });

    });

    /*********************** Helper Methods **************************/

    // Add some peers with different clientID's
    function createPeer(clientID: string) {
        return Object.freeze({
            clientID,
            removeAllListeners: td.function(),
        });
    }

    function createTargetPeer() {
        return createPeer(clientID);
    }

    /**
     * Returns array of peers, one of which contains clientID: clientID
     */
    function createPeerArray() {
        const mockPeerArray = badClientIdList.map((clientID) => createPeer(clientID));
        mockPeerArray.push(createTargetPeer());

        return mockPeerArray;
    }

    /**
     * Returns the length of the peer array generated by {@link #createPeerArray}
     */
    function peerArrayLength() {
        return badClientIdList.length + 1;
    }

});
