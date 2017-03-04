import { connect } from "react-redux";

import { setPlayStatusAction, setVideoReadyAction } from "../../actions/VideoActions";
import { HostMessenger } from "../../communications/HostMessenger";
import { HostReceiver } from "../../communications/HostReceiver";
import { ClientMessageType, ISeekMessage } from "../../messages/ControlMessage";
import IState from "../../redux/State";
import { IVideoDispatchProps, IVideoInputProps, IVideoState, IVideoStoreProps, VideoPage } from "./VideoPage";
import { HostSignal } from "../../signaling/HostSignal";

interface IHostInputProps extends IVideoInputProps {

}

interface IHostStoreProps extends IVideoStoreProps {

}

interface IHostDispatchProps extends IVideoDispatchProps {

}

type IHostProps = IHostInputProps & IHostStoreProps & IHostDispatchProps;

export class VideoHostPage extends VideoPage<IHostProps> {
    private initialPlay: boolean;
    private hostReceiver: HostReceiver;
    private hostMessenger: HostMessenger;
    private hostSignal: HostSignal;

    constructor(props) {
        super(props);
        this.hostMessenger = new HostMessenger();
        this.hostReceiver = new HostReceiver();
        this.hostSignal = new HostSignal(this.hostMessenger, this.hostReceiver);
        this.initialPlay = true;
    }

    /************************ Methods ****************************/

    private setupVideo = (video: HTMLVideoElement) => {

        video.addEventListener("durationchange", () => {
            this.setState({
                duration: video.duration,
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
                this.hostSignal.registerStream((video as any).captureStream());
                this.props.setVideoReadyDispatch(true);
                this.setupMessenger();
                this.initialPlay = false;
            }
            this.props.setPlayStatusDispatch(true);
        });
    }

    private setupMessenger = () => {
        this.hostReceiver.on(ClientMessageType.PLAY_PAUSE, () => {
            this.toggleVideo();
        });

        this.hostReceiver.on(ClientMessageType.SEEK, (message: ISeekMessage) => {
            this.video.currentTime = message.time;
        });
    }

    private toggleVideo = () => {
        this.video.paused ? this.video.play() : this.video.pause();
    }

    /********************* Video Listeners ***********************/

    protected togglePlay = () => {
        this.toggleVideo();
    }

    protected onCastButton = () => {
        // TODO
    }

    protected seek = (time: number) => {
        this.video.currentTime = time;
    }

    /********************* React Lifecycle ***********************/

    protected componentWillUpdate(nextProps: IHostProps, nextState: IVideoState) {
        super.componentWillUpdate(nextProps, nextState);

        if (this.state.time !== nextState.time) {
            this.hostMessenger.publishTime(nextState.time);
        }

        if (this.state.duration !== nextState.duration) {
            this.hostMessenger.publishDuration(nextState.duration);
        }

        if (this.props.play !== nextProps.play) {
            this.hostMessenger.publishPlay(nextProps.play);
        }
    }

    protected componentDidMount() {
        super.componentDidMount();

        this.setupVideo(this.video);
    }

    /*********************** Redux *******************************/

    public static mapStateToProps = (state: IState, ownProps: IHostInputProps): IHostStoreProps & IHostInputProps => {
        return Object.assign({}, ownProps, {
            id: state.commonPeerState.id,
            videoReady: state.videoState.videoReady,
            fullscreen: state.videoState.fullscreen,
            play: state.videoState.play,
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
