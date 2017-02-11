import * as React from "react";
import * as Electron from "electron";
import * as SimplePeer from "simple-peer";
import * as SocketIO from "socket.io-client";

import { VideoPage, VideoPageProps } from "./VideoPage";

interface OfferMessage {
    id: string;
    signal: SimplePeer.SignalData;
}

export class VideoHostPage extends VideoPage<VideoPageProps> {
    peer: SimplePeer.Instance;
    socket: SocketIOClient.Socket;

    constructor() {
        super();
    }

    protected connect() {
        this.socket.on("offer", (message: OfferMessage) => {
            // Received offer, signal webRTC
            this.peer.signal(message.signal);
            this.peer.on("signal", (data: SimplePeer.SignalData) => {
                // Has signalling data, send to client
                let offerResponse: OfferMessage = {
                    id: message.id,
                    signal: data
                };
                this.socket.emit("respond", offerResponse);
            });
        });
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
        this.connect();
    }
}
