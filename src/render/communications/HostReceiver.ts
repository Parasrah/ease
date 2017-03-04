import { Instance } from "simple-peer";
import { ClientMessageType, IControlMessage } from "../messages/ControlMessage";
import { AbstractReceiver } from "./AbstractReceiver";

class HostReceiver extends AbstractReceiver {
    private peers: Instance[];

    constructor() {
        super();
        this.peers = [];
        for (const key of Object.keys(ClientMessageType)) {
            this.subs.push({
                event: ClientMessageType[key],
                listeners: [],
            });
        }
    }

    public registerPeer(peer: Instance) {
        this.peers.push(peer);

        peer.on("close", () => {
            this.peers.splice(this.peers.indexOf(peer));
        });

        peer.on("data", (message: string) => {
            const controlMessage: IControlMessage = JSON.parse(message);
            this.handleMessage(controlMessage);
        });
    }
}

export default HostReceiver;
