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
    videoSource: any;
    signalHost: string;
    name: string;
    id: string;
}

export abstract class VideoPage<P extends VideoPageProps> extends React.Component<P, {}> {
    peer: SimplePeer.Instance;
    socket: SocketIOClient.Socket;

    constructor(initiator: boolean) {
        super();

        // Initiate peer
        this.peer = new SimplePeer({ initiator: initiator });

        // Initiate socket
        this.socket = SocketIO.connect(this.props.signalHost);
    }

    render(): JSX.Element {
        return (
            <div className="video">
                <video src={this.props.videoSource} poster="../../../../src/data/heart.gif" type="video/mp4" width="100%" controls></video>
            </div>
        );
    }

    componentDidMount() {
        console.log("video mounted");

        // Connect to host/client
        this.connect();
    }

    protected abstract connect();
}
