import { IAddSignalDataAction } from "../actions/HostPeerActions";
import { IHostPeerState } from "../redux/State";
import { UserType } from "./Definitions";

export const addSignalData = (state: IHostPeerState, action: IAddSignalDataAction, type: UserType): IHostPeerState => {
    let combinedSignalData = null;

    return Object.assign({}, state, {
        hostPeers: state.hostPeers.map((peer) => {
            if (peer.clientID === action.clientID) {
                switch (type) {
                    case UserType.HOST:
                        combinedSignalData = {
                            hostSignalData: peer.hostSignalData.concat(action.signalData),
                        };
                        break;

                    case UserType.CLIENT:
                        combinedSignalData = {
                            clientSignalData: peer.clientSignalData.concat(action.signalData),
                        };
                        break;

                    default:
                        throw Error("No such enum");
                }

                return Object.assign(peer, combinedSignalData);
            }
            else {
                return peer;
            }
        }),
    });
};
