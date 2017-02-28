import * as React from "react";

import ControlEvent from "./ControlEvent";
import { IMdlUpgrade, MATERIAL_SLIDER_TYPE, MATERIAL_BUTTON_TYPE } from "../../utils/Mdl";

declare const componentHandler: IMdlUpgrade;

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
    private playbackSlider: HTMLInputElement;
    private volumeSlider: HTMLInputElement;
    private buttons: HTMLButtonElement[];

    constructor(props) {
        super(props);
        this.buttons = [];
    }

    private onPlayClick: React.EventHandler<React.MouseEvent<HTMLElement>> = (event) => {
        const test = "";
    }

    private onVolumeChange: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (event) => {
        const test = "";
    }

    private onPlaybackChange: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (event) => {
        const test = "";
    }

    private clearButtons = () => {
        this.buttons = [];
    }

    private setButton = (element: HTMLButtonElement) => {
        this.buttons.push(element);
    }

    private setPlaybackSlider = (element: HTMLInputElement) => {
        this.playbackSlider = element;
    }

    private setVolumeSlider = (element: HTMLInputElement) => {
        this.volumeSlider = element;
    }

    protected componentWillUpdate() {
        this.clearButtons();
    }

    protected componentDidUpdate() {
        componentHandler.upgradeElement(this.playbackSlider, MATERIAL_SLIDER_TYPE);
        componentHandler.upgradeElement(this.volumeSlider, MATERIAL_SLIDER_TYPE);
        for (const button of this.buttons) {
            componentHandler.upgradeElement(button, MATERIAL_BUTTON_TYPE);
        }
    }

    public render() {
        return (
            <div className={"react-controls react-controls-root mdl-grid " + ((this.props.show) ? "react-controls-show" : "react-controls-hide")}>
                <div className="mdl-cell mdl-cell--1-col">
                    <button className="react-controls react-controls-play mdl-button mdl-js-button mdl-button--icon" ref={this.setButton}>
                        <i className="material-icons">play_arrow_white</i>
                    </button>
                </div>
                <div className="mdl-cell mdl-cell--1-col">
                    <button className="mdl-button mdl-js-button mdl-button--icon" ref={this.setButton}>
                        <i className="material-icons">mood</i>
                    </button>
                </div>
                <div className="mdl-cell mdl-cell--1-col">
                    <i className="volume" />
                </div>
                <div className="mdl-cell mdl-cell--1-col">
                    <input
                        className="mdl-slider mdl-js-slider volume-slider"
                        type="range"
                        min="0"
                        max="100"
                        tabIndex={0}
                        onChange={this.onVolumeChange}
                        ref={this.setVolumeSlider}
                    />
                </div>
                <div className="mdl-cell mdl-cell--1-col">
                    <i className="" />
                </div>
                <div className="mdl-cell mdl-cell--1-col">
                    <i className="" />
                </div>
                <div className="mdl-cell mdl-cell--1-col">
                    <i className="" />
                </div>
                <input
                    className="mdl-slider mdl-js-slider playback-slider"
                    type="range"
                    min="0"
                    max="100"
                    tabIndex={0}
                    onChange={this.onPlaybackChange}
                    ref={this.setPlaybackSlider}
                />
            </div>
        );
    }
}
