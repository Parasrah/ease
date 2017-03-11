import * as SimplePeer from "simple-peer";
import { removePeerAction, setPeerStatusAction } from "../actions/HostPeerActions";
import { HostMessenger } from "../communications/HostMessenger";
import { HostReceiver } from "../communications/HostReceiver";
import { AbstractPeerManager } from "./AbstractPeerManager";
import { HostSignaler } from "./HostSignaler";


export class HostPeerManager extends AbstractPeerManager<HostReceiver, HostMessenger, HostSignaler> {
    private hostReceiver: HostReceiver;
    private hostMessenger: HostMessenger;
    private peers: SimplePeer.Instance[];
    private stream: any;

    constructor() {
        super(
            new HostReceiver(),
            new HostMessenger(),
            new HostSignaler(),
        );

        this.hostReceiver = new HostReceiver();
        this.hostMessenger = new HostMessenger();
        this.peers = [];
    }

    public registerStream(stream: MediaStream) {
        this.stream = stream;
    }

    private createPeer = (clientID: string, ...offerData: SimplePeer.SignalData[]): SimplePeer.Instance => {
        const peer = new SimplePeer({
            initiator: false,
            stream: this.stream,
            trickle: true,
            answerConstraints: {
                offerToReceiveVideo: false,
                offerToReceiveAudio: false,
            },
        });

        this.hostReceiver.registerPeer(peer, clientID);
        this.hostMessenger.registerPeer(peer, clientID);

        peer.on("signal", (signalData: SimplePeer.SignalData) => {
            this.tryToRespond(clientID, signalData);
        });

        peer.on("connect", () => {
            this.dispatch(setPeerStatusAction(clientID, true));
        });

        peer.on("close", () => {
            this.hostMessenger.deregisterPeer(clientID);
            this.hostReceiver.deregisterPeer(clientID);
            (this.peers[clientID] as SimplePeer.Instance).removeAllListeners();
            delete this.peers[clientID];
            this.peers[clientID] = null;
            this.dispatch(removePeerAction(clientID));
        });

        for (const data of offerData) {
            peer.signal(data);
        }

        return peer;
    }
}
