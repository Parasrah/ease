import React, { PureComponent } from "react";

interface IButtonProps {

}

interface IButtonState {

}

export default class Button extends PureComponent<IButtonProps, IButtonState> {

    constructor(props: IButtonProps) {
        super(props);
        this.state = {

        };
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
