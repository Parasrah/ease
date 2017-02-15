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

export interface InitMessage {
    id: string;
}

export interface SignalCallback {
    (message: OfferMessage, cb: (message: OfferMessage) => void): void;
}

export class VideoHostPage extends VideoPage<VideoPageProps> {
    peer: SimplePeer.Instance;
    socket: SocketIOClient.Socket;

    constructor(props) {
        super(props);

        // Send host information to the server
        this.socket.on("connect", () => {
            this.initServer();
        });

        this.socket.on("reconnect", () => {
            this.initServer();
        });

        // Send socket error info to console
        this.socket.on("signal_error", (error: string) => {
            console.log(error);
        });
    }

    componentDidMount() {
        super.componentDidMount();

        // Initialize peer from video stream (must be called before VideoPage setup)
        let video: any = this.getVideo();
        video.onplay = () => {
            let stream: any = video.captureStream();
            this.peer = new SimplePeer({
                initiator: false,
                stream: stream
            });

            this.performSignaling();
            this.setVideoReady();
        };
    }

    /**
     * Must be performed AFTER simple peer initialized
     */
    protected performSignaling() {
        this.socket.on("offer", (message: OfferMessage) => {
            this.setupSignal(message).then(this.respond);
        });
    }

    private initServer() {
        let message: InitMessage = {
            id: this.props.id
        };
        this.socket.emit("host", JSON.stringify(message));
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
        this.socket.emit("respond", JSON.stringify(offerResponse));
    }
}
