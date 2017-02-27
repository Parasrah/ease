import * as Guid from "guid";
import * as React from "react";
import { ipcRenderer } from "electron";
import { connect } from "react-redux";

import { IState } from "../../redux/State";
import { changePageAction } from "../../Actions/AppActions";
import { setIDAction } from "../../Actions/CommonPeerActions";
import { setHostIDAction } from "../../Actions/ClientPeerActions";
import { Page } from "../../utils/Definitions";
import { UPLOAD_REQUEST, UPLOAD_RESPONSE } from "../../../constants/Channels";
import { UploadCommand } from "../../../constants/Commands";
import { UploadBox } from "../../components/UploadBox";

interface IStartInputProps {
    filepathCallback: (file: string) => void;
}

interface IStartStoreProps {

}

interface IStartDispatchProps {
    setHostID?: (id: string) => void;
    changePage?: (page: Page) => void;
}

type IStartProps = IStartInputProps & IStartStoreProps & IStartDispatchProps;

class StartPage extends React.Component<IStartProps, {}> {
    private idInput: HTMLInputElement;

    constructor(props) {
        super(props);
        this.idInput = null;

        // Listen for file
        this.listen();
    }

    /********************* Methods ***********************/

    private useHostID = () => {
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

    private listen = () => {
        ipcRenderer.on(UPLOAD_RESPONSE, (event, payload: string) => {
            this.props.filepathCallback(payload);
        });
    }

    private onUploadClick = () => {
        ipcRenderer.send(UPLOAD_REQUEST, UploadCommand.CLICK);
    }

    private onUploadDrag = (payload: string) => {
        this.props.filepathCallback(payload);
    }

    private onIdButtonClick = () => {
        this.useHostID();
    }

    private onIdFieldKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.keyCode === 13) {
            this.useHostID();
        }
    }

    private setIdInput = (input: HTMLInputElement) => {
        this.idInput = input;
    }

    /********************* React Lifecycle ***********************/

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
        });
    }

    public static mapDispatchToProps = (dispatch): IStartDispatchProps => {
        return {
            changePage: (page) => { dispatch(changePageAction(page)); },
            setHostID: (hostID) => { dispatch(setHostIDAction(hostID)); },
        };
    }
}

const StartPageContainer = connect(
    StartPage.mapStateToProps,
    StartPage.mapDispatchToProps,
)(StartPage);

export default StartPageContainer;
