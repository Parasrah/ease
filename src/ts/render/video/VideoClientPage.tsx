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
        this.peer.on("signal", (data: SimplePeer.SignalData) => {
            // Have data, send to host
            this.socket.on("connect", () => {
                let offerMessage: OfferMessage = {
                    targetID: this.props.hostID,
                    clientID: this.props.id,
                    signalData: data
                };
                this.socket.emit("offer", offerMessage);
            });

            this.socket.on("response", (signalData: SimplePeer.SignalData) => {
                this.peer.signal(signalData);
            });
        });
    }

    componentDidMount() {
        super.componentDidMount();

        // Setup socket.io connection
        this.connect();

        // Wait for peer connection
        this.peer.on("connect", () => {
            // Wait for data
            this.peer.on("stream", (stream: MediaStream) => {
                let video = document.getElementById(VideoClientPage.VIDEO_ID) as HTMLMediaElement;
                video.onplay = () => {
                    video.srcObject = stream;
                };
            });
        });
    }
}
