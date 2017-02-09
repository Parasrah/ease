import * as React from 'react';

import { StartPage } from './start/StartPage';
import { VideoPage } from './video/VideoPage';
import * as Constants from '../constants/Constants';

export interface AppProps {

}

export interface AppState {
    page: Page;
    height: number;
    width: number;
}

export enum Page {
    START, VIDEO
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
        }

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
            page: Page.VIDEO
        });
    }

    render() : JSX.Element {
        /* Choose which page to render */
        let renderedPage : JSX.Element;
        switch (this.state.page) {
            case Page.START:
                renderedPage = <StartPage filepathCallback={this.startVideo} />;
                break;

            case Page.VIDEO:
                renderedPage = <VideoPage videoPath={this.videoPath} videoHeight={this.state.height} videoWidth={this.state.width} />;
                break;
        }

        return renderedPage;
    }

    private setPageSize() {

    }

    private watchPageSize() {
        
    }

    private getHeight() {

    }

    private getWidth() {

    }
}
