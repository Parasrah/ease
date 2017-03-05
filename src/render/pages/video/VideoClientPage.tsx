import { connect } from "react-redux";
import * as SimplePeer from "simple-peer";

import { clearOfferDataAction, storeOfferDataAction, watchPeerStatusAction } from "../../actions/ClientPeerActions";
import { watchServerStatusAction } from "../../actions/CommonPeerActions";
import { setPlayStatusAction, setVideoReadyAction } from "../../actions/VideoActions";
import ClientMessenger from "../../communications/ClientMessenger";
import ClientReceiver from "../../communications/ClientReceiver";
import { HostMessageType, IDurationMessage, IPlayMessage, ITimeMessage } from "../../messages/ControlMessage";
import IState from "../../redux/State";
import { IOfferMessage, IResponseMessage, IVideoDispatchProps, IVideoInputProps, IVideoStoreProps, VideoPage } from "./VideoPage";

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
