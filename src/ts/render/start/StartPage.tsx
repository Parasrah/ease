import * as React from "react";
import { ipcRenderer } from "electron";
import * as Guid from "guid";

import { UploadBox } from "./UploadBox";
import { UPLOAD_REQUEST, UPLOAD_RESPONSE } from "../../constants/Channels";
import { UploadCommand } from "../../constants/Commands";

export interface StartPageProps {
    filepathCallback: (file: string) => void;
    idCallback: (id: string) => void;
}

export class StartPage extends React.Component<StartPageProps, {}> {
    private idInput: HTMLInputElement;

    constructor() {
        super();
        this.idInput = null;
        this.listen();
    }

    onUploadClick() {
        ipcRenderer.send(UPLOAD_REQUEST, UploadCommand.CLICK);
    }

    onUploadDrag(filepath: string) {

    }

    private onIdButtonClick = () => {
        this.useHostID();
    }

    private onIdFieldKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.keyCode === 13) {
            this.useHostID();
        }
    }

    private useHostID() {
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

    private setIdInput = (input: HTMLInputElement) => {
        this.idInput = input;
    }

    private listen() {
        ipcRenderer.on(UPLOAD_RESPONSE, (event, payload: string) => {
            this.props.filepathCallback(payload);
        });
    }

    render(): JSX.Element {
        return (
            <div className="session">
                <div className="join">
                    <h1>Join a Session</h1>
                    <input
                        type="text"
                        name="id"
                        placeholder="Host ID"
                        onKeyDown={this.onIdFieldKeyDown}
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
