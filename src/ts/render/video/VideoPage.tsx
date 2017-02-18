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

interface SocketFunction {
    (args: any[]): void;
}

interface SocketListener {
    fn: SocketFunction;
    args: any[];
}

export abstract class VideoPage<P extends VideoPageProps> extends React.Component<P, {}> {

    protected videoReady: boolean;
    protected videoListeners: Function[];
    protected peer: SimplePeer.Instance;
    protected socket: SocketIOClient.Socket;
    private socketListeners: SocketListener[];

    private videoElement: HTMLMediaElement;

    constructor(props) {
        super(props);

        this.videoReady = false;
        this.videoListeners = [];
        this.videoElement = null;
        this.socketListeners = [];

        // Initiate socket
        this.socket = SocketIO.connect(this.props.signalHost);
    }

    /********************* Methods ***********************/

    public getVideo = (): HTMLMediaElement => {
        return this.videoElement;
    }

    public registerListener = (fn: Function): void => {
        if (this.videoReady) {
            fn();
        }
        else {
            this.videoListeners.push(fn);
        }
    }

    protected setVideoReady = () => {
        // Set state to true
        this.videoReady = true;

        // Alert the listeners
        for (let fn of this.videoListeners) {
            fn();
        }
        this.videoListeners = null;
    }

    protected whenConnected = (fn: SocketFunction, ...args) => {
        if (this.socket.connected) {
            fn(args);
        }
        else {
            this.socketListeners.push({
                fn: fn,
                args: args
            });
            if (this.socketListeners.length === 1) {
                this.socket.on("connect", this.connectionListener);
            }
        }
    }

    private setVideo = (video: HTMLVideoElement) => {
        this.videoElement = video;
    }

    private connectionListener = () => {
        this.socket.off("connect", this.connectionListener);
        for (let listener of this.socketListeners) {
            listener.fn(listener.args);
        }
    }

    /********************* Abstract Methods ***********************/

    /**
     * Setup the socketIO connection and the signalling
     */
    protected abstract performSignaling: () => void;

    /********************* React Lifecycle ***********************/

    componentDidMount() {
        console.log("video mounted");
    }

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
