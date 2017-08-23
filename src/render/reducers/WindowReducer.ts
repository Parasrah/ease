import { ActionType } from "../actions/Action";
import { WindowAction } from "../actions/WindowActions";
import { IWindowState } from "../redux/State";

const initialWindowState: IWindowState = {
    maximized: false,
};

const windowState = (state: IWindowState = initialWindowState, action: WindowAction): IWindowState => {
    const types = ActionType.windowAction;

    switch (action.type) {

        case types.maximizeAction:
            return Object.assign({}, state, {
                maximized: true,
            });

        case types.unmaximizeAction:
            return Object.assign({}, state, {
                maximized: false,
            });

        default:
            return state;
    }
};

export default windowState;
