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

    constructor() {
        super();
        this.peer = new SimplePeer({
            initiator: true
        });
    }

    protected connect() {
        // Prepare signalling data and send offer via socket.io
        this.prepareSignal().then((data: SimplePeer.SignalData) => {
            this.signal(data).then(this.sendOffer);
        });

        // Setup peer using response
        this.respond().then((signalData: SimplePeer.SignalData) => {
            this.peer.signal(signalData);
        });

        this.setupPeerConnection().then(() => { this.setupStream().then(this.stream); });
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
            this.socket.on("connect", () => {
                this.socket.removeEventListener("error");
                resolve(data);
            });
            this.socket.on("error", (error) => {
                this.socket.removeEventListener("error");
                reject(error);
            });
        });
    }

    private respond() {
        return new Promise((resolve, reject) => {
            this.socket.on("response", (signalData: SimplePeer.SignalData) => {
                this.socket.removeEventListener("error");
                resolve(signalData);
            });
            this.socket.on("error", (error) => {
                this.socket.removeEventListener("error");
                reject(error);
            });
        });
    }

    private sendOffer(data: SimplePeer.SignalData) {
        let offerMessage: OfferMessage = {
            targetID: this.props.hostID,
            clientID: this.props.id,
            signalData: data
        };
        this.socket.emit("offer", offerMessage);
    }

    private setupPeerConnection() {
        return new Promise((resolve, reject) => {
            // Wait for peer connection
            this.peer.on("connect", () => {
                resolve();
            });
        });
    }

    private setupStream() {
        return new Promise((resolve, reject) => {
            this.peer.on("stream", (stream: MediaStream) => {
                resolve(stream);
            });
        });
    }

    private stream(stream: MediaStream) {
        let video = document.getElementById(VideoClientPage.VIDEO_ID) as HTMLMediaElement;
        video.onplay = () => {
            video.srcObject = stream;
        };
    }
}
