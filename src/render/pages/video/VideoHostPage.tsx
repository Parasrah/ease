import { connect } from "react-redux";
import * as SimplePeer from "simple-peer";

import { watchServerStatusAction } from "../../actions/CommonPeerActions";
import { addClientSignalDataAction, addHostSignalDataAction, clearSignalDataAction, createPeerAction, setPeerStatusAction } from "../../actions/HostPeerActions";
import { setPlayStatusAction, setVideoReadyAction } from "../../actions/VideoActions";
import HostMessenger from "../../communications/HostMessenger";
import HostReceiver from "../../communications/HostReceiver";
import { ClientMessageType, ISeekMessage } from "../../messages/ControlMessage";
import IState from "../../redux/State";
import { shouldUpdate } from "../../utils/ComponentUtils";
import { IPeer } from "../../utils/Definitions";
import { IVideoDispatchProps, IVideoInputProps, IVideoState, IVideoStoreProps, VideoPage  } from "./VideoPage";

interface IInitMessage {
    id: string;
}

interface IHostInputProps extends IVideoInputProps {

}

interface IHostStoreProps extends IVideoStoreProps {
    readonly hostPeers: IPeer[];
}

interface IHostDispatchProps extends IVideoDispatchProps {
    readonly createPeerDispatch: createPeerAction;
    readonly addClientSignalDataDispatch: addClientSignalDataAction;
    readonly addHostSignalDataDispatch: addHostSignalDataAction;
    readonly clearSignalDataDispatch: clearSignalDataAction;
    readonly setPeerStatusDispatch: setPeerStatusAction;
}

type IHostProps = IHostInputProps & IHostStoreProps & IHostDispatchProps;

export class VideoHostPage extends VideoPage<IHostProps> {
    private peers: SimplePeer.Instance[];
    private stream: any;
    private initialPlay: boolean;
    private hostReceiver: HostReceiver;
    private hostMessenger: HostMessenger;

    constructor(props) {
        super(props);

        this.hostMessenger = new HostMessenger();
        this.hostReceiver = new HostReceiver();
        this.peers = [];
        this.stream = null;
        this.socket.on("offer", this.dealWithOffer);
        this.initialPlay = true;
    }

    /************************ Methods ****************************/

    public discover = () => {
        const initMessage: IInitMessage = {
            id: this.props.id,
        };
        this.socket.emit("discover", initMessage);
    }

    private dealWithOffer = (offer: IOfferMessage) => {
        let storePeer: IPeer = null;
        this.props.hostPeers.forEach((peer) => {
            if (peer.clientID === offer.clientID) {
                storePeer = peer;
                if (!this.props.videoReady || !this.props.serverStatus) {
                    this.props.addClientSignalDataDispatch(offer.clientID, offer.signalData);
                }
            }
        });

        // Deal with peer creation
        if (!this.peers[offer.clientID] && this.props.videoReady && this.props.serverStatus) {
            this.peers[offer.clientID] = this.createPeer(offer.clientID, (storePeer) ? storePeer.clientSignalData.concat(offer.signalData) : offer.signalData);
            this.props.clearSignalDataDispatch(offer.clientID);
        }

        else if (this.peers[offer.clientID] && this.props.videoReady && this.props.serverStatus) {
            this.peers[offer.clientID].signal(offer.signalData);
        }

        // Create store peer if necessary
        if (!storePeer) {
            if (this.props.serverStatus && this.props.videoReady) {
                this.props.createPeerDispatch(offer.clientID);
            }
            else {
                this.props.createPeerDispatch(offer.clientID, offer.signalData);
            }
        }
    }

    private createPeer = (clientID: string, ...offerData: SimplePeer.SignalData[]): SimplePeer.Instance => {
        const peer = new SimplePeer({
            initiator: false,
            stream: this.stream,
            trickle: true,
            answerConstraints: {
                offerToReceiveVideo: false,
                offerToReceiveAudio: false,
            },
        });

        this.hostReceiver.registerPeer(peer);
        this.hostMessenger.registerPeer(peer);

        peer.on("signal", (signalData: SimplePeer.SignalData) => {
            this.tryToRespond(clientID, signalData);
        });

        peer.on("connect", () => {
            this.props.setPeerStatusDispatch(clientID, true);
        });

        peer.on("close", () => {
            this.props.setPeerStatusDispatch(clientID, false);
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
            this.props.addHostSignalDataDispatch(clientID, signalData);
        }
    }

    private respond = (clientID: string, signalData: SimplePeer.SignalData) => {
        const responseMessage: IResponseMessage = {
            signalData,
            clientID,
        };
        this.socket.emit("respond", responseMessage);
    }

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
                this.stream = (video as any).captureStream();
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
                    nextProps.clearSignalDataDispatch(storePeer.clientID);
                }
            }
            else if (storePeer.clientSignalData.length > 0 && this.props.videoReady) {
                this.peers[storePeer.clientID] = this.createPeer(storePeer.clientID, storePeer.clientSignalData);
                nextProps.clearSignalDataDispatch(storePeer.clientID);
            }
        });

        // See if host signal data can be used (waiting on server)
        if (nextProps.serverStatus) {
            nextProps.hostPeers.forEach((storePeer) => {
                for (const data of storePeer.hostSignalData) {
                    this.respond(storePeer.clientID, data);
                }
            });
        }
    }

    protected shouldComponentUpdate(nextProps: IHostProps, nextState) {
        // Do not re-render if the only change was peer stuff
        return shouldUpdate(this.props, nextProps, "hostPeers", "peerStatus", "serverStatus");
    }

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
            signalHost: state.settingsState.signalHost,
            serverStatus: state.commonPeerState.serverStatus,
            videoReady: state.videoState.videoReady,
            hostPeers: state.hostPeerState.hostPeers,
            fullscreen: state.videoState.fullscreen,
            play: state.videoState.play,
        });
    }

    public static mapDispatchToProps = (dispatch): IHostDispatchProps => {
        return {
            watchServerStatusDispatch: (socket) => dispatch(watchServerStatusAction(socket)),
            setVideoReadyDispatch: (videoReady) => dispatch(setVideoReadyAction(videoReady)),
            createPeerDispatch: (id, ...signalData) => dispatch(createPeerAction(id, ...signalData)),
            addClientSignalDataDispatch: (clientID, signalData) => dispatch(addClientSignalDataAction(clientID, signalData)),
            addHostSignalDataDispatch: (clientID, signalData) => dispatch(addHostSignalDataAction(clientID, signalData)),
            clearSignalDataDispatch: (id) => dispatch(clearSignalDataAction(id)),
            setPeerStatusDispatch: (clientID, status) => dispatch(setPeerStatusAction(clientID, status)),
            setPlayStatusDispatch: (play) => dispatch(setPlayStatusAction(play)),
        };
    }
}

const VideoHostPageContainer = connect(
    VideoHostPage.mapStateToProps,
    VideoHostPage.mapDispatchToProps,
)(VideoHostPage);

export default VideoHostPageContainer;
