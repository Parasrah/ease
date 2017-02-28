import * as React from "react";
import { IconButton, Slider, Grid, Cell, Icon } from "react-mdl";

import ControlEvent from "./ControlEvent";

export interface IControlsProps {
    show: boolean;

    onPlayButton?: any;
    onPauseButton?: any;
    onSeek?: any;
    onVolume?: any;
}

export interface IControlsState {
    play: boolean;
    time: number;
}

export class Controls extends React.Component<IControlsProps, IControlsState> {
    private playbackSlider: HTMLInputElement;

    constructor(props) {
        super(props);
        this.state = {
            play: true,
            time: 0,
        };
    }

    private onPlayPauseClick: React.EventHandler<React.MouseEvent<HTMLElement>> = (event) => {
        this.setState({
            play: !this.state.play,
        });
    }

    private onVolumeChange: React.EventHandler<React.FormEvent<Slider>> = (event) => {
        const test = "";
    }

    private onPlaybackChange: React.EventHandler<React.FormEvent<Slider>> = (event) => {
        this.setState({
            time: this.playbackSlider.valueAsNumber,
        });
    }

    private setPlaybackSlider = (element) => {
        this.playbackSlider = element;
    }

    public render() {
        return (
            <Grid
                className={"react-controls react-controls-root mdl-grid " + ((this.props.show) ? "react-controls-show" : "react-controls-hide")}
                noSpacing={true}
            >
                <Slider
                    className="playback-slider"
                    min={0}
                    max={100}
                    value={this.state.time}
                    onChange={this.onPlaybackChange}
                    ref={this.setPlaybackSlider}
                />
                <Cell col={1}>
                    <IconButton name={(this.state.play ? "play_arrow" : "pause")} onClick={this.onPlayPauseClick} />
                </Cell>
                <Cell col={1}>
                    <IconButton className="volume-button" name="volume_up" />
                </Cell>
                <Cell col={2}>
                    <Slider min={0} max={100} onChange={this.onVolumeChange} />
                </Cell>
                <Cell col={1}>
                    <IconButton name="cast" />
                </Cell>
                <Cell col={1}>
                    <IconButton name="fullscreen" />
                </Cell>
                <Cell col={1}>

                </Cell>
                <Cell col={1}>

                </Cell>
            </Grid>
        );
    }
}
