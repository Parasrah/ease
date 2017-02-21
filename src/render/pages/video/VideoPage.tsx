import * as React from "react";
import * as SimplePeer from "simple-peer";
import * as SocketIO from "socket.io-client";

import * as Exception from "../../../common/Exceptions";
import IState from "../../redux/State";

export interface IOfferMessage {
    hostID: string;
    clientID: string;
    signalData: SimplePeer.SignalData;
}

interface IVideoInputProps {
    videoSource: string;
    signalHost: string;
}

interface IVideoDispatchProps {}

interface IVideoStateProps {
    id?: string;
}

export interface ICombinedVideoProps extends IVideoStateProps, IVideoInputProps, IVideoDispatchProps {}

export abstract class VideoPage<P extends ICombinedVideoProps> extends React.Component<P, {}> {
    protected peer: SimplePeer.Instance;
    protected socket: SocketIOClient.Socket;

    private videoElement: HTMLMediaElement;

    constructor(props) {
        super(props);

        // Initiate socket
        this.socket = SocketIO.connect(this.props.signalHost);
    }

    /********************* Methods ***********************/

    public getVideo = (): HTMLMediaElement => {
        return this.videoElement;
    }

    private setVideo = (video: HTMLVideoElement) => {
        this.videoElement = video;
    }

    /********************* Abstract Methods ***********************/

    /**
     * Setup the socketIO connection and the signalling
     */
    protected abstract performSignaling: () => void;

    /********************* React Lifecycle ***********************/

    protected componentDidMount() {
        console.log("video mounted");
    }

    public render(): JSX.Element {
        return (
            <div className="video">
                <b> ID: </b> {this.props.id}
                <video
                    src={this.props.videoSource}
                    ref={this.setVideo}
                    poster={__dirname + "/data/heart.gif"}
                    type="video/mp4"
                    width="100%"
                    controls
                />
            </div>
        );
    }

    /*********************** Redux ***************************/

    public static mapStateToProps = (state: IState) => {
        return Object.assign({}, state.appState.id);
    }
}
