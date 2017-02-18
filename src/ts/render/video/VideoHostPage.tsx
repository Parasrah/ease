import * as SimplePeer from "simple-peer";

import { VideoPage, VideoPageProps, OfferMessage } from "./VideoPage";

export interface ResponseMessage {
    clientID: string;
    signalData: SimplePeer.SignalData;
}

export interface InitMessage {
    id: string;
}

export class VideoHostPage extends VideoPage<VideoPageProps> {
    peers: SimplePeer.Instance;
    socket: SocketIOClient.Socket;

    constructor(props) {
        super(props);

        // Send host information to the server
        this.subscribe("connect", this.initServer, true);

        // Send socket error info to console
        this.socket.on("signal_error", (error: string) => {
            console.log(error);
        });
    }

    /********************* Methods ***********************/

    /**
     * Must be performed AFTER simple peer initialized
     */
    protected performSignaling = () => {
        this.socket.on("offer", this.setupSignal);
    }

    /**
     * Handle incoming offers
     */
    private setupSignal = (offer: string) => {
        // Setup for signal ready
        this.peer.on("signal", (data: SimplePeer.SignalData) => {
            let responseMessage: ResponseMessage = {
                signalData: data,
                clientID: parsedOffer.clientID
            };
            this.respond(responseMessage);
        });

        // Signal peer
        const parsedOffer: OfferMessage = JSON.parse(offer);
        this.peer.signal(parsedOffer.signalData[0]);
    }

    private respond = (message: ResponseMessage) => {
        let offerResponse: ResponseMessage = {
            clientID: message.clientID,
            signalData: message.signalData,
        };
        this.socket.emit("respond", JSON.stringify(offerResponse));
    }

    private initServer = () => {
        let message: InitMessage = {
            id: this.props.id
        };
        this.socket.emit("host", JSON.stringify(message));
    }

    /********************* React Lifecycle ***********************/

    componentDidMount() {
        super.componentDidMount();

        // Initialize peer from video stream (must be called before VideoPage setup)
        let video: any = this.getVideo();
        video.onplay = () => {
            let stream: any = video.captureStream();
            this.peer = new SimplePeer({
                initiator: false,
                stream: stream,
                trickle: false
            });

            this.performSignaling();
            this.setVideoReady();
        };
    }
}
