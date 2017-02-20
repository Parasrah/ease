import * as Guid from "guid";
import * as React from "react";

import * as Constants from "../constants/Constants";
import { Page } from "./redux/Definitions";
import { StartPage } from "./pages/start/StartPage";
import { VideoClientPage } from "./pages/video/VideoClientPage";
import { VideoHostPage } from "./pages/video/VideoHostPage";
import { VideoPage } from "./pages/video/VideoPage";
import { IAppState } from "./redux/State";

export interface IAppProps {

}

export class AppContainer extends React.Component<IAppProps, IAppState> {
    private videoPath: string;
    private hostID: string;
    private renderedPage: JSX.Element;

    constructor() {
        super();
        this.videoPath = null;
        this.hostID = null;

        this.state = {
            height: Constants.DEFAULT_HEIGHT,
            page: Page.START,
            width: Constants.DEFAULT_WIDTH,
        };
        this.renderedPage = <StartPage filepathCallback={this.startVideo} idCallback={this.connectHost} />;
        this.setPageSize();
        this.watchPageSize();
    }

    public setPage(page: Page) {
        this.setState({
            page,
        });
    }

    public startVideo = (filepath: string) => {
        this.videoPath = filepath;
        this.setState({
            page: Page.VIDEO_HOST,
        });
    }

    public connectHost = (id: string) => {
        this.hostID = id;
        this.setState({
            page: Page.VIDEO_CLIENT,
        });
    }

    public componentWillUpdate = (nextProps, nextState) => {
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
                default:
                    throw new Error("NoSuchEnum");
            }
        }
    }

    private setPageSize() {
        "TODO";
    }

    private watchPageSize() {
        "TODO";
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
        "TODO";
    }

    public render(): JSX.Element {
        return this.renderedPage;
    }
}
