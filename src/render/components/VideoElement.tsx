import * as React from "react";
import { Controls } from "./Controls";

interface IVideoElementProps {
    videoSource: string;
    poster: string;
    max: number;
    time: number;
    volume: number;

    setVideo: (video: HTMLVideoElement) => void;
    setVideoWrapper: (videoWrapper: HTMLDivElement) => void;

    onPlayPauseButton: () => void;
    onVolumeButton: () => void;
    onCastButton: () => void;
    onFullscreenButton: () => void;
    onSeek: (time: number) => void;
    onVolumeChange: (volume: number) => void;
}

export const VideoElement = (props: IVideoElementProps): JSX.Element => {

    return (
        <div
            className="react-video-wrapper"
            ref={props.setVideoWrapper}
        >
            <video
                src={props.videoSource}
                ref={props.setVideo}
                poster={props.poster}
                type="video/mp4"
                width="100%"
                height="100%"
                autoPlay
            />
            <Controls
                show={true}
                max={props.max}
                onPlayPauseButton={props.onPlayPauseButton}
                onVolumeButton={props.onVolumeButton}
                onCastButton={props.onCastButton}
                onFullscreenButton={props.onFullscreenButton}
                onSeek={props.onSeek}
                onVolumeChange={props.onVolumeChange}
                time={props.time}
                volume={props.volume}
            />
        </div>
    );
};
