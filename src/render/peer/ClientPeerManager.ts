import * as SimplePeer from "simple-peer";
import { watchPeerStatusAction } from "../actions/ClientPeerActions";
import { ClientMessenger } from "../communications/ClientMessenger";
import { ClientReceiver } from "../communications/ClientReceiver";
import { StoreWrapper } from "../redux/Store";
import { ClientSignaler } from "./ClientSignaler";

export class ClientPeerManager {
    private peer: SimplePeer.Instance;
    private messenger: ClientMessenger;
    private receiver: ClientReceiver;
    private signaler: ClientSignaler;
    private storeWrapper: StoreWrapper;
    private stream: MediaStream;
    private deliverStream: (stream: MediaStream) => void;

    constructor() {
        this.stream = null;
        this.deliverStream = null;
        this.storeWrapper = StoreWrapper.getInstance();

        this.peer = new SimplePeer({
            initiator: true,
            trickle: true,
            offerConstraints: {
                offerToReceiveVideo: true,
                offerToReceiveAudio: true,
            },
        });

        this.peer.on("stream", this.resolveStream);
        this.storeWrapper.dispatch(watchPeerStatusAction(this.peer));

        this.signaler = new ClientSignaler();
        this.messenger = new ClientMessenger(this.peer);
        this.receiver = new ClientReceiver(this.peer);

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

    private resolveStream = (stream: MediaStream) => {
        this.stream = stream;
        if (this.deliverStream) {
            this.deliverStream(stream);
        }
    }
}
