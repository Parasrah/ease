import * as SimplePeer from "simple-peer";
import * as SocketIO from "socket.io-client";

import { VideoPage, VideoPageProps } from "./VideoPage";

export interface OfferMessage {
    id: string;
    signal: SimplePeer.SignalData;
}

export interface ResponseMessage {
    clientID: string;
    signalData: SimplePeer.SignalData;
}

export interface SignalCallback {
    (message: OfferMessage, cb: (message: OfferMessage) => void): void;
}

export class VideoHostPage extends VideoPage<VideoPageProps> {
    peer: SimplePeer.Instance;
    socket: SocketIOClient.Socket;

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // Initialize peer from video stream (must be called before VideoPage setup)
        console.log("entering did mount");
        let video: any = this.getVideo();
        video.onplay = () => {
            let stream: any = video.captureStream();
            this.peer = new SimplePeer({
                initiator: false,
                stream: stream
            });

            // Let VideoPage finish mounting
            super.componentDidMount();
            this.setVideoReady();
        };
    }

    protected connect() {
        this.prepareForOffer().then((message: OfferMessage) => { this.setupSignal(message).then(this.respond); });
    }

    private prepareForOffer() {
        return new Promise((resolve, reject) => {
            this.socket.on("offer", (message: OfferMessage) => {
                this.socket.removeEventListener("error");
                resolve(message);
            });
            this.socket.on("error", (error) => {
                this.socket.removeEventListener("error");
                reject(error);
            });
        });
    }

    private setupSignal(offer: OfferMessage) {
        // Signal peer
        this.peer.signal(offer.signal);

        // Prepare to respond
        return new Promise((resolve) => {
            this.peer.on("signal", (data: SimplePeer.SignalData) => {
                resolve(data);
            });
        });
    }

    private respond(message: ResponseMessage) {
        let offerResponse: OfferMessage = {
            id: message.clientID,
            signal: message.signalData
        };
        this.socket.emit("respond", offerResponse);
    }
}
