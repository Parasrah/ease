import { ipcRenderer } from "electron";
import * as Guid from "guid";
import * as React from "react";
import { connect } from "react-redux";

import { MainChannel } from "../../../../constants/Channels";
import { createOpenDialogAction } from "../../../../ipc-common/messages/UploadMessage";
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

interface IStartState {
    startSelected: boolean;
    joinSelected: boolean;
}

interface IStartDispatchProps {
    setHostID?(id: string): void;
    changePage?(page: Page): void;
}

type IStartProps = IStartInputProps & IStartStoreProps & IStartDispatchProps;

class StartPage extends React.Component<IStartProps, IStartState> {
    private idInput: HTMLInputElement;

    constructor(props) {
        super(props);

        // Initialization
        this.state = {
            startSelected: false,
            joinSelected: false,
        };

        // Bindings
        this.onUploadClick = this.onUploadClick.bind(this);
        this.onIdButtonClick = this.onIdButtonClick.bind(this);
        this.onIdFieldKeyPress = this.onIdFieldKeyPress.bind(this);
        this.setIdInput = this.setIdInput.bind(this);
        this.useHostID = this.useHostID.bind(this);
        this.generateOptions = this.generateOptions.bind(this);

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

    private startSessionOnClick = () => {
        this.setState({
            startSelected: true,
        });
    }
    private joinSessionOnClick = () => {
        this.setState({
            joinSelected: true,
        });
    }

    // TODO: Move into stateless components?
    private generateOptions() {
        if (this.state.joinSelected || this.state.startSelected) {
            return (
                <div className="options">
                    <div className={"animated fadeOutLeft"}>
                        <div className="start">
                            <button
                                type="button"
                                onClick={this.startSessionOnClick}
                            >START SESSION
                            </button>
                        </div>
                        <div className="join">
                            <button
                                type="button"
                                onClick={this.joinSessionOnClick}
                            >JOIN SESSION
                            </button>
                        </div>
                    </div>
                    <div className={this.state.joinSelected ? "animated  fadeInRight" : "none"}>
                        <div className="join">
                            <div className="optionsTitle">Join a Session</div>
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
                    </div>
                    <div className={this.state.startSelected ? "animated  fadeInRight" : "none"}>
                        <div className="host"><div className="optionsTitle">Start Session</div>
                            <UploadBox onClick={this.onUploadClick} />
                        </div>
                    </div>
                </div>
            );
        }
        else {
            return (
                <div className="options">
                    <div className="start">
                        <button
                            type="button"
                            onClick={this.startSessionOnClick}
                        >START SESSION
                        </button>
                    </div>
                    <div className="join">
                        <button
                            type="button"
                            onClick={this.joinSessionOnClick}
                        >JOIN SESSION
                        </button>
                    </div>
                </div>
            );
        }
    }

    /********************* React Lifecycle ***********************/

    protected componentWillReceiveProps(nextProps: IStartProps) {
        if (this.props.path !== nextProps.path) {
            this.props.changePage(Page.VIDEO_HOST);
        }
    }

    public render(): JSX.Element {
        return (
            <div className="startPage">
                <div className="logo">
                    ease
                </div>
                <div className="menu">
                    {this.generateOptions()}
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
