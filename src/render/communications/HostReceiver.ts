import { Instance } from "simple-peer";
import { ClientMessageType } from "../messages/ControlMessage";
import { AbstractReceiver } from "./AbstractReceiver";

interface IConnection {
    peer: Instance;
    clientID: string;
}

export class HostReceiver extends AbstractReceiver {
    private connections: IConnection[];

    constructor() {
        super();
        this.connections = [];
        for (const key of Object.keys(ClientMessageType)) {
            this.subs.push({
                event: ClientMessageType[key],
                listeners: [],
            });
        }
    }

    public registerPeer(peer: Instance, clientID: string) {
        this.connections.push({
            peer,
            clientID,
        });

        peer.on("data", this.handleMessage);
    }

    public deregisterPeer(clientID: string) {
        for (let i = 0; i < this.connections.length; i++) {
            if (this.connections[i].clientID === clientID) {
                this.connections.splice(i, 1);

                return;
            }
        }
        throw new Error("No such connection exists with clientID: " + clientID);
    }
}
