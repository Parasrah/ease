import * as React from "react";
import * as SimplePeer from "simple-peer";
import * as SocketIO from "socket.io-client";

import * as Exception from "../../../common/Exceptions";
import { watchServerStatusAction, setVideoReadyAction } from "../../redux/Actions";
import { EaseVideoElement } from "../../components/EaseVideoElement";

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
    poster: string;
}

export interface IVideoStoreProps {
    readonly id?: string;
    readonly signalHost?: string;
    readonly videoReady?: boolean;
    readonly serverStatus?: boolean;
}

export interface IVideoDispatchProps {
    readonly watchServerStatus?: watchServerStatusAction;
    readonly setVideoReady?: setVideoReadyAction;
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
                <EaseVideoElement poster={this.props.poster} videoSource={this.props.videoSource} setVideo={this.setVideo} />
            </div>
        );
    }
}
