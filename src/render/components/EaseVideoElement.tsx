import * as React from "react";
import { Controls } from "./Controls";

interface IVideoElementProps {
    videoSource: string;
    poster: string;
    max: number;
    time: number;
    setVideo: (video: HTMLVideoElement) => void;

    onPlayPauseButton: () => void;
    onVolumeButton: () => void;
    onCastButton: () => void;
    onFullscreenButton: () => void;
    onSeek: (time: number) => void;
    onVolumeChange: (volume: number) => void;
}

export const EaseVideoElement = (props: IVideoElementProps): JSX.Element => {

    return (
        <div className="react-video-wrapper">
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
            />
        </div>
    );
};
