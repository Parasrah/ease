import { Instance } from "simple-peer";
import { ClientMessageType } from "../messages/ControlMessage";
import { AbstractReceiver } from "./AbstractReceiver";

export class HostReceiver extends AbstractReceiver {
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

        peer.on("data", this.handleMessage);
    }
}
