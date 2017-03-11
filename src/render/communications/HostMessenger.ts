import { Instance } from "simple-peer";

import { HostMessageType, IControlMessage, IDurationMessage, IPlayMessage, ITimeMessage } from "../messages/ControlMessage";
import { IEnhancedPeer } from "../peer/HostPeerManager";
import { AbstractMessenger } from "./AbstractMessenger";

interface IConnection {
    peer: IEnhancedPeer;
    connected: boolean;
}

export class HostMessenger extends AbstractMessenger {
    private maxTime: number;
    private connections: IConnection[];

    constructor() {
        super();
        this.maxTime = null;
        this.connections = [];
    }

    public registerPeer(peer: IEnhancedPeer) {

        this.connections.push({
            peer,
            connected: false,
        });

        peer.on("connect", () => {

            if (this.maxTime) {
                this.publishToPeer(peer, this.createDurationMessage());
            }

            for (const connection of this.connections) {
                if (connection.peer === peer) {
                    connection.connected = true;
                }
            }
        });
    }

    public deregisterPeer(clientID: string) {
        for (let i = 0; i < this.connections.length; i++) {
            if (this.connections[i].peer.clientID === clientID) {
                this.connections.splice(i, 1);

                return;
            }
        }
        throw new Error("No registered peer with id: " + clientID);
    }

    public publishDuration(duration: number) {
        this.maxTime = duration;
        this.publishToConnected(this.createDurationMessage());
    }

    public publishPlay(play: boolean) {
        this.publishToConnected(this.createPlayMessage(play));
    }

    public publishTime(time: number) {
        this.publishToConnected(this.createTimeMessage(time));
    }

    private publishToConnected<T extends IControlMessage>(message: T) {
        for (const connection of this.connections) {
            if (connection.connected) {
                connection.peer.send(JSON.stringify(message));
            }
        }
    }

    private publishToPeer<T extends IControlMessage>(peer: Instance, message: T) {
        peer.send(JSON.stringify(message));
    }

    private createTimeMessage(time: number): ITimeMessage {
        return {
            type: HostMessageType.TIME,
            time,
        };
    }

    private createDurationMessage(): IDurationMessage {
        return {
            type: HostMessageType.DURATION,
            duration: this.maxTime,
        };
    }

    private createPlayMessage(play: boolean): IPlayMessage {
        return {
            type: HostMessageType.PLAY,
            play,
        };
    }
}
