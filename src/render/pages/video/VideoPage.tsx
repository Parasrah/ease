import * as React from "react";
import * as SimplePeer from "simple-peer";
import * as SocketIO from "socket.io-client";

import * as Exception from "../../../common/Exceptions";
import { watchServerStatusAction } from "../../Actions/CommonPeerActions";
import { setVideoReadyAction, setPlayStatusAction, setFullscreenAction } from "../../Actions/VideoActions";
import { VideoElement } from "../../components/VideoElement";
import { shouldUpdate } from "../../utils/ComponentUtils";

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
    readonly id: string;
    readonly signalHost: string;
    readonly videoReady: boolean;
    readonly serverStatus: boolean;
    readonly fullscreen: boolean;
}

export interface IVideoDispatchProps {
    readonly watchServerStatusDispatch: watchServerStatusAction;
    readonly setVideoReadyDispatch: setVideoReadyAction;
    readonly setPlayStatusDispatch: setPlayStatusAction;
}

export interface IVideoState {
    time: number;
    volume: number;
}

export type IVideoProps = IVideoInputProps & IVideoStoreProps & IVideoDispatchProps;

export abstract class VideoPage<P extends IVideoProps> extends React.Component<P, IVideoState> {
    protected socket: SocketIOClient.Socket;
    protected max: number;
    protected video: HTMLVideoElement;
    protected videoWrapper: HTMLDivElement;

    constructor(props) {
        super(props);

        this.state = {
            time: 0,
            volume: 1,
        };

        this.socket = SocketIO.connect(this.props.signalHost);
        this.props.watchServerStatusDispatch(this.socket);
    }

    /************************ Methods ************************/

    protected setTime = (time: number) => {
        this.setState({
            time,
        });
    }

    protected setVolume = (volume: number) => {
        this.setState({
            volume,
        });
    }

    private onFullscreenButton = () => {
        if (document.webkitIsFullScreen) {
            document.webkitExitFullscreen();
        } else {
            this.videoWrapper.webkitRequestFullscreen();
        }
    }

    private setVideo = (video: HTMLVideoElement) => {
        this.video = video;
    }

    private setVideoWrapper = (videoWrapper: HTMLDivElement) => {
        this.videoWrapper = videoWrapper;
    }

    /******************** Abstract Methods *******************/

    protected abstract onPlayPauseButton: () => void;
    protected abstract onVolumeButton: () => void;
    protected abstract onCastButton: () => void;
    protected abstract onSeek: (time: number) => void;

    /********************* React Lifecycle *******************/

    protected componentDidMount() {
        console.log("video mounted");
    }

    protected componentWillUpdate(nextProps: IVideoProps, nextState: IVideoState) {
        this.video.volume = nextState.volume;
    }

    public render(): JSX.Element {
        return (
            <div className="video">
                <b> ID: </b> {this.props.id}
                <VideoElement
                    poster={this.props.poster}
                    videoSource={this.props.videoSource}
                    setVideo={this.setVideo}
                    setVideoWrapper={this.setVideoWrapper}
                    onPlayPauseButton={this.onPlayPauseButton}
                    onVolumeButton={this.onVolumeButton}
                    onCastButton={this.onCastButton}
                    onFullscreenButton={this.onFullscreenButton}
                    onSeek={this.onSeek}
                    onVolumeChange={this.setVolume}
                    max={this.max}
                    time={this.state.time}
                    volume={this.state.volume}
                />
            </div>
        );
    }
}
