import * as SimplePeer from "simple-peer";
import * as SocketIO from "socket.io-client";

import { VideoPage, VideoPageProps } from "./VideoPage";

interface VideoClientProps extends VideoPageProps {
    hostID: string;
}

interface OfferMessage {
    targetID: string;
    clientID: string;
    signalData: SimplePeer.SignalData;
}

export class VideoClientPage extends VideoPage<VideoClientProps> {
    peer: SimplePeer.Instance;
    socket: SocketIOClient.Socket;

    constructor(props) {
        super(props);
        this.peer = new SimplePeer({
            initiator: true
        });
    }

    componentDidMount() {
        super.componentDidMount();
        this.performSignaling();
    }

    protected performSignaling() {
        // Prepare signalling data and send offer via socket.io
        this.prepareSignal().then((data: SimplePeer.SignalData) => {
            this.signal(data).then(this.sendOffer);
        });

        // Setup peer using response
        this.respond().then((signalData: SimplePeer.SignalData) => {
            this.peer.signal(signalData);

            // Peer has signaling data
            this.setupPeerConnection().then(() => {
                this.setupStream().then(this.stream);
            });
        });
    }

    private prepareSignal() {
        return new Promise((resolve, reject) => {
            this.peer.on("signal", (data: SimplePeer.SignalData) => {
                resolve(data);
            });
        });
    }

    private signal(data: SimplePeer.SignalData) {
        return new Promise((resolve, reject) => {
            this.socket.on("signal_error", (error) => {
                this.socket.removeEventListener("signal_error");
                reject(error);
            });
            this.socket.on("connect", () => {
                this.socket.removeEventListener("error");
                this.socket.removeEventListener("connect");
                resolve(data);
            });
        });
    }

    private respond(): Promise<SimplePeer.SignalData | string> {
        return new Promise((resolve, reject) => {
            this.socket.on("signal_error", (error) => {
                this.socket.removeEventListener("signal_error");
                reject(error);
            });
            this.socket.on("response", (signalData: SimplePeer.SignalData) => {
                this.socket.removeEventListener("error");
                this.socket.removeEventListener("response");
                resolve(signalData);
            });
        });
    }

    private sendOffer = (data: SimplePeer.SignalData) => {
        let offerMessage: OfferMessage = {
            targetID: this.props.hostID,
            clientID: this.props.id,
            signalData: data
        };
        this.socket.emit("offer", JSON.stringify(offerMessage));
    }

    private setupPeerConnection(): Promise<{}> {
        return new Promise((resolve, reject) => {
            // Wait for peer connection
            this.peer.on("connect", () => {
                resolve();
            });
        });
    }

    private setupStream = () => {
        return new Promise((resolve, reject) => {
            this.peer.on("stream", (stream: MediaStream) => {
                resolve(stream);
            });
        });
    }

    private stream(stream: MediaStream) {
        let video = this.getVideo();
        video.srcObject = stream;
        this.setVideoReady();
    }
}
