import * as Guid from "guid";
import * as React from "react";
import { connect, Provider } from "react-redux";
import { createStore } from "redux";

import * as Constants from "../constants/Constants";
import { Page } from "./redux/Definitions";
import { StartPage } from "./pages/start/StartPage";
import { VideoClientPage } from "./pages/video/VideoClientPage";
import { VideoHostPage } from "./pages/video/VideoHostPage";
import { VideoPage } from "./pages/video/VideoPage";
import { IState, IAppState } from "./redux/State";
import app from "./redux/Reducers";

const store = createStore(app);

export interface IEaseProps extends IAppState {}

export class Ease extends React.Component<IEaseProps, {}> {
    private videoPath: string;
    private hostID: string;
    private renderedPage: JSX.Element;

    constructor(props) {
        super(props);
        this.videoPath = null;
        this.hostID = null;
    }

    /*********************** Methods *************************/

    public setPage = (page: Page) => {
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

    private setPageSize = () => {
        "TODO";
    }

    private watchPageSize = () => {
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
    private getDimensions = () => {
        "TODO";
    }

    private mapPage() {
        let guid: string = null;
        switch (this.props.page) {
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

    /*********************** Lifecycle ***********************/

    public componentWillMount() {
        this.mapPage();
    }

    public componentWillUpdate = (nextProps: IEaseProps, nextState) => {
        if (this.props.page !== nextProps.page) {
            this.mapPage();
        }
    }

    public render(): JSX.Element {
        return (
            <Provider store={store} >
                {this.renderedPage}
            </Provider>
        );
    }

    /*********************** Redux ***************************/

    public static mapStateToProps = (state: IState): IEaseProps => {
        return Object.assign({}, state.appState);
    }
}

const EaseContainer = connect(
    Ease.mapStateToProps,
)(Ease);

export default EaseContainer;
