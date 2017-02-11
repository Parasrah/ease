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
    name: string;
    id: string;
}

export interface VideoPageState {
    videoSource: string | MediaStream;
}

export abstract class VideoPage<P extends VideoPageProps> extends React.Component<P, {}> {
    static VIDEO_ID = "video";

    peer: SimplePeer.Instance;
    socket: SocketIOClient.Socket;

    constructor() {
        super();

        // Initiate socket
        this.socket = SocketIO.connect(this.props.signalHost);
    }

    render(): JSX.Element {
        return (
            <div className="video">
                <video id={VideoPage.VIDEO_ID} src={this.props.videoSource} poster="../../../../src/data/heart.gif" type="video/mp4" width="100%" controls></video>
            </div>
        );
    }

    componentDidMount() {
        console.log("video mounted");
    }

    /**
     * Setup the socketIO connection and the signalling
     */
    protected abstract connect();
}
