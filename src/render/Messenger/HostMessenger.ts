import { Instance } from "simple-peer";
import { MessageType, IControlMessage, ISeekMessage } from "../Messages/ControlMessage";

interface ISubscription {
    event: string;
    listeners: Function[];
}

class HostMessenger {
    private peers: Instance[];
    private subs: ISubscription[];

    constructor() {
        this.peers = [];
        for (const event of Object.keys(MessageType)) {
            this.subs.push({
                event,
                listeners: [],
            });
        }
    }

    public on = (event: string, fn: Function) => {
        for (const sub of this.subs) {
            if (sub.event === event) {
                sub.listeners.push(fn);
            }
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

    private handleMessage<T extends IControlMessage>(message: T) {
        for (const sub of this.subs) {
            if (sub.event === message.type) {
                for (let i = 0; i < sub.listeners.length; i++) {
                    sub.listeners[i](message);
                }
            }
        }
    }

}

export default HostMessenger;
