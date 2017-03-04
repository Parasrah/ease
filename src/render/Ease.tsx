import * as Guid from "guid";
import * as React from "react";
import { connect } from "react-redux";

import * as Constants from "../constants/Constants";
import StartPageContainer from "./pages/start/StartPage";
import { Page } from "./utils/Definitions";
import VideoClientPageContainer from "./pages/video/VideoClientPage";
import VideoHostPageContainer from "./pages/video/VideoHostPage";
import { VideoPage } from "./pages/video/VideoPage";
import { IState, IAppState } from "./redux/State";
import { changePageAction } from "./actions/AppActions";
import { setIDAction } from "./actions/CommonPeerActions";
import { setFullscreenAction } from "./actions/VideoActions";

interface IEaseStoreProps {
    id: string;
    page: Page;
}

interface IEaseDispatchProps {
    changePageDispatch: changePageAction;
    setIDDispatch: setIDAction;
    setFullscreenDispatch: setFullscreenAction;
}

export type IEaseProps = IEaseStoreProps & IEaseDispatchProps;

export class Ease extends React.Component<IEaseProps, {}> {
    private static readonly POSTER = __dirname + "/data/heart.gif";

    private videoPath: string;
    private hostID: string;
    private renderedPage: JSX.Element;

    constructor(props) {
        super(props);
        this.videoPath = null;
        this.hostID = null;
        this.props.setIDDispatch(Guid.raw());

        this.watchFullscreen();
    }

    /*********************** Methods *************************/

    public startVideo = (filepath: string) => {
        this.videoPath = filepath;
        this.props.changePageDispatch(Page.VIDEO_HOST);
    }

    public connectHost = (id: string) => {
        this.hostID = id;
        this.props.changePageDispatch(Page.VIDEO_CLIENT);
    }

    private watchFullscreen = () => {
        document.onwebkitfullscreenchange = () => {
            this.props.setFullscreenDispatch(document.webkitIsFullScreen);
        };
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

    private mapPage(page: Page) {
        switch (page) {
            case Page.START:
                this.renderedPage = (
                    <StartPageContainer
                        filepathCallback={this.startVideo}
                    />
                );
                break;
            case Page.VIDEO_HOST:
                this.renderedPage = (
                    <VideoHostPageContainer
                        videoSource={this.videoPath}
                        poster=""
                    />
                );
                break;

            case Page.VIDEO_CLIENT:
                this.renderedPage = (
                    <VideoClientPageContainer
                        poster={Ease.POSTER}
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
        this.mapPage(this.props.page);
    }

    public componentWillReceiveProps = (nextProps: IEaseStoreProps) => {
        if (this.props.page !== nextProps.page) {
            this.mapPage(nextProps.page);
        }
    }

    public render(): JSX.Element {
        return this.renderedPage;
    }

    /*********************** Redux ***************************/

    public static mapStateToProps = (state: IState): IEaseStoreProps => {
        return Object.assign({}, {
            id: state.commonPeerState.id,
            page: state.appState.page,
        });
    }

    public static mapDispatchToProps = (dispatch): IEaseDispatchProps => {
        return {
            changePageDispatch: (page) => dispatch(changePageAction(page)),
            setIDDispatch: (id) => dispatch(setIDAction(id)),
            setFullscreenDispatch: (fullscreen) => dispatch(setFullscreenAction(fullscreen)),
        };
    }
}

const EaseContainer = connect(
    Ease.mapStateToProps,
    Ease.mapDispatchToProps,
)(Ease);

export default EaseContainer;
