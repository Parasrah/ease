import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Electron from "electron";
import * as SimplePeer from "simple-peer";
import * as SocketIO from "socket.io-client";


export enum ConnectionType {
    HOST = 1,
    CLIENT = 2
}

interface User {
    name: string;
    password: string;
    type: ConnectionType;
    signal: any;
}

export interface VideoPageProps {
    videoPath: string;
    type: ConnectionType;
    signalHost: string;
    name: string;
    password: string;
}

export class VideoPage extends React.Component<VideoPageProps, {}> {
    peer: SimplePeer.Instance;
    socket: SocketIOClient.Socket;

    constructor() {
        super();


        // Initiate peer
        this.peer = new SimplePeer({
            initiator: this.props.type === ConnectionType.HOST ? true : false
        });


    }

    render(): JSX.Element {
        return (
            <div className="video">
                <video src={this.props.videoPath} type="video/mp4" width="100%" controls></video>
            </div>
        );
    }

    componentDidMount() {
        console.log("video mounted");
    }

    private connect() {
        // Setup to forward signalling data
        this.peer.on("signal", (data) => {
            // Setup user
            let user: User = {
                name: this.props.name,
                type: this.props.type,
                password: this.props.password,
                signal: data.signal
            };

            // Initiate socket
            this.socket = SocketIO.connect();
            this.socket.on("connect", () => {
                this.socket.emit("message", JSON.stringify(user));
                this.socket.on("response", (data) => {
                    this.peer.signal(data.signal);
                });
            });
        });
    }

}
