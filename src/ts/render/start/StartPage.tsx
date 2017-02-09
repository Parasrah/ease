import * as React from 'react';
import { ipcRenderer } from 'electron';

import { UploadBox } from './UploadBox'
import { UPLOAD_CHANNEL } from '../../constants/Channels';
import { UploadCommand } from '../../constants/Commands';

export interface StartPageProps {

}

export class StartPage extends React.Component<StartPageProps, {}> {

    constructor() {
        super();
    }

    uploadClick() {
        console.log('sending: ' + UploadCommand.CLICK);
        ipcRenderer.send(UPLOAD_CHANNEL, UploadCommand.CLICK);
    }

    uploadDrag(filepath: string) {
        
    }

    render() : JSX.Element {
        return (
            <div className="session">
                <div className="join">
                    <h1>Join a Session</h1>
                    <input type="number" name="ip"></input>
                    <button type="button" className="pure-button pure-button-primary join-button">Join</button>
                </div>
                <div className="break pure-g">
                    <div className="pure-u-10-24 break-item line left"></div>
                    <div className="pure-u-1-6 break-item center">
                        <span className="or">Or...</span>
                    </div>
                    <div className="pure-u-10-24 break-item line right"></div>
                </div>
                <div className="host">
                    <h1>Start a Session</h1>
                    <UploadBox onClick={this.uploadClick} />
                </div>
            </div>
        );
    }

}
