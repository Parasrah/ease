import * as Guid from "guid";
import * as SimplePeer from "simple-peer";

import { setPeerStatusAction, watchPeerStatusAction } from "../actions/ClientPeerActions";
import { setIDAction } from "../actions/CommonPeerActions";
import { ClientMessenger } from "../communications/ClientMessenger";
import { ClientReceiver } from "../communications/ClientReceiver";
import { StoreWrapper } from "../redux/Store";
import { AbstractPeerManager } from "./AbstractPeerManager";
import { ClientSignaler } from "./ClientSignaler";

export class ClientPeerManager extends AbstractPeerManager<ClientReceiver, ClientMessenger, ClientSignaler> {
    private peer: SimplePeer.Instance;
    private storeWrapper: StoreWrapper;
    private stream: MediaStream;
    private deliverStream: (stream: MediaStream) => void;

    constructor() {
        super(
            new ClientReceiver(),
            new ClientMessenger(),
            new ClientSignaler(),
        );
        this.stream = null;
        this.deliverStream = null;
        this.storeWrapper = StoreWrapper.getInstance();
        this.setupPeer();
    }

    public reconnect = () => {
        this.storeWrapper.dispatch(setIDAction(Guid.raw()));
        if (this.peer) {
            this.peer.removeAllListeners();
            this.storeWrapper.dispatch(setPeerStatusAction(false));

            if ((this.peer as any).connected === undefined) {
                throw new Error("No `connected` status on simple-peer instance");
            }
            if ((this.peer as any).connected) {
                this.peer.destroy(this.setupPeer);
            }
            else {
                this.setupPeer();
            }
        }
        else {
            this.setupPeer();
        }
    }

    public getPeer() {
        return this.peer;
    }

    public onStream = (callback: (stream: MediaStream) => void) => {
        if (this.stream) {
            callback(this.stream);
        }
        this.deliverStream = callback;
    }

    private createPeer() {
        return new SimplePeer({
            initiator: true,
            trickle: true,
            offerConstraints: {
                offerToReceiveVideo: true,
                offerToReceiveAudio: true,
            },
        });
    }

    private resolveStream = (stream: MediaStream) => {
        this.stream = stream;
        if (this.deliverStream) {
            this.deliverStream(stream);
        }
    }

    private setupPeer = () => {
        this.peer = this.createPeer();
        this.peer.on("stream", this.resolveStream);
        this.storeWrapper.dispatch(watchPeerStatusAction(this.peer));
        this.getMessenger().renewPeer(this.peer);
        this.getReceiver().renewPeer(this.peer);
        this.peer.on("signal", this.signaler.sendSignal);
        this.peer.on("close", this.reconnect);
        this.signaler.onResponse((signalData) => this.peer.signal(signalData));
    }
}
