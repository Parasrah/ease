import { Instance } from "simple-peer";
import { ClientMessageType, IControlMessage, ISeekMessage } from "../messages/ControlMessage";
import { AbstractMessenger } from "./AbstractMessenger";

export class ClientMessenger extends AbstractMessenger {
    private peer: Instance;

    constructor() {
        super();
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
        if (this.getClientPeerState().peerStatus) {
            this.peer.send(JSON.stringify(message));
        }
    }
}
