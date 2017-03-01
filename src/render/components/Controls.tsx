import * as React from "react";
import { IconButton, Slider } from "react-mdl";

export interface IControlsProps {
    show?: boolean;
    min?: number;
    max?: number;
    time: number;

    onPlayPauseButton?: Function;
    onVolumeButton?: Function;
    onCastButton?: Function;
    onFullscreenButton?: Function;
    onSeek?: (time: number) => void;
    onVolumeChange?: (volume: number) => void;
}

export interface IControlsState {
    play: boolean;
    mute: boolean;
    time: number;
}

export class Controls extends React.Component<IControlsProps, IControlsState> {

    constructor(props) {
        super(props);
        this.state = {
            play: true,
            time: 0,
            mute: false,
        };
    }

    /********************* Callbacks *************************/

    private onPlayPauseClick: React.EventHandler<React.MouseEvent<HTMLElement>> = (event) => {
        this.setState({
            play: !this.state.play,
        });
        if (this.props.onPlayPauseButton) {
            this.props.onPlayPauseButton();
        }
    }

    private onVolumeChange: React.EventHandler<React.FormEvent<Slider>> = (event) => {
        const volume = (event.target as any).valueAsNumber;
        if (this.props.onVolumeChange) {
            this.props.onVolumeChange(volume);
        }
    }

    private onPlaybackChange: React.EventHandler<React.FormEvent<Slider>> = (event) => {
        const currTime = (event.target as any).valueAsNumber;
        this.setState({
            time: currTime,
        });
        if (this.props.onSeek) {
            this.props.onSeek(currTime);
        }
    }

    private onVolumeButtonClick = () => {
        this.setState({
            mute: !this.state.mute,
        });
        if (this.props.onVolumeButton) {
            this.props.onVolumeButton();
        }
    }

    private onCastButtonClick = () => {
        if (this.props.onCastButton) {
            this.props.onCastButton();
        }
    }

    private onFullscreenButtonClick = () => {
        if (this.props.onFullscreenButton) {
            this.props.onFullscreenButton();
        }
    }

    /********************* React Lifecycle ***********************/

    protected componentWillReceiveProps(nextProps) {
        if (this.state.time !== nextProps.time) {
            this.setState({
                time: nextProps.time,
            });
        }
    }

    public render() {
        return (
            <div
                className={"react-controls react-controls-root " + ((this.props.show) ? "react-controls-show" : "react-controls-hide")}
            >
                <Slider
                    className="playback-slider"
                    min={(this.props.min) ? this.props.min : 0}
                    max={(this.props.max) ? this.props.max : 100}
                    value={this.state.time}
                    onChange={this.onPlaybackChange}
                />
                <div className="control-bar">
                    <div className="bar-left">
                        <IconButton className="play-button" name={(this.state.play ? "play_arrow" : "pause")} onClick={this.onPlayPauseClick} />
                        <IconButton className="volume-button" name={(this.state.mute) ? "volume_mute" : "volume_up"} onClick={this.onVolumeButtonClick} />
                        <Slider className="volume-slider" min={0} max={100} onChange={this.onVolumeChange} />
                    </div>
                    <div className="bar-right">
                        <IconButton className="cast-button" name="cast" onClick={this.onCastButtonClick} />
                        <IconButton className="fullscreen-button" name="fullscreen" onClick={this.onFullscreenButtonClick} />
                    </div>
                </div>
            </div>
        );
    }
}
