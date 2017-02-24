import * as SimplePeer from "simple-peer";
import { connect } from "react-redux";

import IState from "../../redux/State";
import { watchServerStatus, setVideoReady, createPeer, addSignalData, clearSignalData } from "../../redux/Actions";
import { IPeer } from "../../redux/Definitions";
import { IOfferMessage, IResponseMessage, IVideoInputProps, IVideoStoreProps, IVideoDispatchProps, VideoPage  } from "./VideoPage";

interface IInitMessage {
    id: string;
}

interface IHostInputProps extends IVideoInputProps {

}

interface IHostStoreProps extends IVideoStoreProps {
    readonly serverStatus?: boolean;
    readonly hostPeers?: IPeer[];
}

interface IHostDispatchProps extends IVideoDispatchProps {
    readonly createPeer?: createPeer;
    readonly addSignalData?: addSignalData;
    readonly clearSignalData?: clearSignalData;
}

type IHostProps = IHostInputProps & IHostStoreProps & IHostDispatchProps;

export class VideoHostPage extends VideoPage<IHostProps> {
    private peers: SimplePeer.Instance[];
    private stream: any;

    constructor(props) {
        super(props);

        this.peers = [];
        this.stream = null;
        this.socket.on("offer", this.dealWithOffer);
    }

    /********************* Methods ***********************/

    public discover = () => {
        this.socket.emit("discover", {
            id: this.props.id,
        });
    }

    private dealWithOffer = (offer: IOfferMessage) => {
        let storePeerExists = false;
        let storePeer: IPeer = null;
        this.props.hostPeers.forEach((peer) => {
            if (peer.id === offer.clientID) {
                storePeerExists = true;
                storePeer = peer;
                if (!this.props.videoReady || !this.props.serverStatus) {
                    this.props.addSignalData(offer.clientID, offer.signalData);
                }
            }
        });

        if (!storePeerExists) {
            this.props.createPeer(
                offer.clientID,
                (this.props.videoReady && this.props.serverStatus) ? [] : offer.signalData,
            );
        }

        if (!this.peers[offer.clientID] && this.props.videoReady && this.props.serverStatus) {
            this.peers[offer.clientID] = this.createPeer(offer.clientID, storePeer.signalData.concat(offer.signalData));
            this.props.clearSignalData(offer.clientID);
        }

        else if (this.peers[offer.clientID] && this.props.videoReady && this.props.serverStatus) {
            this.peers[offer.clientID].signal(offer.signalData);
        }
    }

    private createPeer = (clientID: string, ...offerData: SimplePeer.SignalData[]): SimplePeer.Instance => {
        const peer = new SimplePeer({
            initiator: false,
            stream: this.stream,
            trickle: true,
        });

        peer.on("signal", (signalData: SimplePeer.SignalData) => {
            this.respond(clientID, signalData);
        });

        for (const data of offerData) {
            peer.signal(data);
        }

        return peer;
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

        // See if signal data can be used
        nextProps.hostPeers.forEach((storePeer) => {
            if (this.peers[storePeer.id]) {
                if (storePeer.signalData.length > 0) {
                    for (const data of storePeer.signalData) {
                        this.peers[storePeer.id].signal(data);
                    }
                    nextProps.clearSignalData(storePeer.id);
                }
            }
            else if (storePeer.signalData.length > 0 && this.props.videoReady) {
                this.peers[storePeer.id] = this.createPeer(storePeer.id, storePeer.signalData);
                nextProps.clearSignalData(storePeer.id);
            }
        });
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
            hostPeers: state.peerState.hostPeers,
        });
    }

    public static mapDispatchToProps = (dispatch): IHostDispatchProps => {
        return {
            watchServerStatus: (socket) => dispatch(watchServerStatus(socket)),
            setVideoReady: (videoReady) => dispatch(setVideoReady(videoReady)),
            createPeer: (id, ...signalData) => dispatch(createPeer(id, signalData)),
            addSignalData: (id, signalData) => dispatch(addSignalData(id, signalData)),
            clearSignalData: (id) => dispatch(clearSignalData(id)),
        };
    }
}

const VideoHostPageContainer = connect(
    VideoHostPage.mapStateToProps,
)(VideoHostPage);

export default VideoHostPageContainer;
