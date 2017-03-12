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

interface IStartState {
    startSelected: boolean, 
    joinSelected: boolean,
}
interface IStartDispatchProps {
    setHostID?: (id: string) => void;
    changePage?: (page: Page) => void;
}

type IStartProps = IStartInputProps & IStartStoreProps & IStartDispatchProps;

class StartPage extends React.Component<IStartProps, IStartState> {
    private idInput: HTMLInputElement;

    constructor(props) {
        super(props);
        this.idInput = null;

        this.state = {
            startSelected: false,
            joinSelected: false,
        }
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
    /********************* React Lifecycle ***********************/

    public render(): JSX.Element {
        let options;
        if (this.state.joinSelected || this.state.startSelected) {
            options = (
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
                    </button></div> </div>
                        <div className={this.state.startSelected ? "animated  fadeInRight" : "none"}>
                          <div className="host"><div className="optionsTitle">Start Session</div>
                    <UploadBox onClick={this.onUploadClick} /> </div></div>
            </div>
            );
        } else {
            options = (<div className="options"><div className="start">
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
                        </div></div>);
        }

        
        
        return (
            <div className="startPage">
                <div className="logo">
                    ease
                </div>
                <div className="menu">
                    {options}
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
