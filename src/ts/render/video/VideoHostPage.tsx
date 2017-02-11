import * as SimplePeer from "simple-peer";
import * as SocketIO from "socket.io-client";

import { VideoPage, VideoPageProps } from "./VideoPage";

interface OfferMessage {
    id: string;
    signal: SimplePeer.SignalData;
}

export interface SignalCallback {
    (message: OfferMessage, cb: (message: OfferMessage) => void): void;
}

export class VideoHostPage extends VideoPage<VideoPageProps> {
    peer: SimplePeer.Instance;
    socket: SocketIOClient.Socket;

    constructor() {
        super();
    }

    protected connect(callback: SignalCallback) {
        this.socket.on("offer", (message: OfferMessage) => {
            // Received offer, signal webRTC
            callback(message, this.respond);
        });
    }

    protected signal(message: OfferMessage, cb: (message: OfferMessage) => void): void {
        this.peer.on("signal", (data: SimplePeer.SignalData) => {
            // Has signalling data, send to client
            let offerResponse: OfferMessage = {
                id: message.id,
                signal: data
            };
            cb(offerResponse);
        });

        this.peer.signal(message.signal);
    }

    private respond(message: OfferMessage) {
        this.socket.emit("respond", message);
    }

    componentDidMount() {
        super.componentDidMount();

        // Initialize peer from video stream
        let video: any = document.getElementById(VideoHostPage.VIDEO_ID);
        let stream: any = video.captureStream();
        this.peer = new SimplePeer({
            initiator: false,
            stream: stream
        });

        // Perform signalling
        this.connect(this.signal);
    }
}
