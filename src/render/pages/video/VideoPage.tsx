import * as React from "react";
import * as SimplePeer from "simple-peer";
import * as SocketIO from "socket.io-client";

import * as Exception from "../../../common/Exceptions";

export interface IOfferMessage {
    hostID: string;
    clientID: string;
    signalData: SimplePeer.SignalData;
}

export interface IResponseMessage {
    clientID: string;
    signalData: SimplePeer.SignalData;
}

export interface IVideoInputProps {
    videoSource: string;
}

export interface IVideoStoreProps {
    id?: string;
}

export type IVideoProps = IVideoInputProps & IVideoStoreProps;

export abstract class VideoPage<P extends IVideoProps> extends React.Component<P, {}> {
    protected socket: SocketIOClient.Socket;

    private videoElement: HTMLMediaElement;

    constructor(props) {
        super(props);

        // Initiate socket
        // this.socket = SocketIO.connect(this.props.signalHost);
    }

    /********************* Methods ***********************/

    public getVideo = (): HTMLMediaElement => {
        return this.videoElement;
    }

    private setVideo = (video: HTMLVideoElement) => {
        this.videoElement = video;
    }

    /********************* React Lifecycle ***********************/

    protected componentDidMount() {
        console.log("video mounted");
    }

    public render(): JSX.Element {
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
