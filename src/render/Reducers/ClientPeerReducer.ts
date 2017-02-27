import { IClientPeerState } from "../redux/State";
import { Action, ActionType } from "../Actions/Action";
import { ClientPeerAction, IClearOfferDataAction, ISetHostIDAction, IStoreOfferAction, ISetPeerStatusAction } from "../Actions/ClientPeerActions";

const initialClientPeerState: IClientPeerState = {
    peerStatus: false,
    offerData: [],
    hostID: "",
};

const clientPeerState = (state: IClientPeerState = initialClientPeerState, action: Action<ClientPeerAction>) => {
    const types = ActionType.clientPeerAction;

    switch (action.type) {
        case types.clearOfferDataAction:
            return Object.assign({}, state, {
                offerData: [],
            });

        case types.setHostIDAction:
            return Object.assign({}, state, {
                hostID: (action as ISetHostIDAction).hostID,
            });

        case types.storeOfferDataAction:
            return Object.assign({}, state, {
                offerData: state.offerData.concat((action as IStoreOfferAction).signalData),
            });

        case types.setPeerStatusAction:
            return Object.assign({}, state, {
                peerStatus: (action as ISetPeerStatusAction).peerStatus,
            });

        default:
            return state;
    }
};

export default clientPeerState;
