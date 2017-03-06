import { Instance } from "simple-peer";
import { ClientMessageType, IControlMessage, ISeekMessage } from "../messages/ControlMessage";
import { StoreWrapper } from "../redux/Store";

export class ClientMessenger {
    private peer: Instance;
    private storeWrapper: StoreWrapper;

    constructor() {
        this.storeWrapper = StoreWrapper.getInstance();
    }

    public renewPeer(peer: Instance) {
        this.peer = peer;
    }

    public sendPlayPauseMessage() {
        const message: IControlMessage = {
            type: ClientMessageType.PLAY_PAUSE,
        };
        this.sendMessage(message);
    }

    public sendSeekMessage(time) {
        const message: ISeekMessage = {
            type: ClientMessageType.SEEK,
            time,
        };
        this.sendMessage(message);
    }

    private sendMessage(message: object) {
        if (this.storeWrapper.getState().clientPeerState.peerStatus) {
            this.peer.send(JSON.stringify(message));
        }
    }
}
