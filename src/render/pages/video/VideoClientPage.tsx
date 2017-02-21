import * as SimplePeer from "simple-peer";

import { IOfferMessage, ICombinedVideoProps, VideoPage  } from "./VideoPage";

interface IVideoClientProps extends ICombinedVideoProps {
    hostID: string;
}

export class VideoClientPage extends VideoPage<IVideoClientProps> {

    constructor(props) {
        super(props);
        this.peer = new SimplePeer({
            initiator: true,
            trickle: false,
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
        });
    }

    private stream = (stream: MediaStream) => {
        const video = this.getVideo();
        video.srcObject = stream;
    }

    private sendOffer = (data: SimplePeer.SignalData) => {
        const offerMessage: IOfferMessage = {
            clientID: this.props.id,
            hostID: this.props.hostID,
            signalData: data,
        };
        this.socket.emit("offer", JSON.stringify(offerMessage));
    }

    private errorHandler(error) {
        console.log("error: " + error);
    }

    /********************* React Lifecycle ***********************/

    protected componentDidMount() {
        super.componentDidMount();
        this.performSignaling();
    }
}
