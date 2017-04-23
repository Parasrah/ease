import * as React from "react";
import { IconButton, Spinner } from "react-mdl";
import { connect } from "react-redux";

import { setPlayStatusAction, setVideoReadyAction } from "../../../actions/VideoActions";
import { ClientPeerManager } from "../../../peer/ClientPeerManager";
import { ClientMessenger } from "../../../peer/communications/ClientMessenger";
import { ClientReceiver } from "../../../peer/communications/ClientReceiver";
import { HostMessageType, IDurationMessage, IPlayMessage, ITimeMessage } from "../../../peer/messages/ControlMessage";
import IState from "../../../redux/State";
import { UserType } from "../../../utils/Definitions";
import { VideoElement } from "../../components/VideoElement";
import { IVideoDispatchProps, IVideoInputProps, IVideoStoreProps, VideoPage } from "./VideoPage";

interface IClientInputProps extends IVideoInputProps {

}

interface IClientStoreProps extends IVideoStoreProps {
    readonly peerStatus: boolean;
}

interface IClientDispatchProps extends IVideoDispatchProps {

}

type IClientProps = IClientInputProps & IClientStoreProps & IClientDispatchProps;

export class VideoClientPage extends VideoPage<IClientProps> {
    private peerManager: ClientPeerManager;
    private messenger: ClientMessenger;
    private receiver: ClientReceiver;

    constructor(props) {
        super(props, false);

        // Bindings
        this.stream = this.stream.bind(this);

        // Initialization
        this.type = UserType.CLIENT;
        this.peerManager = new ClientPeerManager();
        this.messenger = this.peerManager.getMessenger();
        this.receiver = this.peerManager.getReceiver();
    }

    private setupReceiver() {
        this.receiver.on(HostMessageType.DURATION, (message: IDurationMessage) => {
            this.setState({
                duration: message.duration,
            });
        });

        this.receiver.on(HostMessageType.TIME, (message: ITimeMessage) => {
            this.setTime(message.time);
        });

        this.receiver.on(HostMessageType.PLAY, (message: IPlayMessage) => {
            this.props.setPlayStatusDispatch(message.play);
        });
    }

    /********************* Methods ***********************/

    /**
     * @this {@link VideoClientPage}
     */
    private stream(stream: MediaStream) {
        this.video.srcObject = stream;
        this.video.play();
        this.showVideo();
    }

    private showVideo() {
        this.setState({
            showVideo: true,
        });
    }

    /********************* Video Listeners ***********************/

    /**
     * @this {@link VideoClientPage}
     */
    protected togglePlay() {
        if (this.props.peerStatus) {
            this.messenger.sendPlayPauseMessage();
        }
    }

    /**
     * @this {@link VideoClientPage}
     */
    protected onCastButton() {
        // PENDING
    }

    /**
     * @this {@link VideoClientPage}
     */
    protected seek(time: number) {
        if (this.props.peerStatus) {
            this.messenger.sendSeekMessage(time);
        }
    }

    /********************* React Lifecycle ***********************/

    protected componentDidMount() {
        super.componentDidMount();
        this.peerManager.onStream(this.stream);
        this.setupReceiver();
    }

    protected componentDidUpdate() {
        this.watchVideoSize();
    }

    public render(): JSX.Element {
        return (
            <div className="video">
                {
                    !this.state.showVideo && (
                        <div className="spinner-wrapper">
                            <Spinner className="spinner"/>
                            <IconButton
                                className="spinner-reconnect"
                                name="cached"
                                onClick={this.peerManager.reconnect}
                            />
                        </div>
                    )
                }
                <VideoElement
                    poster=""
                    videoSource=""
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
                    hidden={!this.state.showVideo}
                    onMouseMove={this.onMouseMove}
                    onVideoWheel={this.onVideoWheel}
                    onVideoClick={this.togglePlay}
                    showControls={this.state.showControls}
                    onReconnectButton={this.peerManager.reconnect}
                />
            </div>
        );
    }

    /*********************** Redux ***************************/

    public static mapStateToProps = (state: IState, ownProps: IClientInputProps): IClientStoreProps & IClientInputProps => {
        return Object.assign({}, ownProps, {
            id: state.commonPeerState.id,
            videoReady: state.videoState.videoReady,
            peerStatus: state.clientPeerState.peerStatus,
            fullscreen: state.videoState.fullscreen,
            play: state.videoState.play,
            maximized: state.windowState.maximized,
        });
    }

    public static mapDispatchToProps = (dispatch): IClientDispatchProps => {
        return {
            setVideoReadyDispatch: (videoReady) => dispatch(setVideoReadyAction(videoReady)),
            setPlayStatusDispatch: (play) => dispatch(setPlayStatusAction(play)),
        };
    }
}

const VideoClientPageContainer = connect(
    VideoClientPage.mapStateToProps,
    VideoClientPage.mapDispatchToProps,
)(VideoClientPage);

export default VideoClientPageContainer;
