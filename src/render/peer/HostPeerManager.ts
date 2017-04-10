import * as SimplePeer from "simple-peer";
import { removePeerAction, setPeerStatusAction } from "../actions/HostPeerActions";
import { StoreWrapper } from "../redux/Store";
import { AbstractPeerManager } from "./AbstractPeerManager";
import { HostMessenger } from "./communications/HostMessenger";
import { HostReceiver } from "./communications/HostReceiver";
import { HostSignaler } from "./HostSignaler";

export interface IEnhancedPeer extends SimplePeer.Instance {
    clientID: string;
}

/**
 * Manage the peers connected to the host
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

        // Bind functions
        this.registerStream = this.registerStream.bind(this);
        this.receiveSignalData = this.receiveSignalData.bind(this);
        this.setupPeer = this.setupPeer.bind(this);
        this.watchPeer = this.watchPeer.bind(this);

        this.storeWrapper = StoreWrapper.getInstance();
        this.peers = [];
        this.signaler.subscribe(this.receiveSignalData);
    }

    /**
     * Register the video stream with the HostPeerManager
     *
     * @param stream - Video stream
     */
    public registerStream(stream: MediaStream) {
        this.stream = stream;
    }

    /**
     * Handle signal data returned from the host signaler
     *
     * @param clientID - ID of peer targeted by signal data
     * @param signalData - simple-peer signal data
     */
    private receiveSignalData(clientID: string, ...signalData: SimplePeer.SignalData[]) {
        for (let i = 0; i < this.peers.length; i++) {
            if (this.peers[i].clientID === clientID) {
                for (let j = 0; j < signalData.length; j++) {
                    this.peers[i].signal(signalData[j]);
                }

                return;
            }
        }

        // No peer already exists, create a new peer
        this.setupPeer(clientID, ...signalData);
    }

    /**
     * Handle creation of a new IEnhancedPeer and add to {@link HostPeerManager#peers}
     *
     * @param clientID - Corresponding id of clientID
     * @param signalArray Optional signal data
     */
    private setupPeer(clientID: string, ...signalArray: SimplePeer.SignalData[]): void {
        // Create a normal SimplePeer instance
        const peer = this.createPeer();

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
     * Create and return new simple-peer instance
     */
    private createPeer() {
        return new SimplePeer({
            initiator: false,
            stream: this.stream,
            trickle: true,
            answerConstraints: {
                offerToReceiveVideo: false,
                offerToReceiveAudio: false,
            },
        });
    }

    /**
     * Respond to events on the peer
     *
     * @param peer - instance of EnhancedPeer to watch
     */
    private watchPeer(peer: IEnhancedPeer) {
        peer.on("connect", () => this.storeWrapper.dispatch(setPeerStatusAction(peer.clientID, true)));
        peer.on("signal", (signalData) => this.signaler.handleSignalData(peer.clientID, signalData));
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

        this.getMessenger().deregisterPeer(peer.clientID);
        peer.removeAllListeners();
        for (let i = 0; i < this.peers.length; i++) {
            if (this.peers[i].clientID === peer.clientID) {
                this.peers.splice(i, 1);
                removed = true;
            }
        }

        if (!removed) {
            console.error("Attempted to remove a peer that does not exist\nPeer: " + peer.clientID);
        }

        this.storeWrapper.dispatch(removePeerAction(peer.clientID));

        if (!removed) {
            throw new Error("Attempted to remove a peer that does not exist");
        }
    }
}
