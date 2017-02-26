import { IPeerState } from "./State";
import { IAddSignalDataAction } from "./Actions";
import { DataType } from "./Definitions";

export const addSignalData = (state: IPeerState, action: IAddSignalDataAction, type: DataType): IPeerState => {
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
