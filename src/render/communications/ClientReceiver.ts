import { Instance } from "simple-peer";

import { HostMessageType } from "../messages/ControlMessage";
import { AbstractReceiver } from "./AbstractReceiver";

class ClientReceiver extends AbstractReceiver {
    private peer;

    constructor(peer: Instance) {
        super();

        // Setup subscriptions
        for (const key of Object.keys(HostMessageType)) {
            this.subs.push({
                event: HostMessageType[key],
                listeners: [],
            });
        }

        // Setup peer
        this.peer = peer;
        this.peer.on("data", (message) => {
            this.handleMessage(JSON.parse(message));
        });
    }
}

export default ClientReceiver;
