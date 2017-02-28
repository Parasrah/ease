import * as React from "react";

import ControlEvent from "./ControlEvent";

export interface IControlsProps {
    show: boolean;

    onPlayButton?: React.EventHandler<React.MouseEvent<HTMLElement>>;
    onPauseButton?: React.EventHandler<React.MouseEvent<HTMLElement>>;
    onSeek?: React.EventHandler<React.MouseEvent<HTMLElement>>;
    onVolume?: React.EventHandler<React.MouseEvent<HTMLElement>>;
}

export interface IControlsState {
    play: boolean;
}

export class Controls extends React.Component<IControlsProps, IControlsState> {

    private onPlayClick: React.EventHandler<React.MouseEvent<HTMLElement>> = (event) => {

    }

    private onVolumeChange: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (event) => {

    }

    private onPlaybackChange: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (event) => {

    }

    public render() {
        return (
            <div className={"react-controls react-controls-root " + (this.props.show) ? "react-controls-show" : "react-controls-hide"}>
                <input className="mdl-slider mdl-js-slider playback-slider" type="range" min="0" max="100" value="0" tabIndex={0} onChange={this.onPlaybackChange} />
                <i className="react-controls react-controls-play material-icons" onClick={this.onPlayClick} >ic_play_arrow_white_24px</i>
                <i className="pause" />
                <i className="volume" />
                <input className="mdl-slider mdl-js-slider volume-slider" type="range" min="0" max="100" value="0" tabIndex={0} onChange={this.onVolumeChange} />
                <i className="" />
                <i className="" />
                <i className="" />
            </div>
        );
    }
}
