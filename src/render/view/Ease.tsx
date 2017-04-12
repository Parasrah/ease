import { ipcRenderer } from "electron";
import * as Guid from "guid";
import * as React from "react";
import { connect } from "react-redux";

import { MainChannel } from "../../constants/Channels";
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from "../../constants/Constants";
import { createResizeMessage } from "../../ipc-common/messages/WindowMessage";
import { changePageAction } from "../actions/AppActions";
import { setIdAction } from "../actions/CommonPeerActions";
import { setFullscreenAction, setPathAction } from "../actions/VideoActions";
import { maximizeAction, unmaximizeAction } from "../actions/WindowActions";
import { listen } from "../ipc/Listener";
import { IState } from "../redux/State";
import { Page } from "../utils/Definitions";
import { Toolbar } from "./components/Toolbar";
import StartPageContainer from "./pages/start/StartPage";
import VideoClientPageContainer from "./pages/video/VideoClientPage";
import VideoHostPageContainer from "./pages/video/VideoHostPage";

interface IEaseStoreProps {
    id: string;
    page: Page;
    path: string;
    maximized: boolean;
}

interface IEaseDispatchProps {
    changePageDispatch: changePageAction;
    setIdDispatch: setIdAction;
    setFullscreenDispatch: setFullscreenAction;
    maximizeDispatch: maximizeAction;
    unmaximizeDispatch: unmaximizeAction;
    setPathDispatch: setPathAction;
}

export type IEaseProps = IEaseStoreProps & IEaseDispatchProps;

export class Ease extends React.Component<IEaseProps, {}> {
    private renderedPage: JSX.Element[];

    constructor(props) {
        super(props);

        // Bindings
        this.onHomeClick = this.onHomeClick.bind(this);
        this.onMaximizeClick = this.onMaximizeClick.bind(this);

        // Listen for incoming messages
        setTimeout(function() {
            listen();
        }, 0);

        this.props.setIdDispatch(Guid.raw());
        this.watchFullscreen();
    }

    /*********************** Methods *************************/

    public startVideo = (filepath: string) => {
        this.props.changePageDispatch(Page.VIDEO_HOST);
    }

    private watchFullscreen = () => {
        document.onwebkitfullscreenchange = () => {
            this.props.setFullscreenDispatch(document.webkitIsFullScreen);
        };
    }

    private onHomeClick() {
        ipcRenderer.send(MainChannel.windowMainChannel, createResizeMessage(DEFAULT_WIDTH, DEFAULT_HEIGHT));
        this.props.setPathDispatch("");
        this.props.changePageDispatch(Page.START);
    }

    private onMaximizeClick() {
        this.props.maximized ?
        this.props.unmaximizeDispatch() :
        this.props.maximizeDispatch();
    }

    private mapPage(page: Page, maximized?: boolean) {
        this.renderedPage = [];
        this.renderedPage.push(
            <Toolbar
                key="toolbar"
                page={page}
                maximized={maximized ? maximized : this.props.maximized}
                onMaximizeClick={this.onMaximizeClick}
                onHomeClick={this.onHomeClick}
            />,
        );
        switch (page) {
            case Page.START:
                this.renderedPage.push(
                    <StartPageContainer key="start-page" />,
                );
                break;

            case Page.VIDEO_HOST:
                this.renderedPage.push(
                    <VideoHostPageContainer key="video-host" videoSource={this.props.path} />,
                );
                break;

            case Page.VIDEO_CLIENT:
                this.renderedPage.push(
                    <VideoClientPageContainer key="video-client"/>,
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
        else if (this.props.maximized !== nextProps.maximized) {
            this.mapPage(nextProps.page, nextProps.maximized);
        }
        if (this.props.path !== nextProps.path && nextProps.path) {
            this.props.changePageDispatch(Page.VIDEO_HOST);
        }
    }

    public render(): JSX.Element {
        return (
            <div className="app-core">
                {this.renderedPage}
            </div>
        );
    }

    /*********************** Redux ***************************/

    public static mapStateToProps = (state: IState): IEaseStoreProps => {
        return Object.assign({}, {
            id: state.commonPeerState.id,
            page: state.appState.page,
            path: state.videoState.path,
            maximized: state.windowState.maximized,
        });
    }

    public static mapDispatchToProps = (dispatch): IEaseDispatchProps => {
        return {
            changePageDispatch: (page) => dispatch(changePageAction(page)),
            setIdDispatch: (id) => dispatch(setIdAction(id)),
            setFullscreenDispatch: (fullscreen) => dispatch(setFullscreenAction(fullscreen)),
            maximizeDispatch: () => dispatch(maximizeAction()),
            unmaximizeDispatch: () => dispatch(unmaximizeAction()),
            setPathDispatch: (filepath) => dispatch(setPathAction(filepath)),
        };
    }
}

const EaseContainer = connect(
    Ease.mapStateToProps,
    Ease.mapDispatchToProps,
)(Ease);

export default EaseContainer;
