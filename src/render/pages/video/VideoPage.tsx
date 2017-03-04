import * as React from "react";
import * as SimplePeer from "simple-peer";
import * as SocketIO from "socket.io-client";

import { watchServerStatusAction } from "../../actions/CommonPeerActions";
import { setPlayStatusAction, setVideoReadyAction } from "../../actions/VideoActions";
import { VideoElement } from "../../components/VideoElement";
import "../../style/video.less";

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
    readonly play: boolean;
}

export interface IVideoDispatchProps {
    readonly watchServerStatusDispatch: watchServerStatusAction;
    readonly setVideoReadyDispatch: setVideoReadyAction;
    readonly setPlayStatusDispatch: setPlayStatusAction;
}

export interface IVideoState {
    time: number;
    volume: number;
    muted: boolean;
    duration: number;
    show: boolean;
}

export type IVideoProps = IVideoInputProps & IVideoStoreProps & IVideoDispatchProps;

export abstract class VideoPage<P extends IVideoProps> extends React.Component<P, IVideoState> {
    private readonly SHOW_CONTROLS_TIME = 5000;

    protected socket: SocketIOClient.Socket;
    protected video: HTMLVideoElement;
    protected videoWrapper: HTMLDivElement;
    protected timer: number;

    constructor(props) {
        super(props);

        this.state = {
            time: 0,
            volume: 100,
            muted: false,
            duration: 100,
            show: true,
        };

        this.props.watchServerStatusDispatch(this.socket);
    }

    /************************ Methods ************************/

    protected setTime = (time: number) => {
        let check = time;
        if (check > this.state.duration) {
            check = this.state.duration;
        }
        else if (check < 0) {
            check = 0;
        }
        this.setState({
            time: check,
        });
    }

    protected setVolume = (volume: number) => {
        let check = volume;
        if (check > 100) {
            check = 100;
        }
        else if (check < 0) {
            check = 0;
        }
        this.setState({
            volume: check,
        });
    }

    private toggleFullscreen = () => {
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

    private toggleVolume = () => {
        this.setState({
            muted: !this.state.muted,
        });
    }

    private onMouseMove = () => {
        this.showControls();
        if (this.timer) {
            window.clearTimeout(this.timer);
        }
        this.timer = window.setTimeout(this.hideControls, this.SHOW_CONTROLS_TIME);
    }

    private onVideoWheel = (event: React.WheelEvent<HTMLVideoElement>) => {
        const newVolume = this.state.volume + ((event.deltaY > 0) ? -5 : 5);
        this.setVolume(newVolume);
    }

    private showControls = () => {
        this.setState({
            show: true,
        });
    }

    private hideControls = () => {
        this.setState({
            show: false,
        });
    }

    private setupVideoShortcuts = () => {
        window.addEventListener("keydown", (event: KeyboardEvent) => {
            switch (event.keyCode) {
                case 32: // space
                    this.togglePlay();
                    break;

                case 122: // F11
                    event.preventDefault();
                    this.toggleFullscreen();
                    break;

                case 37:
                    event.preventDefault();
                    this.seek(this.state.time - 10);
                    break;

                case 39:
                    this.seek(this.state.time + 10);
                    break;

                default:
            }
        });
    }

    /******************** Abstract Methods *******************/

    protected abstract togglePlay: () => void;
    protected abstract onCastButton: () => void;
    protected abstract seek: (time: number) => void;

    /********************* React Lifecycle *******************/

    protected componentDidMount() {
        this.setupVideoShortcuts();
    }

    protected componentWillUpdate(nextProps: IVideoProps, nextState: IVideoState) {
        this.video.volume = nextState.muted ? 0 : (nextState.volume / 100);
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
                    onPlayPauseButton={this.togglePlay}
                    onVolumeButton={this.toggleVolume}
                    onCastButton={this.onCastButton}
                    onFullscreenButton={this.toggleFullscreen}
                    onSeek={this.seek}
                    onVolumeChange={this.setVolume}
                    duration={this.state.duration}
                    time={this.state.time}
                    volume={this.state.volume}
                    play={this.props.play}
                    show={this.state.show}
                    onMouseMove={this.onMouseMove}
                    onVideoWheel={this.onVideoWheel}
                    onVideoClick={this.togglePlay}
                />
            </div>
        );
    }
}
