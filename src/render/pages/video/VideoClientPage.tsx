import * as SimplePeer from "simple-peer";
import { connect } from "react-redux";

import IState from "../../redux/State";
import { IOfferMessage, IVideoInputProps, IVideoStoreProps, VideoPage  } from "./VideoPage";

interface IClientInputProps extends IVideoInputProps {

}

interface IClientStoreProps extends IVideoStoreProps {
    hostID: string;
}

interface IClientDispatchProps {

}

type IClientProps = IClientInputProps & IClientStoreProps & IClientDispatchProps;

export class VideoClientPage extends VideoPage<IClientProps> {

    constructor(props) {
        super(props);
    }

    /********************* Methods ***********************/

    private stream = (stream: MediaStream) => {
        const video = this.getVideo();
        video.srcObject = stream;
    }

    private sendOffer = (data: SimplePeer.SignalData) => {
        const offerMessage: IOfferMessage = {
            clientID: this.props.id,
            hostID: this.props.hostID,
            signalData: data,
        };
        this.socket.emit("offer", JSON.stringify(offerMessage));
    }

    /********************* React Lifecycle ***********************/

    /*********************** Redux ***************************/

    public static mapStateToProps = (state: IState, ownProps: IClientInputProps): IClientStoreProps & IClientInputProps => {
        return Object.assign({}, ownProps, {
            id: state.peerState.id,
            hostID: state.peerState.hostID,
        });
    }
}

const VideoClientPageContainer = connect(
    VideoClientPage.mapStateToProps,
)(VideoClientPage);

export default VideoClientPageContainer;
