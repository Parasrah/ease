import * as React from "react";

import { StartPage } from "./start/StartPage";
import { VideoPage } from "./video/VideoPage";
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

    constructor() {
        super();
        this.videoPath = null;

        this.state = {
            page: Page.START,
            height: Constants.DEFAULT_HEIGHT,
            width: Constants.DEFAULT_WIDTH
        };
        this._renderedPage = <StartPage filepathCallback={this.startVideo} />;
        this.setPageSize();
        this.watchPageSize();
    }

    _renderedPage: JSX.Element; 

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
        console.log(nextState.page);
        if (this.state.page !== nextState.page) {
            switch (nextState.page) {
                case Page.START:
                    this._renderedPage = <StartPage filepathCallback={this.startVideo} />;
                    break;
                case Page.VIDEO_HOST:
                    this._renderedPage = <div className="videoHostPage">Video host page</div>;
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
