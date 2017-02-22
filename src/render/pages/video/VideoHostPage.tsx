import * as SimplePeer from "simple-peer";
import { connect } from "react-redux";

import IState from "../../redux/State";
import { watchServerStatus, setVideoReady } from "../../redux/Actions";
import { IOfferMessage, IResponseMessage, IVideoInputProps, IVideoStoreProps, IVideoDispatchProps, VideoPage  } from "./VideoPage";

interface IInitMessage {
    id: string;
}

interface IExtendedPeer extends SimplePeer.Instance {
    clientID: string;
}

interface IHostInputProps extends IVideoInputProps {

}

interface IHostStoreProps extends IVideoStoreProps {
    serverStatus?: boolean;
}

interface IHostDispatchProps extends IVideoDispatchProps {

}

type IHostProps = IHostInputProps & IHostStoreProps & IHostDispatchProps;

export class VideoHostPage extends VideoPage<IHostProps> {
    private peers: IExtendedPeer[];
    private stream: any;

    constructor(props) {
        super(props);

        this.socket.on("offer", this.dealWithOffer);
        this.peers = [];
        this.stream = null;
    }

    /********************* Methods ***********************/

    public discover = () => {
        this.socket.emit("discover", {
            id: this.props.id,
        });
    }

    private dealWithOffer = (offer: IOfferMessage) => {
        // TODO create peer in store

        // TODO if server not connected, add signal data to store

        // TODO if server connected & peer doesn't exist, create a peer

        // TODO if server connected & peer does exist, signal that peer
    }

    private createPeer = (clientID: string, ...offerData: SimplePeer.SignalData[]): IExtendedPeer => {
        const peer = new SimplePeer({
            initiator: false,
            stream: this.stream,
            trickle: true,
        });

        const extendedPeer = Object.defineProperty(peer, "clientID", clientID);
        extendedPeer.on("signal", (signalData: SimplePeer.SignalData) => {
            this.respond(clientID, signalData);
        });
        return extendedPeer;
    }

    private respond = (clientID: string, signalData: SimplePeer.SignalData) => {
        const responseMessage: IResponseMessage = {
            signalData,
            clientID,
        };
        this.socket.emit("respond", responseMessage);
    }

    /********************* React Lifecycle ***********************/

    protected componentWillRecieveProps(nextProps: IHostProps) {
        if (!this.props.serverStatus && nextProps.serverStatus) {
            this.discover();
        }
    }

    protected componentDidMount() {
        super.componentDidMount();

        // Initialize peer from video stream (must be called before VideoPage setup)
        const video: any = this.getVideo();
        video.onplay = () => {
            this.stream = video.captureStream();
            this.props.setVideoReady(true);
        };
    }

    /*********************** Redux ***************************/

    public static mapStateToProps = (state: IState, ownProps: IHostInputProps): IHostStoreProps & IHostInputProps => {
        return Object.assign({}, ownProps, {
            id: state.peerState.id,
            signalHost: state.settingsState.signalHost,
            serverStatus: state.peerState.serverStatus,
            videoReady: state.videoState.videoReady,
        });
    }

    public static mapDispatchToProps = (dispatch): IHostDispatchProps => {
        return {
            watchServerStatus: (socket) => dispatch(watchServerStatus(socket)),
            setVideoReady: (videoReady) => dispatch(setVideoReady(videoReady)),
        };
    }
}

const VideoHostPageContainer = connect(
    VideoHostPage.mapStateToProps,
)(VideoHostPage);

export default VideoHostPageContainer;
