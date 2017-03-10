/* tslint:disable:only-arrow-functions */
import { assert } from "chai";
import { Store } from "redux";

import { addClientSignalDataAction, addHostSignalDataAction } from "../../../../src/render/actions/HostPeerActions";
import { IState } from "../../../../src/render/redux/State";
import { StoreWrapper } from "../../../../src/render/redux/Store";

describe("Unit testing host peer reducer", function() {
    let store: Store<IState>;
    let initialState: IState;
    const CLIENT_ID = "this-is-client-id";
    const SIGNAL_DATA = "this-is-signal-data";
    const DEFAULT_CLIENT_SIGNAL = "default-client-signal-data";
    const DEFAULT_HOST_SIGNAL = "default-host-signal-data";

    before(function() {
        console.log("Running");
        const storeWrapper = StoreWrapper.getInstance();
        const state = storeWrapper.getState();
        Object.assign(state.hostPeerState, {
            hostPeers: [
                {
                    clientID: CLIENT_ID,
                    clientSignalData: [
                        DEFAULT_CLIENT_SIGNAL,
                    ],
                    hostSignalData: [
                        DEFAULT_HOST_SIGNAL,
                    ],
                },
            ],
        });
        initialState = state;
    });

    beforeEach(function() {
        store = StoreWrapper.configureStore(JSON.parse(JSON.stringify(initialState)), false);
    });

    describe("#addClientSignalData", function() {
        it("Should successfully add client signal data", function() {
            const action = addClientSignalDataAction(CLIENT_ID, SIGNAL_DATA);
            store.dispatch(action);

            const hostPeerState = store.getState().hostPeerState;
            assert.equal(hostPeerState.hostPeers.length, 1, "Expected single host peer");
            assert.equal(hostPeerState.hostPeers[0].clientSignalData.length, 2, "Expected two instances of signal data");
            assert.equal(hostPeerState.hostPeers[0].clientSignalData[0], DEFAULT_CLIENT_SIGNAL, "Default signal data should persist");
            assert.equal(hostPeerState.hostPeers[0].clientSignalData[1], SIGNAL_DATA, "Signal data should have been added");
            assert.equal(hostPeerState.hostPeers[0].hostSignalData.length, 1, "Expected host signal data to persist");
            assert.equal(hostPeerState.hostPeers[0].hostSignalData[0], DEFAULT_HOST_SIGNAL, "Expected host signal data to persist");
            assert.equal(hostPeerState.hostPeers[0].clientID, CLIENT_ID, "Client ID should persist");
        });
    });

    describe("#addHostSignalDataAction", function() {
        it("Should successfully add host signal data", function() {
            const action = addHostSignalDataAction(CLIENT_ID, SIGNAL_DATA);
            store.dispatch(action);

            const hostPeerState = store.getState().hostPeerState;
            assert.equal(hostPeerState.hostPeers.length, 1, "Expected single host peer");
            assert.equal(hostPeerState.hostPeers[0].clientSignalData.length, 1, "Expected single instance of client signal data");
            assert.equal(hostPeerState.hostPeers[0].clientSignalData[0], DEFAULT_CLIENT_SIGNAL, "Default client signal data should persist");
            assert.equal(hostPeerState.hostPeers[0].hostSignalData.length, 2, "Expected two instances of host signal data");
            assert.equal(hostPeerState.hostPeers[0].hostSignalData[0], DEFAULT_HOST_SIGNAL, "Expected host signal data to persist");
            assert.equal(hostPeerState.hostPeers[0].hostSignalData[1], SIGNAL_DATA, "Signal data should have been added");
            assert.equal(hostPeerState.hostPeers[0].clientID, CLIENT_ID, "Client ID should persist");
        });
    });

});
