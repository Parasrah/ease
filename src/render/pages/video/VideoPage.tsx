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
    readonly id?: string;
    readonly signalHost?: string;
    readonly videoReady?: boolean;
}

export interface IVideoDispatchProps {
    readonly watchServerStatus?: (socket: SocketIOClient.Socket) => void;
    readonly setVideoReady?: (videoReady: boolean) => void;
}

export type IVideoProps = IVideoInputProps & IVideoStoreProps & IVideoDispatchProps;

export abstract class VideoPage<P extends IVideoProps> extends React.Component<P, {}> {
    protected socket: SocketIOClient.Socket;

    private videoElement: HTMLMediaElement;

    constructor(props) {
        super(props);

        this.socket = SocketIO.connect(this.props.signalHost);
        this.props.watchServerStatus(this.socket);
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
