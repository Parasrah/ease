import * as React from "react";
import { connect } from "react-redux";

import { setPlayStatusAction, setVideoReadyAction } from "../../../actions/VideoActions";
import { HostMessenger } from "../../../peer/communications/HostMessenger";
import { HostReceiver } from "../../../peer/communications/HostReceiver";
import { HostPeerManager } from "../../../peer/HostPeerManager";
import { ClientMessageType, ISeekMessage } from "../../../peer/messages/ControlMessage";
import IState from "../../../redux/State";
import { UserType } from "../../../utils/Definitions";
import { VideoElement } from "../../components/VideoElement";
import { IVideoDispatchProps, IVideoInputProps, IVideoState, IVideoStoreProps, VideoPage } from "./VideoPage";

interface IHostInputProps extends IVideoInputProps {
    videoSource: string;
}

interface IHostStoreProps extends IVideoStoreProps {

}

interface IHostDispatchProps extends IVideoDispatchProps {

}

type IHostProps = IHostInputProps & IHostStoreProps & IHostDispatchProps;

export class VideoHostPage extends VideoPage<IHostProps> {
    private initialPlay: boolean;
    private receiver: HostReceiver;
    private messenger: HostMessenger;
    private peerManager: HostPeerManager;

    constructor(props) {
        super(props, true);
        this.type = UserType.HOST;
        this.peerManager = new HostPeerManager();
        this.messenger = this.peerManager.getMessenger();
        this.receiver = this.peerManager.getReceiver();
        this.initialPlay = true;
    }

    /************************ Methods ****************************/

    private setupVideo(video: HTMLVideoElement) {

        video.addEventListener("durationchange", () => {
            this.setState(function(state) {
                return {
                    duration: video.duration,
                };
            });
        });

        video.addEventListener("timeupdate", () => {
            this.setTime(this.video.currentTime);
        });

        video.addEventListener("pause", () => {
            this.props.setPlayStatusDispatch(false);
        });

        video.addEventListener("play", () => {
            if (this.initialPlay) {
                video.pause();
                this.peerManager.registerStream((video as any).captureStream());
                this.props.setVideoReadyDispatch(true);
                this.setupMessenger();
                this.initialPlay = false;
            }
            this.props.setPlayStatusDispatch(true);
        });
    }

    private setupMessenger() {
        this.receiver.on(ClientMessageType.PLAY_PAUSE, () => {
            this.toggleVideo();
        });

        this.receiver.on(ClientMessageType.SEEK, (message: ISeekMessage) => {
            this.video.currentTime = message.time;
        });
    }

    private toggleVideo() {
        this.video.paused ? this.video.play() : this.video.pause();
    }

    /********************* Video Listeners ***********************/

    /**
     * @this {@link VideoHostPage}
     */
    protected togglePlay(): void {
        this.toggleVideo();
    }

    /**
     * @this {@link VideoHostPage}
     */
    protected onCastButton() {
        // PENDING
    }

    /**
     * @this {@link VideoHostPage}
     * @param time - time of video to seek to
     */
    protected seek(time: number) {
        this.video.currentTime = time;
    }

    /********************* React Lifecycle ***********************/

    protected componentWillUpdate(nextProps: IHostProps, nextState: IVideoState) {
        if (this.state.time !== nextState.time) {
            this.messenger.publishTime(nextState.time);
        }

        if (this.state.duration !== nextState.duration) {
            this.messenger.publishDuration(nextState.duration);
        }

        if (this.props.play !== nextProps.play) {
            this.messenger.publishPlay(nextProps.play);
        }
    }

    protected componentDidMount() {
        super.componentDidMount();
        this.watchVideoSize();
        this.setupVideo(this.video);
    }

    protected componentWillUnmount() {
        this.peerManager.close();
        super.componentWillUnmount();
    }

    public render(): JSX.Element {
        return (
            <div className="video">
                <VideoElement
                    poster=""
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
                    showControls={this.state.showControls}
                    onMouseMove={this.onMouseMove}
                    onVideoWheel={this.onVideoWheel}
                    onVideoClick={this.togglePlay}
                    onCopyButton={this.copyClick}
                    hidden={!this.state.showVideo}
                />
            </div>
        );
    }

    /*********************** Redux *******************************/

    public static mapStateToProps = (state: IState, ownProps: IHostInputProps): IHostStoreProps & IHostInputProps => {
        return Object.assign({}, ownProps, {
            id: state.commonPeerState.id,
            videoReady: state.videoState.videoReady,
            fullscreen: state.videoState.fullscreen,
            play: state.videoState.play,
            maximized: state.windowState.maximized,
        });
    }

    public static mapDispatchToProps = (dispatch): IHostDispatchProps => {
        return {
            setVideoReadyDispatch: (videoReady) => dispatch(setVideoReadyAction(videoReady)),
            setPlayStatusDispatch: (play) => dispatch(setPlayStatusAction(play)),
        };
    }
}

const VideoHostPageContainer = connect(
    VideoHostPage.mapStateToProps,
    VideoHostPage.mapDispatchToProps,
)(VideoHostPage);

export default VideoHostPageContainer;
