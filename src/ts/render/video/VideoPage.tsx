import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Electron from 'electron';

export interface VideoPageProps {
    videoPath: string;
    videoHeight: number;
    videoWidth: number;
}

export class VideoPage extends React.Component<VideoPageProps, {}> {

    constructor() {
        super();
    }

    render() : JSX.Element {
        return (
            <div className='video'>
                <video src={this.props.videoPath} type="video/mp4" height={this.props.videoHeight} width={this.props.videoWidth} controls></video>
            </div>
        );
    }

    componentDidMount() {
        console.log('video mounted');
    }

}
