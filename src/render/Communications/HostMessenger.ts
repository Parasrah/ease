import { Instance } from "simple-peer";

import { HostMessageType, IDurationMessage, IControlMessage, ITimeMessage, IPlayMessage } from "../Messages/ControlMessage";

interface IConnection {
    peer: Instance;
    connected: boolean;
}

class HostMessenger {
    private maxTime: number;
    private connections: IConnection[];

    constructor() {
        this.maxTime = null;
        this.connections = [];
    }

    public registerPeer(peer: Instance) {

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

        peer.on("close", () => {
            for (let i = 0; i < this.connections.length; i++) {
                if (this.connections[i].peer === peer) {
                    this.connections.splice(i, 1);
                }
            }
        });
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
        }
    }
}

export default HostMessenger;
