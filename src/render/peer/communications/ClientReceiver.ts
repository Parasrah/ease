import { Instance } from "simple-peer";

import { HostMessageType } from "../messages/ControlMessage";
import { AbstractReceiver } from "./AbstractReceiver";

export class ClientReceiver extends AbstractReceiver {
    private peer;

    constructor() {
        super();

        // Setup subscriptions
        for (const key of Object.keys(HostMessageType)) {
            this.subs.push({
                event: HostMessageType[key],
                listeners: [],
            });
        }
    }

    public renewPeer(peer: Instance) {
        this.peer = peer;
        this.peer.on("data", this.handleMessage);
    }
}
