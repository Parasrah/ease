import * as SimplePeer from "simple-peer";
import * as SocketIO from "socket.io-client";

import { VideoPage, VideoPageProps, OfferMessage } from "./VideoPage";

interface VideoClientProps extends VideoPageProps {
    hostID: string;
}

export class VideoClientPage extends VideoPage<VideoClientProps> {
    peer: SimplePeer.Instance;
    socket: SocketIOClient.Socket;

    constructor(props) {
        super(props);
        this.peer = new SimplePeer({
            initiator: true,
            trickle: false
        });
    }

    /********************* Methods ***********************/

    protected performSignaling = () => {
        // Prepare signalling data and send offer via socket.io
        this.peer.on("signal", (data: SimplePeer.SignalData) => {

            this.socket.on("response", (message: string) => {
                // Signal peer
                const signalData: SimplePeer.SignalData = JSON.parse(message);
                this.peer.signal(signalData);

                // Peer has signaling data
                this.peer.on("connect", () => {
                    console.log("peer connected");
                });

                this.peer.on("stream", (stream: MediaStream) => {
                    this.stream(stream);
                });
            });

            this.whenConnected(this.sendOffer, data);
        });
    }

    private stream = (stream: MediaStream) => {
        let video = this.getVideo();
        video.srcObject = stream;
        this.setVideoReady();
    }

    private sendOffer = (data: SimplePeer.SignalData) => {
        let offerMessage: OfferMessage = {
            hostID: this.props.hostID,
            clientID: this.props.id,
            signalData: data
        };
        this.socket.emit("offer", JSON.stringify(offerMessage));
    }

    private errorHandler(error) {
        console.log("error: " + error);
    }

    /********************* React Lifecycle ***********************/

    componentDidMount() {
        super.componentDidMount();
        this.performSignaling();
    }
}
