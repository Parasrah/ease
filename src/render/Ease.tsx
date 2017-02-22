import * as Guid from "guid";
import * as React from "react";
import { connect } from "react-redux";

import * as Constants from "../constants/Constants";
import StartPageContainer from "./pages/start/StartPage";
import { changePage, setID } from "./redux/Actions";
import { Page } from "./redux/Definitions";
import { VideoClientPage } from "./pages/video/VideoClientPage";
import { VideoHostPage } from "./pages/video/VideoHostPage";
import { VideoPage } from "./pages/video/VideoPage";
import { IState, IAppState } from "./redux/State";

interface IEaseStoreProps {
    id: string;
    page: Page;
}

interface IEaseDispatchProps {
    changePage: (page: Page) => void;
    setID: (id: string) => void;
}

export type IEaseProps = IEaseStoreProps & IEaseDispatchProps;

export class Ease extends React.Component<IEaseProps, {}> {
    private videoPath: string;
    private hostID: string;
    private renderedPage: JSX.Element;

    constructor(props) {
        super(props);
        this.videoPath = null;
        this.hostID = null;

        this.props.setID(Guid.raw());
    }

    /*********************** Methods *************************/

    public startVideo = (filepath: string) => {
        this.videoPath = filepath;
        this.props.changePage(Page.VIDEO_HOST);
    }

    public connectHost = (id: string) => {
        this.hostID = id;
        this.props.changePage(Page.VIDEO_CLIENT);
    }

    private changePageSize = () => {
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
        switch (this.props.page) {
            case Page.START:
                this.renderedPage = (
                    <StartPageContainer
                        filepathCallback={this.startVideo}
                    />
                );
                break;
            case Page.VIDEO_HOST:
                this.renderedPage = (
                    <VideoHostPage
                        videoSource={this.videoPath}
                    />
                );
                break;

            case Page.VIDEO_CLIENT:
                this.renderedPage = (
                    <VideoClientPage
                        hostID={this.hostID}
                        videoSource=""
                    />
                );
                break;
            default:
                throw new Error("NoSuchEnum");
        }
    }

    /*********************** Lifecycle ***********************/

    public componentWillMount() {
        this.mapPage();
    }

    public componentWillUpdate = (nextProps: IEaseStoreProps, nextState) => {
        if (this.props.page !== nextProps.page) {
            this.mapPage();
        }
    }

    public render(): JSX.Element {
        return this.renderedPage;
    }

    /*********************** Redux ***************************/

    public static mapStateToProps = (state: IState): IEaseStoreProps => {
        return Object.assign({}, {
            id: state.peerState.id,
            page: state.appState.page,
        });
    }

    public static mapDispatchToProps = (dispatch): IEaseDispatchProps => {
        return {
            changePage: (page) => dispatch(changePage(page)),
            setID: (id) => dispatch(setID(id)),
        };
    }
}

const EaseContainer = connect(
    Ease.mapStateToProps,
    Ease.mapDispatchToProps,
)(Ease);

export default EaseContainer;
