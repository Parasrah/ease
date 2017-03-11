import { IState } from "../redux/State";
import { AbstractSignaler } from "./AbstractSignaler";

interface IInitMessage {
    id: string;
}

export class HostSignaler extends AbstractSignaler {

    constructor() {
        super();

        this.socket.on("offer", this.dealWithOffer);
    }

    /**
     * Called when state changes
     * @param oldState - Previous value of state
     * @param nextState - New value of state
     */
    protected notify(oldState: IState, nextState: IState) {
        if (!oldState.commonPeerState.serverStatus && nextState.commonPeerState.serverStatus) {
            this.discover();
        }

        // See if client signal data can be used (waiting for video or server)
        nextState.hostPeerState.hostPeers.forEach((storePeer) => {
            if (this.peers[storePeer.clientID]) {
                if (storePeer.clientSignalData.length > 0) {
                    for (const data of storePeer.clientSignalData) {
                        this.peers[storePeer.clientID].signal(data); // TODO investigate this
                    }
                    this.dispatch(clearClientSignalDataAction(storePeer.clientID));
                }
            }
            else if (storePeer.clientSignalData.length > 0 && nextState.videoState.videoReady) {
                if (this.peers[storePeer.clientID] !== null) {
                    this.peers[storePeer.clientID] = this.createPeer(storePeer.clientID, storePeer.clientSignalData);
                }
                this.dispatch(clearClientSignalDataAction(storePeer.clientID));
            }
        });

        // See if host signal data can be used (waiting on server)
        if (this.getServerStatus()) {
            this.getHostState().hostPeers.forEach((storePeer) => {
                if (this.peers[storePeer.clientID] !== null && storePeer.hostSignalData.length > 0) {
                    for (const data of storePeer.hostSignalData) {
                        this.respond(storePeer.clientID, data);
                    }
                }
                if (storePeer.hostSignalData.length > 0) {
                    this.dispatch(clearHostSignalDataAction(storePeer.clientID));
                }
            });
        }
    }

    private discover = () => {
        const initMessage: IInitMessage = {
            id: this.getID(),
        };
        this.socket.emit("discover", initMessage);
    }

    private dealWithOffer = (offer: IOfferMessage) => {
        let storePeer: IPeer = null;
        let signalData = [ offer.signalData ];

        // Look for existing store peer
        this.getHostState().hostPeers.forEach((peer) => {
            if (peer.clientID === offer.clientID) {
                // Discovered store peer
                storePeer = peer;
                signalData.push(...storePeer.clientSignalData);

                // If not ready, store the data
                if (!this.getVideoReady() || !this.getServerStatus()) {
                    this.dispatch(addClientSignalDataAction(offer.clientID, offer.signalData));
                }
            }
        });

        // Deal with peer creation
        if (!this.peers[offer.clientID] && this.getVideoReady() && this.getServerStatus()) {
            // If store peer exists, check for store data
            if (storePeer) {
                this.peers[offer.clientID] = this.createPeer(offer.clientID, ...signalData);
            } else {
                // Else, use offer data
                this.peers[offer.clientID] = this.createPeer(offer.clientID, ...signalData);
            }
            if (signalData.length > 1) {
                this.dispatch(clearClientSignalDataAction(offer.clientID));
            }
            signalData = [];
        }

        else if (this.peers[offer.clientID] && this.getVideoReady() && this.getServerStatus()) {
            const peer = this.peers[offer.clientID];
            for (const data of signalData) {
                peer.signal(data);
            }
            if (signalData.length > 1) {
                this.dispatch(clearClientSignalDataAction(offer.clientID));
            }
            signalData = [];
        }

        // Create store peer if necessary
        if (!storePeer) {
            if (this.getServerStatus() && this.getVideoReady()) {
                this.dispatch(createPeerAction(offer.clientID));
            }
            else {
                this.dispatch(createPeerAction(offer.clientID, offer.signalData));
            }
        }
    }

    private tryToRespond = (clientID: string, signalData: SimplePeer.SignalData) => {
        if (this.getServerStatus()) {
            this.respond(clientID, signalData);
        }
        else {
            // Put into the store
            this.dispatch(addHostSignalDataAction(clientID, signalData));
        }
    }

    private respond = (clientID: string, signalData: SimplePeer.SignalData) => {
        const responseMessage: IResponseMessage = {
            signalData,
            clientID,
        };
        this.socket.emit("respond", responseMessage);
    }
}
