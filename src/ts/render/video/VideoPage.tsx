import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Electron from "electron";
import * as SimplePeer from "simple-peer";
import * as SocketIO from "socket.io-client";

import * as Exception from "../../common/Exceptions";

interface User {
    name: string;
    password: string;
    signal: any;
}

export interface OfferMessage {
    hostID: string;
    clientID: string;
    signalData: SimplePeer.SignalData;
}

export interface VideoPageProps {
    videoSource: string;
    signalHost: string;
    id: string;
}

export interface VideoPageState {
    videoSource: string | MediaStream;
}

interface Subscriber {
    (args: any[]): void;
}

interface SocketListener {
    fn: Subscriber;
    args: any[];
}

interface Subscription {
    event: string;
    happened: boolean;
    subscribers: Subscriber[];
    publishData: any[];
}

export abstract class VideoPage<P extends VideoPageProps> extends React.Component<P, {}> {

    protected videoReady: boolean;
    protected videoListeners: Function[];
    protected peer: SimplePeer.Instance;
    protected socket: SocketIOClient.Socket;
    private socketListeners: SocketListener[];
    private subscriptions: Subscription[];

    private videoElement: HTMLMediaElement;

    constructor(props) {
        super(props);

        this.videoReady = false;
        this.videoListeners = [];
        this.videoElement = null;
        this.socketListeners = [];
        this.subscriptions = [];

        // Initiate socket
        this.socket = SocketIO.connect(this.props.signalHost);
        this.createSubscription("connect");
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
        for (let fn of this.videoListeners) {
            fn();
        }
        this.videoListeners = null;
    }

    protected subscribe = (event: string, fn: Subscriber, now?: boolean) => {
        let sub = null;
        try {
            sub = this.getSubscription(event);
            sub.subscribers.push(fn);
        }
        catch (ex) {
            if (ex instanceof Exception.NoSuchSubscription) {
                // Create a subscription
                sub = this.createSubscription(event);
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
        const sub = this.getSubscription(event);
        if (sub.happened) {
            this.updateSubscribers(sub, publishData);
        }
        else {
            sub.publishData.push(publishData);
        }
    }

    protected createSubscription = (event: string) => {
        const sub = {
            event: event,
            happened: false,
            subscribers: [],
            publishData: []
        };
        this.subscriptions.push(sub);
        this.waitForEvent(event);
        return sub;
    }

    private waitForEvent = (event: string) => {
        this.socket.on(event, () => {
            const sub = this.getSubscription(event);
            sub.happened = true;

            // Event has occurred, publish all data to subscribers
            for (let publishData of sub.publishData) {
                this.updateSubscribers(sub, publishData);
            }

            // Remove all publish data
            sub.publishData = [];
        });
    }

    private updateSubscribers(subscription: Subscription, ...publishData) {
        for (let subscriber of subscription.subscribers) {
            subscriber(publishData);
        }
    }

    private getSubscription = (event: string): Subscription => {
        for (let sub of this.subscriptions) {
            if (sub.event === event) {
                return sub;
            }
        }
        throw new Exception.NoSuchSubscription();
    }

    private setVideo = (video: HTMLVideoElement) => {
        this.videoElement = video;
    }

    private connectionListener = () => {
        this.socket.off("connect", this.connectionListener);
        for (let listener of this.socketListeners) {
            listener.fn(listener.args);
        }
    }

    /********************* Abstract Methods ***********************/

    /**
     * Setup the socketIO connection and the signalling
     */
    protected abstract performSignaling: () => void;

    /********************* React Lifecycle ***********************/

    componentDidMount() {
        console.log("video mounted");
    }

    render(): JSX.Element {
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
