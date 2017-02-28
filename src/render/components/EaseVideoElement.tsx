import * as React from "react";
import { Controls } from "./react-controls/Controls";

interface IVideoElementProps {
    videoSource: string;
    poster: string;
    setVideo: (video: HTMLVideoElement) => void;
}

export const EaseVideoElement = (props: IVideoElementProps): JSX.Element => {

    return (
        <video
            src={props.videoSource}
            ref={props.setVideo}
            poster={props.poster}
            type="video/mp4"
            width="100%"
            height="100%"
            autoPlay
        >
            <Controls show={true} />
        </video>
    );
};
