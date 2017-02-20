import * as SimplePeer from "simple-peer";

import { IOfferMessage, IVideoPageProps, VideoPage  } from "./VideoPage";

export interface IResponseMessage {
    clientID: string;
    signalData: SimplePeer.SignalData;
}

export interface IInitMessage {
    id: string;
}

export class VideoHostPage extends VideoPage<IVideoPageProps> {
    protected socket: SocketIOClient.Socket;
    private peers: SimplePeer.Instance;

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
            const IresponseMessage: IResponseMessage = {
                clientID: parsedOffer.clientID,
                signalData: data,
            };
            this.respond(IresponseMessage);
        });

        // Signal peer
        const parsedOffer: IOfferMessage = JSON.parse(offer);
        this.peer.signal(parsedOffer.signalData[0]);
    }

    private respond = (message: IResponseMessage) => {
        const offerResponse: IResponseMessage = {
            clientID: message.clientID,
            signalData: message.signalData,
        };
        this.socket.emit("respond", JSON.stringify(offerResponse));
    }

    private initServer = () => {
        const message: IInitMessage = {
            id: this.props.id,
        };
        this.socket.emit("host", JSON.stringify(message));
    }

    /********************* React Lifecycle ***********************/

    protected componentDidMount() {
        super.componentDidMount();

        // Initialize peer from video stream (must be called before VideoPage setup)
        const video: any = this.getVideo();
        video.onplay = () => {
            const stream: any = video.captureStream();
            this.peer = new SimplePeer({
                initiator: false,
                stream,
                trickle: false,
            });

            this.performSignaling();
            this.setVideoReady();
        };
    }
}
