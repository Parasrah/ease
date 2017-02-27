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
            <div className="startPage">
                <div className="logo">
                    ease
                </div>
                <div className="options">
                <div className="start">
                    <button
                        type="button"
                        onClick={this.onIdButtonClick}
                    >START a SESSION
                    </button>
                </div>
                <div className="join">
                    <button
                        type="button"
                        onClick={this.onIdButtonClick}
                    >JOIN a SESSION
                    </button>
                </div>
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
