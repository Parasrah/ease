import { ActionType } from "../actions/Action";
import { CommonPeerAction, ISetIDAction, ISetServerStatusAction } from "../actions/CommonPeerActions";
import { ICommonPeerState } from "../redux/State";

const initialCommonPeerState: ICommonPeerState = {
    serverStatus: false,
    id: "",
};

const commonPeerState = (state: ICommonPeerState = initialCommonPeerState, action: CommonPeerAction) => {
    const types = ActionType.commonPeerAction;

    switch (action.type) {

        case types.setIDAction:
            return Object.assign({}, state, {
                id: (action as ISetIDAction).id,
            });

        case types.setServerStatusAction:
            return Object.assign({}, state, {
                serverStatus: (action as ISetServerStatusAction).serverStatus,
            });

        default:
            return state;
    }
};

export default commonPeerState;
