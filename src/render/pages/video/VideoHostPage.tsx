import * as SimplePeer from "simple-peer";
import { connect } from "react-redux";

import IState from "../../redux/State";
import { watchServerStatus } from "../../redux/Actions";
import { IOfferMessage, IResponseMessage, IVideoInputProps, IVideoStoreProps, IVideoDispatchProps, VideoPage  } from "./VideoPage";

interface IInitMessage {
    id: string;
}

interface IHostPeer {
    peer: SimplePeer.Instance;
    clientID: string;
}

interface IHostInputProps extends IVideoInputProps {

}

interface IHostStoreProps extends IVideoStoreProps {

}

interface IHostDispatchProps extends IVideoDispatchProps {

}

type IHostProps = IHostInputProps & IHostStoreProps & IHostDispatchProps;

export class VideoHostPage extends VideoPage<IHostProps> {
    protected socket: SocketIOClient.Socket;
    private peers: IHostPeer[];

    constructor(props) {
        super(props);
    }

    /********************* Methods ***********************/

    /********************* React Lifecycle ***********************/

    protected componentDidMount() {
        super.componentDidMount();

        // Initialize peer from video stream (must be called before VideoPage setup)
        const video: any = this.getVideo();
        video.onplay = () => {
            const stream: any = video.captureStream();
        };
    }

    /*********************** Redux ***************************/

    public static mapStateToProps = (state: IState, ownProps: IHostInputProps): IHostStoreProps & IHostInputProps => {
        return Object.assign({}, ownProps, {
            id: state.peerState.id,
            signalHost: state.settingsState.signalHost,
        });
    }

    public static mapDispatchToProps = (dispatch): IHostDispatchProps => {
        return {
            watchServerStatus: (socket) => dispatch(watchServerStatus(socket)),
        };
    }
}

const VideoHostPageContainer = connect(
    VideoHostPage.mapStateToProps,
)(VideoHostPage);

export default VideoHostPageContainer;
