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

export abstract class VideoClientPage extends VideoPage<VideoClientProps> {
    peer: SimplePeer.Instance;
    socket: SocketIOClient.Socket;

    constructor() {
        super(true);
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
}
