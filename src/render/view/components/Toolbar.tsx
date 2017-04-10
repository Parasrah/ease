import { ipcRenderer } from "electron";
import * as React from "React";

import { WindowChannelAction } from "../../../constants/ChannelActions";
import { MainChannel } from "../../../constants/Channels";
import "../../style/toolbar.less";
import { Page } from "../../utils/Definitions";

interface IToolbarProps {
    onHomeClick(): void;
    page: Page;
}

interface IToolbarState {
    windowed: boolean;
}

export class Toolbar extends React.Component<IToolbarProps, IToolbarState> {

    constructor(props: IToolbarProps) {
        super(props);

        // Initialize State
        this.state = {
            windowed: true,
        };

        // Bind listeners
        this.onCloseClick = this.onCloseClick.bind(this);
        this.onWindowClick = this.onWindowClick.bind(this);
        this.onMinimizeClick = this.onMinimizeClick.bind(this);
        this.onHomeClick = this.onHomeClick.bind(this);
    }

    /************************ Methods ************************/

    /************************ Listeners **********************/

    private onCloseClick() {
        ipcRenderer.send(MainChannel.windowMainChannel, WindowChannelAction.close);
    }

    private onWindowClick() {
        this.setState({
            windowed: !this.state.windowed,
        });
        ipcRenderer.send(MainChannel.windowMainChannel, WindowChannelAction.maximize);
    }

    private onMinimizeClick() {
        ipcRenderer.send(MainChannel.windowMainChannel, WindowChannelAction.minimize);
    }

    private onHomeClick() {
        if (this.props.onHomeClick) {
            this.props.onHomeClick();
        }
    }

    // TODO Should refactor this
    private HomeButton(props) {
        const page = props.page;
        if (page === Page.START) {
            return null;
        }
        else {
            return (
                <button
                    className="toolbar-button home"
                    onClick={this.onHomeClick}
                >
                    <i className="material-icons">home</i>
                </button>
            );
        }
    }

    /********************* React Lifecycle *******************/

    public render(): JSX.Element {
        return (
            <div className="toolbar">
                <this.HomeButton page={this.props.page} />
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
                    <i className="material-icons">{(this.state.windowed ? "fullscreen" : "fullscreen_exit")}</i>
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
