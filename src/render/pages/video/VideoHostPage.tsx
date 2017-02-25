import * as SimplePeer from "simple-peer";
import { connect } from "react-redux";

import IState from "../../redux/State";
import { watchServerStatus, setVideoReady, createPeer, addClientSignalData, clearSignalData, addHostSignalData } from "../../redux/Actions";
import { IPeer } from "../../redux/Definitions";
import { IOfferMessage, IResponseMessage, IVideoInputProps, IVideoStoreProps, IVideoDispatchProps, VideoPage  } from "./VideoPage";

interface IInitMessage {
    id: string;
}

interface IHostInputProps extends IVideoInputProps {

}

interface IHostStoreProps extends IVideoStoreProps {
    readonly hostPeers?: IPeer[];
}

interface IHostDispatchProps extends IVideoDispatchProps {
    readonly createPeer?: createPeer;
    readonly addClientSignalData?: addClientSignalData;
    readonly addHostSignalData?: addHostSignalData;
    readonly clearSignalData?: clearSignalData;
}

type IHostProps = IHostInputProps & IHostStoreProps & IHostDispatchProps;

export class VideoHostPage extends VideoPage<IHostProps> {
    private peers: SimplePeer.Instance[];
    private stream: any;
    private initialPlay: boolean;

    constructor(props) {
        super(props);

        this.peers = [];
        this.stream = null;
        this.socket.on("offer", this.dealWithOffer);
        this.initialPlay = true;
    }

    /********************* Methods ***********************/

    public discover = () => {
        const initMessage: IInitMessage = {
            id: this.props.id,
        };
        console.log("Emitting to 'discover': " + JSON.stringify(initMessage));
        this.socket.emit("discover", JSON.stringify(initMessage));
    }

    private dealWithOffer = (message: string) => {
        const offer: IOfferMessage = JSON.parse(message);
        console.log("Offer:\n" + JSON.stringify(offer.signalData));
        let storePeerExists = false;
        let storePeer: IPeer = null;
        this.props.hostPeers.forEach((peer) => {
            if (peer.clientID === offer.clientID) {
                storePeerExists = true;
                storePeer = peer;
                if (!this.props.videoReady || !this.props.serverStatus) {
                    this.props.addClientSignalData(offer.clientID, offer.signalData);
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
            this.peers[offer.clientID] = this.createPeer(offer.clientID, storePeer.clientSignalData.concat(offer.signalData));
            this.props.clearSignalData(offer.clientID);
        }

        else if (this.peers[offer.clientID] && this.props.videoReady && this.props.serverStatus) {
            this.peers[offer.clientID].signal(offer.signalData[0]);
        }
    }

    private createPeer = (clientID: string, ...offerData: SimplePeer.SignalData[]): SimplePeer.Instance => {
        const peer = new SimplePeer({
            initiator: false,
            stream: this.stream,
            trickle: true,
        });

        peer.on("signal", (signalData: SimplePeer.SignalData) => {
            this.tryToRespond(clientID, signalData);
        });

        for (const data of offerData) {
            peer.signal(data);
        }

        return peer;
    }

    private tryToRespond = (clientID: string, signalData: SimplePeer.SignalData) => {
        if (this.props.serverStatus) {
            this.respond(clientID, signalData);
        }
        else {
            // Put into the store
            this.props.addHostSignalData(clientID, signalData);
        }
    }

    private respond = (clientID: string, signalData: SimplePeer.SignalData) => {
        const responseMessage: IResponseMessage = {
            signalData,
            clientID,
        };
        this.socket.emit("respond", responseMessage);
    }

    /********************* React Lifecycle ***********************/

    protected componentWillReceiveProps(nextProps: IHostProps) {
        if (!this.props.serverStatus && nextProps.serverStatus) {
            this.discover();
        }

        // See if client signal data can be used (waiting for video or server)
        nextProps.hostPeers.forEach((storePeer) => {
            if (this.peers[storePeer.clientID]) {
                if (storePeer.clientSignalData.length > 0) {
                    for (const data of storePeer.clientSignalData) {
                        this.peers[storePeer.clientID].signal(data); // TODO investigate this
                    }
                    nextProps.clearSignalData(storePeer.clientID);
                }
            }
            else if (storePeer.clientSignalData.length > 0 && this.props.videoReady) {
                this.peers[storePeer.clientID] = this.createPeer(storePeer.clientID, storePeer.clientSignalData);
                nextProps.clearSignalData(storePeer.clientID);
            }
        });

        // See if host signal data can be used (waiting on server)
        if (this.props.serverStatus) {
            nextProps.hostPeers.forEach((storePeer) => {
                for (const data of storePeer.hostSignalData) {
                    this.respond(storePeer.clientID, data);
                }
            });
        }
    }

    protected componentDidMount() {
        super.componentDidMount();

        // Initialize peer from video stream (must be called before VideoPage setup)
        const video: HTMLMediaElement = this.getVideo();
        video.onplay = () => {
            if (this.initialPlay) {
                video.pause();
                this.stream = (video as any).captureStream();
                this.props.setVideoReady(true);
                this.initialPlay = false;
            }
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
            addClientSignalData: (clientID, signalData) => dispatch(addClientSignalData(clientID, signalData)),
            addHostSignalData: (clientID, signalData) => dispatch(addHostSignalData(clientID, signalData)),
            clearSignalData: (id) => dispatch(clearSignalData(id)),
        };
    }
}

const VideoHostPageContainer = connect(
    VideoHostPage.mapStateToProps,
    VideoHostPage.mapDispatchToProps,
)(VideoHostPage);

export default VideoHostPageContainer;
