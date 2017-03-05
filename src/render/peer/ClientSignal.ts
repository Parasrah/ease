import * as SimplePeer from "simple-peer";
import { clearOfferDataAction, storeOfferDataAction } from "../actions/ClientPeerActions";
import { IState } from "../redux/State";
import { AbstractSignal, IOfferMessage, IResponseMessage } from "./AbstractSignal";

export class ClientSignal extends AbstractSignal {

    private peer: SimplePeer.Instance;

    constructor() {
        super();

        this.peer = null;
    }

    protected notify(oldState: IState, nextState: IState) {
        if (nextState.commonPeerState.serverStatus && nextState.clientPeerState.offerData.length > 0) {
            for (const signalData of nextState.clientPeerState.offerData) {
                this.sendOffer(this.formOffer(signalData));
            }
            this.dispatch(clearOfferDataAction());
        }
    }

    private sendOffer = (offerMessage: IOfferMessage) => {
        this.socket.emit("offer", offerMessage);
    }

    private formOffer = (data: SimplePeer.SignalData): IOfferMessage => {
        return {
            clientID: this.getID(),
            hostID: this.getClientState().hostID,
            signalData: data,
        };
    }

    private dealWithResponse = (responseMessage: IResponseMessage) => {
        if (responseMessage.clientID === this.getID()) {
            this.peer.signal(responseMessage.signalData);
        }
        else {
            console.log("Received response not intended for you!! Please open an issue on https://github.com/Right2Drive/ease/issues");
        }
    }

    private dealWithSignal = (signalData: SimplePeer.SignalData) => {
        if (!this.getServerStatus()) {
            this.dispatch(storeOfferDataAction(signalData));
        }
        else {
            this.sendOffer(this.formOffer(signalData));
        }
    }

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
        });
    }
}