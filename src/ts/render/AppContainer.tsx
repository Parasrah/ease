import * as React from "react";
import * as Guid from "guid";

import { StartPage } from "./start/StartPage";
import { VideoPage } from "./video/VideoPage";
import { VideoHostPage } from "./video/VideoHostPage";
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
    private _renderedPage: JSX.Element;

    constructor() {
        super();
        this.videoPath = null;

        this.state = {
            page: Page.START,
            height: Constants.DEFAULT_HEIGHT,
            width: Constants.DEFAULT_WIDTH
        };
        this._renderedPage = <StartPage filepathCallback={this.startVideo}/>;
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

    componentWillUpdate = (nextProps, nextState) => {
        if (this.state.page !== nextState.page) {
            switch (nextState.page) {
                case Page.START:
                    this._renderedPage = <StartPage filepathCallback={this.startVideo} />;
                    break;
                case Page.VIDEO_HOST:
                    const guid = Guid.raw();
                    this._renderedPage =
                        <VideoHostPage
                            id={guid}
                            signalHost={Constants.SIGNAL_HOST}
                            videoSource={this.videoPath}
                        />;
                    break;

                case Page.VIDEO_CLIENT:
                    this._renderedPage = <div className="videoClientPage">Video client page</div>;
                    break;
            }
        }
    }
    render(): JSX.Element {
        return this._renderedPage;
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
}
