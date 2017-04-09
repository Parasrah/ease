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
    }

    /************************ Methods ************************/

    /********************* React Lifecycle *******************/

    public render(): JSX.Element {
        return (
            <div className="toolbar">
                <button className="toolbar-button home">
                    <i className="material-icons">home</i>
                </button>
                <button className="toolbar-button toolbar-right close">
                    <i className="material-icons">close</i>
                </button>
                <button className="toolbar-button toolbar-right window">
                    <i className="material-icons">{(this.state.windowed ? "fullscreen" : "fullscreen_exit")}</i>
                </button>
                <button className="toolbar-button toolbar-right minimize">
                    <i className="material-icons">remove</i>
                </button>
            </div>
        );
    }
}
