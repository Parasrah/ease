import * as React from "React";

import "../../style/toolbar.less";

interface IToolbarProps {

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

    }

    private onWindowClick() {
        this.setState({
            windowed: !this.state.windowed,
        });
    }

    private onMinimizeClick() {

    }

    private onHomeClick() {

    }

    /********************* React Lifecycle *******************/

    public render(): JSX.Element {
        return (
            <div className="toolbar">
                <button
                    className="toolbar-button home"
                    onClick={this.onHomeClick}
                >
                    <i className="material-icons">home</i>
                </button>
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
