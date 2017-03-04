import { IHostPeerState } from "../redux/State";
import { IAddSignalDataAction } from "../actions/HostPeerActions";
import { DataType } from "./Definitions";

export const addSignalData = (state: IHostPeerState, action: IAddSignalDataAction, type: DataType): IHostPeerState => {
    let combinedSignalData = null;

    return Object.assign({}, state, {
        hostPeers: state.hostPeers.map((peer) => {
            if (peer.clientID === action.clientID) {
                switch (type) {
                    case DataType.HOST:
                        combinedSignalData = {
                            hostSignalData: peer.hostSignalData.concat(action.signalData),
                        };
                        break;

                    case DataType.CLIENT:
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
