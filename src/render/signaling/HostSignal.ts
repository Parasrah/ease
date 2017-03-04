import { AbstractSignal } from "./AbstractSignal";
import { IState } from "../redux/State";

export class HostSignal extends AbstractSignal {

    constructor() {
        super();
    }

    protected notify(oldState: IState, nextState: IState) {
        if (oldState.commonPeerState.serverStatus !== nextState.commonPeerState.serverStatus) {
            
        }
    }
}
