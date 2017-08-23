import { ActionType } from "../actions/Action";
import { HostPeerAction, IAddSignalDataAction, IClearClientSignalDataAction, ICreatePeerAction, IRemovePeerAction, ISetPeerStatusAction } from "../actions/HostPeerActions";
import { IHostPeerState } from "../redux/State";
import { UserType } from "../utils/Definitions";
import { addSignalData } from "../utils/ReduxUtils";

const initialHostPeerState: IHostPeerState = {
    hostPeers: [],
};

const hostPeerState = (state: IHostPeerState = initialHostPeerState, action: HostPeerAction) => {
    const types = ActionType.hostPeerAction;

    switch (action.type) {
        case types.addClientSignalDataAction:
            return addSignalData(state, action as IAddSignalDataAction, UserType.CLIENT);

        case types.addHostSignalDataAction:
            return addSignalData(state, action as IAddSignalDataAction, UserType.HOST);

        case types.clearClientSignalDataAction:
            return Object.assign({}, state, {
                hostPeers: state.hostPeers.map((peer) => {
                    if (peer.clientID === (action as IClearClientSignalDataAction).id) {
                        return Object.assign(peer, {
                            clientSignalData: [],
                        });
                    }

                    return peer;
                }),
            });

        case types.clearHostSignalDataAction:
            return Object.assign({}, state, {
                hostPeers: state.hostPeers.map((peer) => {
                    if (peer.clientID === (action as IClearClientSignalDataAction).id) {
                        return Object.assign(peer, {
                            hostSignalData: [],
                        });
                    }

                    return peer;
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
                            clientSignalData: ((action as ISetPeerStatusAction).status) ? peer.clientSignalData : [],
                            hostSignalData: ((action as ISetPeerStatusAction).status) ? peer.hostSignalData : [],
                        });
                    }

                    return peer;
                }),
            });

        case types.removePeerAction:
            const copy = Object.assign({}, state);
            for (let i = 0; i < copy.hostPeers.length; i++) {
                if (copy.hostPeers[i].clientID === (action as IRemovePeerAction).id) {
                    copy.hostPeers.splice(i, 1);

                    return copy;
                }
            }
            throw new Error("No such client exists");

        default:
            return state;
    }
};

export default hostPeerState;
