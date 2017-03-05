import * as SimplePeer from "simple-peer";
import { ClientMessenger } from "../communications/ClientMessenger";
import { ClientReceiver } from "../communications/ClientReceiver";
import { ClientSignaler } from "./ClientSignaler";

export class ClientPeerManager {
    private peer: SimplePeer.Instance;
    private messenger: ClientMessenger;
    private receiver: ClientReceiver;
    private signaler: ClientSignaler;
    private stream: MediaStream;
    private deliverStream: (stream: MediaStream) => void;

    constructor() {
        this.stream = null;
        this.deliverStream = null;

        this.peer = new SimplePeer({
            initiator: true,
            trickle: true,
            offerConstraints: {
                offerToReceiveVideo: true,
                offerToReceiveAudio: true,
            },
        });

        this.messenger = new ClientMessenger(this.peer);
        this.receiver = new ClientReceiver(this.peer);
        this.signaler = new ClientSignaler((stream) => {
            this.stream = stream;
            if (this.deliverStream) {
                this.deliverStream(stream);
            }
        });

        this.peer.on("signal", this.signaler.sendSignal);
        this.signaler.onResponse((signalData) => this.peer.signal(signalData));
    }

    public getMessenger() {
        return this.messenger;
    }

    public getReceiver() {
        return this.receiver;
    }

    public getPeer() {
        return this.peer;
    }

    public onStream(callback: (stream: MediaStream) => void) {
        if (this.stream) {
            callback(this.stream);
        }
        this.deliverStream = callback;
    }
}
