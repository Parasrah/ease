import { ActionType } from "../actions/Action";
import { IBlockResizeAction, WindowAction } from "../actions/WindowActions";
import { IWindowState } from "../redux/State";

const initialWindowState: IWindowState = {
    maximized: false,
    blockResize: false,
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

        case types.blockResizeAction:
            return Object.assign({}, state, {
                blockResize: (action as IBlockResizeAction).block,
            });

        default:
            return state;
    }
};

export default windowState;
