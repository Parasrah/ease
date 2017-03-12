import { ClientMessageType } from "../messages/ControlMessage";
import { IEnhancedPeer } from "../peer/HostPeerManager";
import { AbstractReceiver } from "./AbstractReceiver";

export class HostReceiver extends AbstractReceiver {

    constructor() {
        super();
        for (const key of Object.keys(ClientMessageType)) {
            this.subs.push({
                event: ClientMessageType[key],
                listeners: [],
            });
        }
    }

    public registerPeer(peer: IEnhancedPeer) {
        peer.on("data", this.handleMessage);
    }
}
