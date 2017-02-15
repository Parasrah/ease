import * as React from "react";
import * as Guid from "guid";

import { StartPage } from "./start/StartPage";
import { VideoPage } from "./video/VideoPage";
import { VideoHostPage } from "./video/VideoHostPage";
import { VideoClientPage } from "./video/VideoClientPage";
import * as Constants from "../constants/Constants";

export interface AppProps {

}

export interface AppState {
    page: Page;
    height: number;
    width: number;
}

export enum Page {
    START, VIDEO_HOST, VIDEO_CLIENT
}

export class AppContainer extends React.Component<AppProps, AppState> {
    private videoPath: string;
    private hostID: string;
    private renderedPage: JSX.Element;

    constructor() {
        super();
        this.videoPath = null;
        this.hostID = null;

        this.state = {
            page: Page.START,
            height: Constants.DEFAULT_HEIGHT,
            width: Constants.DEFAULT_WIDTH
        };
        this.renderedPage = <StartPage filepathCallback={this.startVideo} idCallback={this.connectHost}/>;
        this.setPageSize();
        this.watchPageSize();
    }

    setPage(page: Page) {
        this.setState({
            page: page
        });
    }

    startVideo = (filepath: string) => {
        this.videoPath = filepath;
        this.setState({
            page: Page.VIDEO_HOST
        });
    }

    connectHost = (id: string) => {
        this.hostID = id;
        this.setState({
            page: Page.VIDEO_CLIENT
        });
    }

    componentWillUpdate = (nextProps, nextState) => {
        if (this.state.page !== nextState.page) {
            let guid = null;
            switch (nextState.page) {
                case Page.START:
                    this.renderedPage = <StartPage filepathCallback={this.startVideo} idCallback={this.connectHost} />;
                    break;
                case Page.VIDEO_HOST:
                    guid = Guid.raw();
                    this.renderedPage =
                        <VideoHostPage
                            id={guid}
                            signalHost={Constants.SIGNAL_HOST}
                            videoSource={this.videoPath}
                        />;
                    break;

                case Page.VIDEO_CLIENT:
                    guid = Guid.raw();
                    this.renderedPage = <VideoClientPage hostID={this.hostID} id={guid} signalHost={Constants.SIGNAL_HOST} videoSource="" />;
                    break;
            }
        }
    }

    private setPageSize() {

    }

    private watchPageSize() {

    }

    /**
     * Return the dimensions of the page
     *
     * return {
     *      height: number,
     *      width: number
     * }
     */
    private getDimensions() {

    }

    render(): JSX.Element {
        return this.renderedPage;
    }
}
