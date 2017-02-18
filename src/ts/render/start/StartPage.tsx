import { ipcRenderer } from "electron";
import * as Guid from "guid";
import * as React from "react";

import { UPLOAD_REQUEST, UPLOAD_RESPONSE } from "../../constants/Channels";
import { UploadCommand } from "../../constants/Commands";
import { UploadBox } from "./UploadBox";

export interface IStartPageProps {
    filepathCallback: (file: string) => void;
    idCallback: (id: string) => void;
}

export class StartPage extends React.Component<IStartPageProps, {}> {
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
            this.props.idCallback(guid);
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
}
