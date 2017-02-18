import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Electron from "electron";
import * as SimplePeer from "simple-peer";
import * as SocketIO from "socket.io-client";

interface User {
    name: string;
    password: string;
    signal: any;
}

export interface OfferMessage {
    hostID: string;
    clientID: string;
    signalData: SimplePeer.SignalData;
}

export interface VideoPageProps {
    videoSource: string;
    signalHost: string;
    id: string;
}

export interface VideoPageState {
    videoSource: string | MediaStream;
}

export abstract class VideoPage<P extends VideoPageProps> extends React.Component<P, {}> {

    protected videoReady: boolean;
    protected videoListeners: Function[];
    protected peer: SimplePeer.Instance;
    protected socket: SocketIOClient.Socket;

    private videoElement: HTMLMediaElement;

    constructor(props) {
        super(props);

        this.videoReady = false;
        this.videoListeners = [];
        this.videoElement = null;

        // Initiate socket
        this.socket = SocketIO.connect(this.props.signalHost);
    }

    /********************* Methods ***********************/

    public getVideo(): HTMLMediaElement {
        return this.videoElement;
    }

    public registerListener(fn: Function): void {
        if (this.videoReady) {
            fn();
        }
        else {
            this.videoListeners.push(fn);
        }
    }

    protected setVideoReady() {
        // Set state to true
        this.videoReady = true;

        // Alert the listeners
        for (let fn of this.videoListeners) {
            fn();
        }
        this.videoListeners = null;
    }

    /********************* Callbacks ***********************/

    private setVideo = (video: HTMLVideoElement) => {
        this.videoElement = video;
    }

    /********************* React Lifecycle ***********************/

    componentDidMount() {
        console.log("video mounted");
    }

    /**
     * Setup the socketIO connection and the signalling
     */
    protected abstract performSignaling();

    render(): JSX.Element {
        return (
            <div className="video">
                <b> ID: </b> {this.props.id}
                <video
                    src={this.props.videoSource}
                    ref={this.setVideo}
                    poster={__dirname + "/data/heart.gif"}
                    type="video/mp4"
                    width="100%"
                    controls
                />
            </div>
        );
    }
}
