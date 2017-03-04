import { Action, ActionType } from "../actions/Action";
import { HostPeerAction, IAddSignalDataAction, IClearSignalDataAction, ICreatePeerAction, ISetPeerStatusAction } from "../actions/HostPeerActions";
import { IHostPeerState } from "../redux/State";
import { DataType } from "../utils/Definitions";
import { addSignalData } from "../utils/ReduxUtils";

const initialHostPeerState: IHostPeerState = {
    hostPeers: [],
};

const hostPeerState = (state: IHostPeerState = initialHostPeerState, action: Action<HostPeerAction>) => {
    const types = ActionType.hostPeerAction;

    switch (action.type) {
        case types.addClientSignalDataAction:
            return addSignalData(state, action as IAddSignalDataAction, DataType.CLIENT);

        case types.addHostSignalDataAction:
            return addSignalData(state, action as IAddSignalDataAction, DataType.HOST);

        case types.clearSignalDataAction:
            return Object.assign({}, state, {
                hostPeers: state.hostPeers.map((peer) => {
                    if (peer.clientID === (action as IClearSignalDataAction).id) {
                        Object.assign(peer, {
                            hostSignalData: [],
                        });
                    }
                    else {
                        return peer;
                    }
                }),
            });

        case types.createPeerAction:
            return Object.assign({}, state, {
                hostPeers: state.hostPeers.concat({
                    peerStatus: false,
                    clientID: (action as ICreatePeerAction).clientID,
                    clientSignalData: (action as ICreatePeerAction).signalData,
                    hostSignalData: [],
                }),
            });

        case types.setPeerStatusAction:
            return Object.assign({}, state, {
                hostPeers: state.hostPeers.map((peer) => {
                    if (peer.clientID === (action as ISetPeerStatusAction).clientID) {
                        return Object.assign(peer, {
                            peerStatus: (action as ISetPeerStatusAction).status,
                        });
                    }
                }),
            });

        default:
            return state;
    }
};

export default hostPeerState;
