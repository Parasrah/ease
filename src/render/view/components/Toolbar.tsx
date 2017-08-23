import { ipcRenderer } from "electron";
import * as React from "react";

import { MainChannel } from "../../../constants/Channels";
import { createCloseMessage, createMaximizeMessage, createMinimizeMessage } from "../../../ipc-common/messages/WindowMessage";
import "../../style/toolbar.less";
import { Page } from "../../utils/Definitions";

interface IToolbarProps {
    onHomeClick(): void;
    onMaximizeClick(): void;
    page: Page;
    maximized: boolean;
}

interface IToolbarState {}

export class Toolbar extends React.Component<IToolbarProps, IToolbarState> {

    constructor(props: IToolbarProps) {
        super(props);

        this.state = {};

        // Bind listeners
        this.onCloseClick = this.onCloseClick.bind(this);
        this.onWindowClick = this.onWindowClick.bind(this);
        this.onMinimizeClick = this.onMinimizeClick.bind(this);
        this.onHomeClick = this.onHomeClick.bind(this);
    }

    /************************ Methods ************************/

    /************************ Listeners **********************/

    private onCloseClick() {
        ipcRenderer.send(MainChannel.windowMainChannel, createCloseMessage());
    }

    private onWindowClick() {
        ipcRenderer.send(MainChannel.windowMainChannel, createMaximizeMessage());
    }

    private onMinimizeClick() {
        ipcRenderer.send(MainChannel.windowMainChannel, createMinimizeMessage());
    }

    private onHomeClick() {
        if (this.props.onHomeClick) {
            this.props.onHomeClick();
        }
    }

    /********************* React Lifecycle *******************/

    public render(): JSX.Element {
        return (
            <div
                className="toolbar"
            >
                {this.props.page !== Page.START && (
                    <button
                        className="toolbar-button home"
                        onClick={this.onHomeClick}
                    >
                        <i className="material-icons">home</i>
                    </button>
                )}
                <button
                    className="toolbar-button toolbar-right close"
                    onClick={this.onCloseClick}
                >
                    <i className="material-icons">close</i>
                </button>
                <button
                    className="toolbar-button toolbar-right window"
                    onClick={this.onWindowClick}
                >
                    <i className="material-icons">{(this.props.maximized ? "fullscreen_exit" : "fullscreen")}</i>
                </button>
                <button
                    className="toolbar-button toolbar-right minimize"
                    onClick={this.onMinimizeClick}
                >
                    <i className="material-icons">remove</i>
                </button>
            </div>
        );
    }
}
