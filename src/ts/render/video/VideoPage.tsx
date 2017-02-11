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

export interface VideoPageProps {
    videoSource: string;
    signalHost: string;
    id: string;
}

export interface VideoPageState {
    videoSource: string | MediaStream;
}

export abstract class VideoPage<P extends VideoPageProps> extends React.Component<P, {}> {
    static VIDEO_ID_PREFIX = "video_";

    protected videoReady: boolean;
    protected videoListeners: Function[];

    private videoElement: HTMLMediaElement;

    peer: SimplePeer.Instance;
    socket: SocketIOClient.Socket;

    constructor(props) {
        super(props);

        this.videoReady = false;
        this.videoListeners = [];
        this.videoElement = null;

        // Initiate socket
        this.socket = SocketIO.connect(this.props.signalHost);
    }

    render(): JSX.Element {
        return (
            <div className="video">
                <video
                    src={this.props.videoSource}
                    ref={(video) => { this.videoElement = video; }}
                    poster="../../../../src/data/heart.gif"
                    type="video/mp4"
                    width="100%"
                    controls>
                </video>
            </div>
        );
    }

    getVideo(): HTMLMediaElement {
        return this.videoElement;
    }

    componentDidMount() {
        console.log("video mounted");
        this.connect();
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

    /**
     * Setup the socketIO connection and the signalling
     */
    protected abstract connect();
}
