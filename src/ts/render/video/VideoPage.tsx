import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Electron from 'electron';
import * as SimplePeer from 'simple-peer';
import * as SocketIO from 'socket.io';


export enum ConnectionType {
    HOST = 1,
    CLIENT = 2
}

interface User {
    name: string;
    password: string;
    type: ConnectionType;
    signal: any;
}

export interface VideoPageProps {
    videoPath: string;
    type: ConnectionType;
    signalHost: string;
    name: string;
    password: string;
}

export class VideoPage extends React.Component<VideoPageProps, {}> {
    peer: SimplePeer.Instance;
    socket: SocketIO.Server;

    constructor() {
        super();


        // Initiate peer
        this.peer = new SimplePeer({
            initiator: this.props.type === ConnectionType.HOST ? true : false
        });

        // Setup to forward signalling data
        this.peer.on('signal', (data) => {
            // Setup user
            let user : User = {
                name: this.props.name,
                type: this.props.type,
                password: this.props.password,
                signal: data.signal
            }
            
            // Initiate socket
            this.socket = SocketIO();
            this.socket.on('connection', (socket) => {
                socket.emit('message', JSON.stringify(user));
                socket.on('connect', (data) => {
                    this.peer.signal(data.signal);
                })
            });
        });
    }

    render(): JSX.Element {
        return (
            <div className='video'>
                <video src={this.props.videoPath} type="video/mp4" width='100%' controls></video>
            </div>
        );
    }

    componentDidMount() {
        console.log('video mounted');
    }

    private connect(data: any) {

    }

}
