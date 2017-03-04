import { IWindowState } from "../redux/State";
import { Action, ActionType } from "../actions/Action";
import { WindowAction, IResizePageAction } from "../actions/WindowActions";

const initialWindowState: IWindowState = {
    height: 600,
    width: 800,
};

const windowState = (state: IWindowState = initialWindowState, action: Action<WindowAction>): IWindowState => {
    const types = ActionType.windowAction;

    switch (action.type) {

        case types.resizePageAction:
            return Object.assign({}, state, {
                height: (action as IResizePageAction).height,
                width: (action as IResizePageAction).width,
            });

        default:
            return state;
    }
};

export default windowState;
