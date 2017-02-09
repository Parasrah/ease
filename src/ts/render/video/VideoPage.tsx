import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Electron from 'electron';
import * as io from 'socket.io';

export interface VideoPageProps {
    videoPath: string;
}

export class VideoPage extends React.Component<VideoPageProps, {}> {

    constructor() {
        super();
    }

    render() : JSX.Element {
        return (
            <div className='video'>
                <video src={this.props.videoPath} type="video/mp4" width='100%' controls></video>
            </div>
        );
    }

    componentDidMount() {
        console.log('video mounted');
    }

    private call() {

    }

}
