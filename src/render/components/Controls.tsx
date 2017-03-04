import * as React from "react";
import { IconButton, Slider } from "react-mdl";
import "../style/controls.less";

export interface IControlsProps {
    show?: boolean;
    min?: number;
    duration?: number;
    time: number;
    volume: number;
    play: boolean;

    onPlayPauseButton?(): void;
    onVolumeButton?(): void;
    onCastButton?(): void;
    onFullscreenButton?(): void;
    onSeek?(time: number): void;
    onVolumeChange?(volume: number): void;
}

export interface IControlsState {
    mute: boolean;
    time: number;
}

export class Controls extends React.Component<IControlsProps, IControlsState> {
    private formattedTime;

    constructor(props) {
        super(props);
        this.state = {
            time: 0,
            mute: false,
        };

        this.formattedTime = this.secondsToHms(this.state.time);
    }

    private secondsToHms(d: number): string {
        const h = Math.floor(d / 3600);
        const m = Math.floor(d % 3600 / 60);
        const s = Math.floor(d % 3600 % 60);

        return ((h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s);
    }

    /********************* Callbacks *************************/

    private onPlayPauseClick: React.EventHandler<React.MouseEvent<HTMLElement>> = (event) => {
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

    protected componentWillReceiveProps(nextProps: IControlsProps) {
        if (this.state.time !== nextProps.time) {
            this.formattedTime = this.secondsToHms(nextProps.time);
            this.setState({
                time: nextProps.time,
            });
        }
    }

    public render() {
        return (
            <div
                className={"react-controls react-controls-root " + ((this.props.show || !this.props.play) ? "react-controls-show" : "react-controls-hide")}
            >
                <Slider
                    className="playback-slider"
                    min={(this.props.min) ? this.props.min : 0}
                    max={(this.props.duration) ? this.props.duration : 100}
                    value={this.state.time}
                    onChange={this.onPlaybackChange}
                />
                <div className="control-bar">
                    <div className="bar-left">
                        <IconButton className="play-button" name={(!this.props.play ? "play_arrow" : "pause")} onClick={this.onPlayPauseClick} />
                        <IconButton className="volume-button" name={(this.state.mute) ? "volume_mute" : "volume_up"} onClick={this.onVolumeButtonClick} />
                        <Slider
                            className="volume-slider"
                            value={(this.props.volume !== undefined) ? this.props.volume : 100}
                            min={0}
                            max={100}
                            onChange={this.onVolumeChange}
                        />
                        <span className="time">
                            {this.formattedTime}
                        </span>
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
