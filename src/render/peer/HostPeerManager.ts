import * as SimplePeer from "simple-peer";
import { removePeerAction, setPeerStatusAction } from "../actions/HostPeerActions";
import { HostMessenger } from "../communications/HostMessenger";
import { HostReceiver } from "../communications/HostReceiver";
import { StoreWrapper } from "../redux/Store";
import { AbstractPeerManager } from "./AbstractPeerManager";
import { HostSignaler } from "./HostSignaler";

export interface IEnhancedPeer extends SimplePeer.Instance {
    clientID: string;
}

/**
 * Manage the peers connected to the host
 *
 * @since 2017-03-10
 */
export class HostPeerManager extends AbstractPeerManager<HostReceiver, HostMessenger, HostSignaler> {
    /** List of enhanced peers maintained by HostPeerManager */
    private peers: IEnhancedPeer[];
    private storeWrapper: StoreWrapper;
    private stream: any;

    constructor() {
        super(
            new HostReceiver(),
            new HostMessenger(),
            new HostSignaler(),
        );

        this.storeWrapper = StoreWrapper.getInstance();
        this.peers = [];
    }

    public registerStream(stream: MediaStream) {
        this.stream = stream;
    }

    /**
     * Handle creation of a new IEnhancedPeer and add to {@link HostPeerManager#peers}
     *
     * @param clientID - Corresponding id of clientID
     * @param signalArray Optional signal data
     */
    private createPeer(clientID: string, ...signalArray: SimplePeer.SignalData[]): void {
        // Create a normal SimplePeer instance
        const peer = new SimplePeer({
            initiator: false,
            stream: this.stream,
            trickle: true,
            answerConstraints: {
                offerToReceiveVideo: false,
                offerToReceiveAudio: false,
            },
        });

        // Convert to enhanced peer
        const enhancedPeer = Object.assign(peer, {clientID});

        // Register with communication managers
        this.getMessenger().registerPeer(enhancedPeer);
        this.getReceiver().registerPeer(enhancedPeer);

        this.watchPeer(enhancedPeer);

        // Deal with signal data
        for (let i = 0; i < signalArray.length; i++) {
            enhancedPeer.signal(signalArray[i]);
        }

        // Add peer to list
        this.peers.push(enhancedPeer);
    }

    /**
     * Respond to events on the peer
     *
     * @param peer - instance of EnhancedPeer to watch
     */
    private watchPeer(peer: IEnhancedPeer) {
        peer.on("connect", () => this.storeWrapper.dispatch(setPeerStatusAction(peer.clientID, true)));
        peer.on("signal", this.signaler.handleSignalData);
        peer.on("close", () => this.removePeer(peer));
    }

    /**
     * Deal with the deletion of the peer
     *
     * @param peer - EnhancedPeer to remove
     * @throws Error - Peer doesn't exist in {@link HostPeerManager#peers}
     */
    private removePeer(peer: IEnhancedPeer): void {
        let removed = false;

        peer.removeAllListeners();
        for (let i = 0; i < this.peers.length; i++) {
            if (this.peers[i].clientID === peer.clientID) {
                this.peers.splice(i, 1);
                removed = true;
            }
        }

        this.storeWrapper.dispatch(removePeerAction(peer.clientID));

        if (!removed) {
            throw new Error("Attempted to remove a peer that does not exist");
        }
    }
}
