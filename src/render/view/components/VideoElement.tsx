import * as React from "react";
import { Controls } from "./Controls";

interface IVideoElementProps {
    videoSource: string;
    poster: string;
    duration: number;
    time: number;
    volume: number;
    play: boolean;
    showControls: boolean;
    hidden: boolean;

    setVideo(video: HTMLVideoElement): void;
    setVideoWrapper(videoWrapper: HTMLDivElement): void;

    onVideoWheel: React.EventHandler<React.WheelEvent<HTMLVideoElement>>;
    onPlayPauseButton(): void;
    onVolumeButton(): void;
    onCastButton(): void;
    onFullscreenButton(): void;
    onSeek(time: number): void;
    onVolumeChange(volume: number): void;
    onMouseMove(): void;
    onVideoClick(): void;
    onReconnectButton?(): void;
    onCopyButton?(): void;
}

export const VideoElement = (props: IVideoElementProps): JSX.Element => {

    return (
        <div
            className={"react-video-wrapper " + (props.showControls ? "show-cursor" : "hide-cursor") + " " + (props.hidden ? "hidden" : "visible")}
            ref={props.setVideoWrapper}
            onMouseMove={props.onMouseMove}
        >
            <video
                type="video/mp4"
                src={props.videoSource}
                ref={props.setVideo}
                poster={props.poster}
                onWheel={props.onVideoWheel}
                onClick={props.onVideoClick}
                autoPlay={true}
            />
            <Controls
                show={props.showControls}
                duration={props.duration}
                onPlayPauseButton={props.onPlayPauseButton}
                onVolumeButton={props.onVolumeButton}
                onCastButton={props.onCastButton}
                onFullscreenButton={props.onFullscreenButton}
                onReconnectButton={props.onReconnectButton}
                onCopyButton={props.onCopyButton}
                onSeek={props.onSeek}
                onVolumeChange={props.onVolumeChange}
                time={props.time}
                volume={props.volume}
                play={props.play}
            />
        </div>
    );
};
