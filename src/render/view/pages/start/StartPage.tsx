import { ipcRenderer } from "electron";
import * as Guid from "guid";
import * as React from "react";
import { connect } from "react-redux";

import { MainChannel } from "../../../../constants/Channels";
import { createOpenDialogAction } from "../../../../ipc-common/messages/UploadMessage";
import { createMaximizeMessage } from "../../../../ipc-common/messages/WindowMessage";
import { changePageAction } from "../../../actions/AppActions";
import { setHostIdAction } from "../../../actions/ClientPeerActions";
import { IState } from "../../../redux/State";
import "../../../style/start.less";
import { Page } from "../../../utils/Definitions";
import { UploadBox } from "../../components/UploadBox";

interface IStartInputProps {
}

interface IStartStoreProps {
    path: string;
}

interface IStartDispatchProps {
    setHostID?(id: string): void;
    changePage?(page: Page): void;
}

type IStartProps = IStartInputProps & IStartStoreProps & IStartDispatchProps;

class StartPage extends React.Component<IStartProps, {}> {
    private idInput: HTMLInputElement;

    constructor(props) {
        super(props);

        // Bindings
        this.onUploadClick = this.onUploadClick.bind(this);
        this.onIdButtonClick = this.onIdButtonClick.bind(this);
        this.onIdFieldKeyPress = this.onIdFieldKeyPress.bind(this);
        this.setIdInput = this.setIdInput.bind(this);
        this.useHostID = this.useHostID.bind(this);

        // Initialization
        this.idInput = null;
    }

    /********************* Methods ***********************/

    private useHostID() {
        const guid = this.idInput.value;
        if (guid === "") {
            // TODO warning message
        }
        else if (!Guid.isGuid(guid)) {
            // TODO warning message
        }
        else {
            this.props.setHostID(guid);
            this.props.changePage(Page.VIDEO_CLIENT);
        }
    }

    private onUploadClick() {
        ipcRenderer.send(MainChannel.uploadChannel, createOpenDialogAction());
    }

    private onIdButtonClick() {
        this.useHostID();
    }

    private onIdFieldKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.keyCode === 13) {
            this.useHostID();
        }
    }

    private setIdInput(input: HTMLInputElement) {
        this.idInput = input;
    }

    private watchFullscreen() {
        window.addEventListener("keydown", this.keydownListener);
    }

    private removeKeydownListener() {
        window.removeEventListener("keydown", this.keydownListener);
    }

    private keydownListener(event: KeyboardEvent) {
        switch (event.keyCode) {
            case 122: // F11
                event.preventDefault();
                ipcRenderer.send(MainChannel.windowMainChannel, createMaximizeMessage());
                break;

            default:
        }
    }

    /********************* React Lifecycle ***********************/

    protected componentWillReceiveProps(nextProps: IStartProps) {
        if (this.props.path !== nextProps.path) {
            this.props.changePage(Page.VIDEO_HOST);
        }
    }

    protected componentDidMount() {
        this.watchFullscreen();
    }

    protected componentWillUnmount() {
        this.removeKeydownListener();
    }

    public render(): JSX.Element {
        return (
            <div className="session">
                <div className="join">
                    <h1>Join a Session</h1>
                    <input
                        type="text"
                        name="id"
                        placeholder="Host ID"
                        onKeyPress={this.onIdFieldKeyPress}
                        ref={this.setIdInput}
                    />
                    <button
                        type="button"
                        className="pure-button pure-button-primary join-button"
                        onClick={this.onIdButtonClick}
                    >Join
                    </button>
                </div>
                <div className="break pure-g">
                    <div className="pure-u-10-24 break-item line left" />
                    <div className="pure-u-1-6 break-item center">
                        <span className="or">Or...</span>
                    </div>
                    <div className="pure-u-10-24 break-item line right" />
                </div>
                <div className="host">
                    <h1>Start a Session</h1>
                    <UploadBox onClick={this.onUploadClick} />
                </div>
            </div>
        );
    }

    /*********************** Redux ***************************/

    public static mapStateToProps = (state: IState, ownProps: IStartInputProps): IStartStoreProps & IStartInputProps => {
        return Object.assign({}, ownProps, {
            id: state.commonPeerState.id,
            page: state.appState.page,
            path: state.videoState.path,
        });
    }

    public static mapDispatchToProps = (dispatch): IStartDispatchProps => {
        return {
            changePage: (page) => { dispatch(changePageAction(page)); },
            setHostID: (hostID) => { dispatch(setHostIdAction(hostID)); },
        };
    }
}

const StartPageContainer = connect(
    StartPage.mapStateToProps,
    StartPage.mapDispatchToProps,
)(StartPage);

export default StartPageContainer;
