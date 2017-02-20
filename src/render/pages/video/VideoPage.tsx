import * as React from "react";
import * as SimplePeer from "simple-peer";
import * as SocketIO from "socket.io-client";

import * as Exception from "../../../common/Exceptions";

export interface IOfferMessage {
    hostID: string;
    clientID: string;
    signalData: SimplePeer.SignalData;
}

export interface IVideoPageProps {
    videoSource: string;
    signalHost: string;
    id: string;
}

type Subscriber = (args: any[]) => void;

interface ISocketListener {
    fn: Subscriber;
    args: any[];
}

interface ISubscription {
    event: string;
    happened: boolean;
    subscribers: Subscriber[];
    publishData: any[];
}

export abstract class VideoPage<P extends IVideoPageProps> extends React.Component<P, {}> {

    protected videoReady: boolean;
    protected videoListeners: Function[];
    protected peer: SimplePeer.Instance;
    protected socket: SocketIOClient.Socket;
    private Isubscriptions: ISubscription[];

    private videoElement: HTMLMediaElement;

    constructor(props) {
        super(props);

        this.videoReady = false;
        this.videoListeners = [];
        this.videoElement = null;
        this.Isubscriptions = [];

        // Initiate socket
        this.socket = SocketIO.connect(this.props.signalHost);
        this.createISubscription("connect");
    }

    /********************* Methods ***********************/

    public getVideo = (): HTMLMediaElement => {
        return this.videoElement;
    }

    public registerListener = (fn: Function): void => {
        if (this.videoReady) {
            fn();
        }
        else {
            this.videoListeners.push(fn);
        }
    }

    protected setVideoReady = () => {
        // Set state to true
        this.videoReady = true;

        // Alert the listeners
        for (const fn of this.videoListeners) {
            fn();
        }
        this.videoListeners = null;
    }

    protected subscribe = (event: string, fn: Subscriber, now?: boolean) => {
        let sub = null;
        try {
            sub = this.getISubscription(event);
            sub.subscribers.push(fn);
        }
        catch (ex) {
            if (ex instanceof Exception.NoSuchSubscription) {
                // Create a Isubscription
                sub = this.createISubscription(event);
            }
            else {
                throw ex;
            }
        }
        if (now) {
            this.updateSubscribers(sub);
        }
    }

    protected publish = (event: string, ...publishData: any[]) => {
        const sub = this.getISubscription(event);
        if (sub.happened) {
            this.updateSubscribers(sub, publishData);
        }
        else {
            sub.publishData.push(publishData);
        }
    }

    protected createISubscription = (event: string) => {
        const sub = {
            event,
            happened: false,
            publishData: [],
            subscribers: [],
        };
        this.Isubscriptions.push(sub);
        this.waitForEvent(event);
        return sub;
    }

    private waitForEvent = (event: string) => {
        this.socket.on(event, () => {
            const sub = this.getISubscription(event);
            sub.happened = true;

            // Event has occurred, publish all data to subscribers
            for (const publishData of sub.publishData) {
                this.updateSubscribers(sub, publishData);
            }

            // Remove all publish data
            sub.publishData = [];
        });
    }

    private updateSubscribers(Isubscription: ISubscription, ...publishData) {
        for (const subscriber of Isubscription.subscribers) {
            subscriber(publishData);
        }
    }

    private getISubscription = (event: string): ISubscription => {
        for (const sub of this.Isubscriptions) {
            if (sub.event === event) {
                return sub;
            }
        }
        throw new Exception.NoSuchSubscription();
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
}
