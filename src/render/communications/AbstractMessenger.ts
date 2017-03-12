import { StoreWrapper } from "../redux/Store";

export abstract class AbstractMessenger {
    private storeWrapper: StoreWrapper;

    constructor() {
        this.storeWrapper = StoreWrapper.getInstance();
    }

    protected getClientPeerState() {
        return this.storeWrapper.getState().clientPeerState;
    }

    protected getHostPeerState() {
        return this.storeWrapper.getState().hostPeerState;
    }

    protected getVideoState() {
        return this.storeWrapper.getState().videoState;
    }
}
