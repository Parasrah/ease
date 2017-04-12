/* tslint:disable:only-arrow-functions */
import { assert } from "chai";
import { Store } from "redux";

import { addClientSignalDataAction, addHostSignalDataAction, clearClientSignalDataAction, clearHostSignalDataAction, createPeerAction, removePeerAction, setPeerStatusAction } from "../../../../../src/render/actions/HostPeerActions";
import { IState } from "../../../../../src/render/redux/State";
import { StoreWrapper } from "../../../../../src/render/redux/Store";

describe("HostPeerReducer", function() {
    let store: Store<IState>;
    let initialState: IState;
    const CLIENT_IDS = [
        "first-client-id",
        "second-client-id",
        "third-client-id",
    ];
    const SIGNAL_DATA = "this-is-signal-data";
    const DEFAULT_CLIENT_SIGNAL = "default-client-signal-data";
    const DEFAULT_HOST_SIGNAL = "default-host-signal-data";

    before(function() {
        const storeWrapper = StoreWrapper.getInstance();
        const state = storeWrapper.getState();
        Object.assign(state.hostPeerState, {
            hostPeers: CLIENT_IDS.map((clientID) => {
                return {
                    clientID,
                    hostSignalData: [ DEFAULT_HOST_SIGNAL ],
                    clientSignalData: [ DEFAULT_CLIENT_SIGNAL ],
                    peerStatus: false,
                };
            }),
        });
        initialState = state;
    });

    beforeEach(function() {
        store = StoreWrapper.configureStore(JSON.parse(JSON.stringify(initialState)), false);
    });

    describe("#addClientSignalData", function() {
        it("Should successfully add client signal data", function() {
            const action = addClientSignalDataAction(CLIENT_IDS[1], SIGNAL_DATA);
            store.dispatch(action);

            const hostPeers = store.getState().hostPeerState.hostPeers;

            for (let i = 0; i < hostPeers.length; i++) {
                assert.equal(hostPeers[i].peerStatus, false, "Expected status to be false");

                if (i === 1) {
                    continue;
                }
                assert.equal(hostPeers[i].clientID, CLIENT_IDS[i], "Expected original client id's to persist");
                assert.equal(hostPeers[i].peerStatus, false, "Expected status to be false");
                assert.equal(hostPeers[i].hostSignalData.length, 1, "Expected single instance of host signal data for orignal peers");
                assert.equal(hostPeers[i].clientSignalData.length, 1, "Expected single instance of client signal data for orignal peers");
                assert.equal(hostPeers[i].hostSignalData[0], DEFAULT_HOST_SIGNAL, "Expected original signal data to persist");
                assert.equal(hostPeers[i].clientSignalData[0], DEFAULT_CLIENT_SIGNAL, "Expected original signal data to persist");
            }

            assert.equal(hostPeers.length, 3, "Expected three host peers");
            assert.equal(hostPeers[1].clientSignalData.length, 2, "Expected two instances of signal data");
            assert.equal(hostPeers[1].clientSignalData[0], DEFAULT_CLIENT_SIGNAL, "Default signal data should persist");
            assert.equal(hostPeers[1].clientSignalData[1], SIGNAL_DATA, "Signal data should have been added");
            assert.equal(hostPeers[1].hostSignalData.length, 1, "Expected host signal data to persist");
            assert.equal(hostPeers[1].hostSignalData[0], DEFAULT_HOST_SIGNAL, "Expected host signal data to persist");
            assert.equal(hostPeers[1].clientID, CLIENT_IDS[1], "Client ID should persist");
        });
    });

    describe("#addHostSignalDataAction", function() {
        it("Should successfully add host signal data", function() {
            const action = addHostSignalDataAction(CLIENT_IDS[1], SIGNAL_DATA);
            store.dispatch(action);

            const hostPeers = store.getState().hostPeerState.hostPeers;

            for (let i = 0; i < hostPeers.length; i++) {
                assert.equal(hostPeers[i].peerStatus, false, "Expected status to be false");

                if (i === 1) {
                    continue;
                }
                assert.equal(hostPeers[i].clientID, CLIENT_IDS[i], "Expected original client id's to persist");
                assert.equal(hostPeers[i].peerStatus, false, "Expected status to be false");
                assert.equal(hostPeers[i].hostSignalData.length, 1, "Expected single instance of host signal data for orignal peers");
                assert.equal(hostPeers[i].clientSignalData.length, 1, "Expected single instance of client signal data for orignal peers");
                assert.equal(hostPeers[i].hostSignalData[0], DEFAULT_HOST_SIGNAL, "Expected original signal data to persist");
                assert.equal(hostPeers[i].clientSignalData[0], DEFAULT_CLIENT_SIGNAL, "Expected original signal data to persist");
            }

            assert.equal(hostPeers.length, 3, "Expected three host peers");
            assert.equal(hostPeers[1].clientSignalData.length, 1, "Expected single instance of client signal data");
            assert.equal(hostPeers[1].clientSignalData[0], DEFAULT_CLIENT_SIGNAL, "Default client signal data should persist");
            assert.equal(hostPeers[1].hostSignalData.length, 2, "Expected two instances of host signal data");
            assert.equal(hostPeers[1].hostSignalData[0], DEFAULT_HOST_SIGNAL, "Expected host signal data to persist");
            assert.equal(hostPeers[1].hostSignalData[1], SIGNAL_DATA, "Signal data should have been added");
            assert.equal(hostPeers[1].clientID, CLIENT_IDS[1], "Client ID should persist");
        });
    });

    describe("#createPeerAction", function() {
        it("Should successfully create a new peer with no signal data", function() {
            const newClientID = "my-new-client-id";
            const action = createPeerAction(newClientID);
            store.dispatch(action);

            const hostPeers = store.getState().hostPeerState.hostPeers;

            assert.equal(hostPeers.length, 4, "Expected four host peers");
            assert.equal(hostPeers[3].clientID, newClientID, "Expected client ID to be set");
            assert.equal(hostPeers[3].clientSignalData.length, 0, "Expected empty array for client signal data");
            assert.equal(hostPeers[3].hostSignalData.length, 0, "Expected empty array for host signal data");

            for (let i = 0; i < CLIENT_IDS.length; i++) {
                assert.equal(hostPeers[i].clientID, CLIENT_IDS[i], "Expected original client id's to persist");
                assert.equal(hostPeers[i].peerStatus, false, "Expected status to be false");
                assert.equal(hostPeers[i].hostSignalData.length, 1, "Expected single instance of host signal data for orignal peers");
                assert.equal(hostPeers[i].clientSignalData.length, 1, "Expected single instance of client signal data for orignal peers");
                assert.equal(hostPeers[i].hostSignalData[0], DEFAULT_HOST_SIGNAL, "Expected original signal data to persist");
                assert.equal(hostPeers[i].clientSignalData[0], DEFAULT_CLIENT_SIGNAL, "Expected original signal data to persist");
            }
        });
    });

    describe("#clearClientSignalData", function() {
        it("Should remove client signal data from specified peer", function() {
            const action = clearClientSignalDataAction(CLIENT_IDS[1]);
            store.dispatch(action);

            const hostPeers = store.getState().hostPeerState.hostPeers;

            for (let i = 0; i < CLIENT_IDS.length; i++) {
                assert.equal(hostPeers[i].clientID, CLIENT_IDS[i], "Expected original client id's to persist");
                assert.equal(hostPeers[i].hostSignalData.length, 1, "Expected single instance of host signal data for orignal peers");
                assert.equal(hostPeers[i].hostSignalData[0], DEFAULT_HOST_SIGNAL, "Expected original signal data to persist");
                assert.equal(hostPeers[i].peerStatus, false, "Expected status to be false");
                if (i === 1) {
                    assert.equal(hostPeers[i].clientSignalData.length, 0, "Expected no signal data present");
                }
                else {
                    assert.equal(hostPeers[i].clientSignalData.length, 1, "Expected single instance of client signal data for orignal peers");
                    assert.equal(hostPeers[i].clientSignalData[0], DEFAULT_CLIENT_SIGNAL, "Expected original signal data to persist");
                }
            }
        });
    });

    describe("#clearHostSignalData", function() {
        it("Should remove host signal data from specified peer", function() {
            const action = clearHostSignalDataAction(CLIENT_IDS[1]);
            store.dispatch(action);

            const hostPeers = store.getState().hostPeerState.hostPeers;

            for (let i = 0; i < CLIENT_IDS.length; i++) {
                assert.equal(hostPeers[i].clientID, CLIENT_IDS[i], "Expected original client id's to persist");
                assert.equal(hostPeers[i].clientSignalData.length, 1, "Expected single instance of client signal data for orignal peers");
                assert.equal(hostPeers[i].clientSignalData[0], DEFAULT_CLIENT_SIGNAL, "Expected original signal data to persist");
                assert.equal(hostPeers[i].peerStatus, false, "Expected status to be false");
                if (i === 1) {
                    assert.equal(hostPeers[i].hostSignalData.length, 0, "Expected no signal data present");
                }
                else {
                    assert.equal(hostPeers[i].hostSignalData.length, 1, "Expected single instance of host signal data for orignal peers");
                    assert.equal(hostPeers[i].hostSignalData[0], DEFAULT_HOST_SIGNAL, "Expected original signal data to persist");
                }
            }
        });
    });

    describe("#setPeerStatusAction", function() {

        it("Should set the status of specified peer to true", function() {
            const action = setPeerStatusAction(CLIENT_IDS[1], true);
            store.dispatch(action);

            const hostPeers = store.getState().hostPeerState.hostPeers;

            for (let i = 0; i < CLIENT_IDS.length; i++) {
                assert.equal(hostPeers[i].clientID, CLIENT_IDS[i], "Expected original client id's to persist");
                assert.equal(hostPeers[i].peerStatus, (i === 1), "Expected status to be " + (i === 1));
                assert.equal(hostPeers[i].hostSignalData.length, 1, "Expected single instance of host signal data for orignal peers");
                assert.equal(hostPeers[i].clientSignalData.length, 1, "Expected single instance of client signal data for orignal peers");
                assert.equal(hostPeers[i].hostSignalData[0], DEFAULT_HOST_SIGNAL, "Expected original signal data to persist");
                assert.equal(hostPeers[i].clientSignalData[0], DEFAULT_CLIENT_SIGNAL, "Expected original signal data to persist");
            }
        });

        it("Should set status of specified peer to false and clear signal data", function() {
            let action = setPeerStatusAction(CLIENT_IDS[1], true);
            store.dispatch(action);

            action = setPeerStatusAction(CLIENT_IDS[1], false);
            store.dispatch(action);

            const hostPeers = store.getState().hostPeerState.hostPeers;

            for (let i = 0; i < CLIENT_IDS.length; i++) {
                assert.equal(hostPeers[i].clientID, CLIENT_IDS[i], "Expected original client id's to persist");
                assert.equal(hostPeers[i].peerStatus, false, "Expected status to be false");
                if (i === 1) {
                    assert.equal(hostPeers[i].hostSignalData.length, 0, "Expected empty host signal data");
                    assert.equal(hostPeers[i].clientSignalData.length, 0, "Expected empty client signal data");
                }
                else {
                    assert.equal(hostPeers[i].hostSignalData.length, 1, "Expected single instance of host signal data for orignal peers");
                    assert.equal(hostPeers[i].clientSignalData.length, 1, "Expected single instance of client signal data for orignal peers");
                    assert.equal(hostPeers[i].hostSignalData[0], DEFAULT_HOST_SIGNAL, "Expected original signal data to persist");
                    assert.equal(hostPeers[i].clientSignalData[0], DEFAULT_CLIENT_SIGNAL, "Expected original signal data to persist");
                }
            }
        });

    });

    describe("#removePeerAction", function() {
        it("Should remove the peer successfully", function() {
            const action = removePeerAction(CLIENT_IDS[1]);
            store.dispatch(action);

            const hostPeers = store.getState().hostPeerState.hostPeers;

            const clientIDArray = JSON.parse(JSON.stringify(CLIENT_IDS));
            clientIDArray.splice(1, 1);

            for (let i = 0; i < clientIDArray.length; i++) {
                assert.equal(hostPeers[i].clientID, clientIDArray[i], "Expected original client id's to persist");
                assert.equal(hostPeers[i].peerStatus, false, "Expected status to be false");
                assert.equal(hostPeers[i].hostSignalData.length, 1, "Expected single instance of host signal data for orignal peers");
                assert.equal(hostPeers[i].clientSignalData.length, 1, "Expected single instance of client signal data for orignal peers");
                assert.equal(hostPeers[i].hostSignalData[0], DEFAULT_HOST_SIGNAL, "Expected original signal data to persist");
                assert.equal(hostPeers[i].clientSignalData[0], DEFAULT_CLIENT_SIGNAL, "Expected original signal data to persist");
            }
        });
    });

});
