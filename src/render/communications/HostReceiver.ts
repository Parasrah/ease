import { ClientMessageType } from "../messages/ControlMessage";
import { IEnhancedPeer } from "../peer/HostPeerManager";
import { AbstractReceiver } from "./AbstractReceiver";

export class HostReceiver extends AbstractReceiver {
    private peers: IEnhancedPeer[];

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

    public registerPeer(peer: IEnhancedPeer) {
        this.peers.push(peer);
        peer.on("data", this.handleMessage);
    }

    public deregisterPeer(clientID: string) {
        for (let i = 0; i < this.peers.length; i++) {
            if (this.peers[i].clientID === clientID) {
                this.peers.splice(i, 1);

                return;
            }
        }
        throw new Error("No such connection exists with clientID: " + clientID);
    }
}
