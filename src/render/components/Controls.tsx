import * as React from "react";
import { IconButton, Slider } from "react-mdl";
import "../../style/controls.less";

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
    onReconnectButton?(): void;
}

export interface IControlsState {
    mute: boolean;
    time: number;
}

export class Controls extends React.Component<IControlsProps, IControlsState> {
    private formattedTime;
    private volumeSliderValue: number;

    constructor(props) {
        super(props);
        this.state = {
            time: 0,
            mute: false,
        };

        // Setup bindings
        this.onVolumeButtonClick = this.onVolumeButtonClick.bind(this);
        this.onCastButtonClick = this.onCastButtonClick.bind(this);
        this.onFullscreenButtonClick = this.onFullscreenButtonClick.bind(this);
        this.onReconnectClick = this.onReconnectClick.bind(this);
        this.onPlayPauseClick = this.onPlayPauseClick.bind(this);
        this.onVolumeChange = this.onVolumeChange.bind(this);
        this.onPlaybackChange = this.onPlaybackChange.bind(this);

        // Initialization
        this.volumeSliderValue = 100;
        this.formattedTime = this.secondsToHms(this.state.time);
    }

    private secondsToHms(d: number): string {
        const h = Math.floor(d / 3600);
        const m = Math.floor(d % 3600 / 60);
        const s = Math.floor(d % 3600 % 60);

        return ((h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s);
    }

    /********************* Callbacks *************************/

    private onPlayPauseClick(event: React.MouseEvent<HTMLElement>) {
        if (this.props.onPlayPauseButton) {
            this.props.onPlayPauseButton();
        }
    }

    private onVolumeChange(event: React.FormEvent<Slider>) {
        const volume = (event.target as any).valueAsNumber;
        if (this.props.onVolumeChange) {
            this.props.onVolumeChange(volume);
        }
        setTimeout(function() {
            this.setState({
                mute: false,
            });
        }.bind(this), 0);
    }

    private onPlaybackChange(event: React.FormEvent<Slider>) {
        const currTime = (event.target as any).valueAsNumber;
        this.setState({
            time: currTime,
        });
        if (this.props.onSeek) {
            this.props.onSeek(currTime);
        }
    }

    private onVolumeButtonClick() {
        this.setState({
            mute: !this.state.mute,
        });
        if (this.props.onVolumeButton) {
            this.props.onVolumeButton();
        }
    }

    private onCastButtonClick() {
        if (this.props.onCastButton) {
            this.props.onCastButton();
        }
    }

    private onFullscreenButtonClick() {
        if (this.props.onFullscreenButton) {
            this.props.onFullscreenButton();
        }
    }

    private onReconnectClick() {
        if (this.props.onReconnectButton) {
            this.props.onReconnectButton();
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

    protected componentWillUpdate(nextProps: IControlsProps, nextState: IControlsState) {
        // Calucalte value for volume slider
        if (nextState.mute) {
            this.volumeSliderValue = 0;
        }
        else {
            this.volumeSliderValue = (this.props.volume !== undefined) ? this.props.volume : 100;
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
                            value={this.volumeSliderValue}
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
                        <IconButton className="reconnect-button" name="cached" onClick={this.onReconnectClick} />
                        <IconButton className="fullscreen-button" name="fullscreen" onClick={this.onFullscreenButtonClick} />
                    </div>
                </div>
            </div>
        );
    }
}
