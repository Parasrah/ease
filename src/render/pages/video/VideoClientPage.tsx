import * as SimplePeer from "simple-peer";
import { connect } from "react-redux";

import IState from "../../redux/State";
import ClientMessenger from "../../Communications/ClientMessenger";
import ClientReceiver from "../../Communications/ClientReceiver";
import { HostMessageType, IDurationMessage, ITimeMessage, IPlayMessage } from "../../Messages/ControlMessage";
import { watchServerStatusAction } from "../../Actions/CommonPeerActions";
import { storeOfferDataAction, clearOfferDataAction, watchPeerStatusAction } from "../../Actions/ClientPeerActions";
import { setVideoReadyAction, setPlayStatusAction, setFullscreenAction } from "../../Actions/VideoActions";
import { IOfferMessage, IResponseMessage, IVideoInputProps, IVideoStoreProps, IVideoDispatchProps, VideoPage } from "./VideoPage";

interface IClientInputProps extends IVideoInputProps {

}

interface IClientStoreProps extends IVideoStoreProps {
    readonly hostID: string;
    readonly offerData: SimplePeer.SignalData[];
    readonly peerStatus: boolean;
}

interface IClientDispatchProps extends IVideoDispatchProps {
    readonly storeOfferDataDispatch: storeOfferDataAction;
    readonly clearOfferDataDispatch: clearOfferDataAction;
    readonly watchPeerStatusDispatch: watchPeerStatusAction;
}

type IClientProps = IClientInputProps & IClientStoreProps & IClientDispatchProps;

export class VideoClientPage extends VideoPage<IClientProps> {
    private peer: SimplePeer.Instance;
    private messenger: ClientMessenger;
    private receiver: ClientReceiver;

    constructor(props) {
        super(props);

        this.setupPeer();
    }

    /********************* Methods ***********************/

    private setupPeer = () => {
        this.peer = new SimplePeer({
            initiator: true,
            trickle: true,
            offerConstraints: {
                offerToReceiveVideo: true,
                offerToReceiveAudio: true,
            },
        });

        this.messenger = new ClientMessenger(this.peer);
        this.receiver = new ClientReceiver(this.peer);
        this.setupReceiver();

        this.props.watchPeerStatusDispatch(this.peer);

        this.peer.on("signal", this.dealWithSignal);

        this.socket.on("response", this.dealWithResponse);

        this.peer.on("stream", (stream) => {
            this.stream(stream);
        });
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
        })
    }

    private dealWithSignal = (signalData: SimplePeer.SignalData) => {
        if (!this.props.serverStatus) {
            this.props.storeOfferDataDispatch(signalData);
        }
        else {
            this.sendOffer(this.formOffer(signalData));
        }
    }

    private dealWithResponse = (responseMessage: IResponseMessage) => {
        if (responseMessage.clientID === this.props.id) {
            this.peer.signal(responseMessage.signalData);
        }
        else {
            console.log("Received response not intended for you!! Please open an issue on https://github.com/Right2Drive/ease/issues");
        }
    }

    private stream = (stream: MediaStream) => {
        this.video.srcObject = stream;
        this.video.play();
    }

    private formOffer = (data: SimplePeer.SignalData): IOfferMessage => {
        return {
            clientID: this.props.id,
            hostID: this.props.hostID,
            signalData: data,
        };
    }

    private sendOffer = (offerMessage: IOfferMessage) => {
        this.socket.emit("offer", offerMessage);
    }

    /********************* Video Listeners ***********************/

    protected onPlayPauseButton = () => {
        if (this.props.peerStatus) {
            this.messenger.sendPlayPauseMessage();
        }
    }

    protected onCastButton = () => {
        // TODO
    }

    protected onSeek = (time: number) => {
        if (this.props.peerStatus) {
            this.messenger.sendSeekMessage(time);
        }
    }

    /********************* React Lifecycle ***********************/

    protected componentWillReceiveProps(nextProps: IClientProps) {
        if (nextProps.serverStatus && nextProps.offerData.length > 0) {
            for (const signalData of nextProps.offerData) {
                this.sendOffer(this.formOffer(signalData));
            }
            this.props.clearOfferDataDispatch();
        }
    }

    /*********************** Redux ***************************/

    public static mapStateToProps = (state: IState, ownProps: IClientInputProps): IClientStoreProps & IClientInputProps => {
        return Object.assign({}, ownProps, {
            id: state.commonPeerState.id,
            hostID: state.clientPeerState.hostID,
            signalHost: state.settingsState.signalHost,
            videoReady: state.videoState.videoReady,
            offerData: state.clientPeerState.offerData,
            serverStatus: state.commonPeerState.serverStatus,
            peerStatus: state.clientPeerState.peerStatus,
            fullscreen: state.videoState.fullscreen,
            play: state.videoState.play,
        });
    }

    public static mapDispatchToProps = (dispatch): IClientDispatchProps => {
        return {
            watchServerStatusDispatch: (socket) => dispatch(watchServerStatusAction(socket)),
            setVideoReadyDispatch: (videoReady) => dispatch(setVideoReadyAction(videoReady)),
            storeOfferDataDispatch: (signalData) => dispatch(storeOfferDataAction(signalData)),
            clearOfferDataDispatch: () => dispatch(clearOfferDataAction()),
            watchPeerStatusDispatch: (peer) => dispatch(watchPeerStatusAction(peer)),
            setPlayStatusDispatch: (play) => dispatch(setPlayStatusAction(play)),
        };
    }
}

const VideoClientPageContainer = connect(
    VideoClientPage.mapStateToProps,
    VideoClientPage.mapDispatchToProps,
)(VideoClientPage);

export default VideoClientPageContainer;
