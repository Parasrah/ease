import * as SimplePeer from "simple-peer";
import { connect } from "react-redux";

import IState from "../../redux/State";
import { watchServerStatus, setVideoReady, storeOfferData } from "../../redux/Actions";
import { IOfferMessage, IResponseMessage, IVideoInputProps, IVideoStoreProps, IVideoDispatchProps, VideoPage  } from "./VideoPage";

interface IClientInputProps extends IVideoInputProps {

}

interface IClientStoreProps extends IVideoStoreProps {
    readonly hostID?: string;
    readonly offerData?: SimplePeer.SignalData[];
}

interface IClientDispatchProps extends IVideoDispatchProps {
    readonly storeOfferData: storeOfferData;
}

type IClientProps = IClientInputProps & IClientStoreProps & IClientDispatchProps;

export class VideoClientPage extends VideoPage<IClientProps> {
    private peer: SimplePeer.Instance;

    constructor(props) {
        super(props);

        this.setupPeer();
    }

    /********************* Methods ***********************/

    private setupPeer = () => {
        this.peer = new SimplePeer({
            initiator: true,
            trickle: true,
        });

        this.peer.on("signal", this.dealWithSignal);

        this.socket.on("response", this.dealWithResponse);
    }

    private dealWithSignal = (signalData: SimplePeer.SignalData) => {
        if (!this.props.serverStatus) {
            this.props.storeOfferData(signalData);
        }
        else {
            this.sendOffer(this.formOffer(signalData));
        }
    }

    private dealWithResponse = (message) => {
        const responseMessage: IResponseMessage = JSON.parse(message);
        if (responseMessage.clientID === this.props.id) {
            this.peer.signal(responseMessage.signalData);
        }
        else {
            console.log("Received response not intended for you!! Please open an issue on https://github.com/Right2Drive/ease/issues");
        }
    }

    private stream = (stream: MediaStream) => {
        const video = this.getVideo();
        video.srcObject = stream;
    }

    private formOffer = (data: SimplePeer.SignalData): IOfferMessage => {
        return {
            clientID: this.props.id,
            hostID: this.props.hostID,
            signalData: data,
        };
    }

    private sendOffer = (offerMessage: IOfferMessage) => {
        this.socket.emit("offer", JSON.stringify(offerMessage));
    }

    /********************* React Lifecycle ***********************/

    protected willReceiveProps(nextProps: IClientProps) {
        if (nextProps.serverStatus && nextProps.offerData.length > 0) {
            for (const signalData of nextProps.offerData) {
                this.sendOffer(this.formOffer(signalData));
            }
        }
    }

    /*********************** Redux ***************************/

    public static mapStateToProps = (state: IState, ownProps: IClientInputProps): IClientStoreProps & IClientInputProps => {
        return Object.assign({}, ownProps, {
            id: state.peerState.id,
            hostID: state.peerState.hostID,
            signalHost: state.settingsState.signalHost,
            videoReady: state.videoState.videoReady,
            offerData: state.peerState.offerData,
            serverStatus: state.peerState.serverStatus,
        });
    }

    public static mapDispatchToProps = (dispatch): IClientDispatchProps => {
        return {
            watchServerStatus: (socket) => dispatch(watchServerStatus(socket)),
            setVideoReady: (videoReady) => dispatch(setVideoReady(videoReady)),
            storeOfferData: (signalData) => dispatch(storeOfferData(signalData)),
        };
    }
}

const VideoClientPageContainer = connect(
    VideoClientPage.mapStateToProps,
    VideoClientPage.mapDispatchToProps,
)(VideoClientPage);

export default VideoClientPageContainer;
