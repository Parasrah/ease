import { button, ButtonFoundation } from "material-components-web";
import * as React from "react";

interface IButtonProps {

}

interface IButtonState {

}

export default class Button extends React.PureComponent<IButtonProps, IButtonState> {
    private foundation;

    constructor(props: IButtonProps) {
        super(props);
        this.state = {

        };
    }

    private setupFoundation() {

    }

    /************************ React Lifecycle ****************************/

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    componentWillReceiveProps() {

    }

    componentDidUpdate() {

    }

    public render(): JSX.Element {
        return (
            <div className="test" />
        );
    }
}
