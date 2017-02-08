import * as React from 'react';

import { StartPage } from './start/StartPage';
import { VideoPage } from './video/VideoPage'

export interface AppProps {

}

export interface AppState {
    page: Page;
}

export enum Page {
    START, VIDEO
}

export class AppContainer extends React.Component<AppProps, AppState> {
    
    constructor() {
        super();

        this.state = {
            page: Page.START
        }
    }

    setPage(page: Page) {
        this.setState({
            page: page
        });
    }

    render() : JSX.Element {
        /* Choose which page to render */
        let renderedPage : JSX.Element;
        switch (this.state.page) {
            case Page.START:
                renderedPage = <StartPage />;
                break;

            case Page.VIDEO:
                renderedPage = <VideoPage />;
                break;
        }

        return renderedPage;
    }
}
