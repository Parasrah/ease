import * as React from "react";
import { connect } from "react-redux";

import { setPlayStatusAction, setVideoReadyAction } from "../../actions/VideoActions";
import { ClientMessenger } from "../../communications/ClientMessenger";
import { ClientReceiver } from "../../communications/ClientReceiver";
import { VideoElement } from "../../components/VideoElement";
import { HostMessageType, IDurationMessage, IPlayMessage, ITimeMessage } from "../../messages/ControlMessage";
import { ClientPeerManager } from "../../peer/ClientPeerManager";
import IState from "../../redux/State";
import { UserType } from "../../utils/Definitions";
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
        super(props);
        this.type = UserType.CLIENT;
        this.peerManager = new ClientPeerManager();
        this.messenger = this.peerManager.getMessenger();
        this.receiver = this.peerManager.getReceiver();
        this.peerManager.onStream(this.stream);
        this.setupReceiver();
    }

    private setupReceiver = () => {
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

    private stream = (stream: MediaStream) => {
        this.video.srcObject = stream;
        this.video.play();
    }

    /********************* Video Listeners ***********************/

    protected togglePlay = () => {
        if (this.props.peerStatus) {
            this.messenger.sendPlayPauseMessage();
        }
    }

    protected onCastButton = () => {
        // TODO
    }

    protected seek = (time: number) => {
        if (this.props.peerStatus) {
            this.messenger.sendSeekMessage(time);
        }
    }

    /********************* React Lifecycle ***********************/

    public render(): JSX.Element {
        return (
            <div className="video">
                <b> ID: </b> {this.props.id}
                <button onClick={this.copyClick}>copy</button>
                <button onClick={this.peerManager.reconnect}>reconnect</button>
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
                    show={this.state.show}
                    onMouseMove={this.onMouseMove}
                    onVideoWheel={this.onVideoWheel}
                    onVideoClick={this.togglePlay}
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
