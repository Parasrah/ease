import { ActionType } from "../actions/Action";
import { IResizePageAction, WindowAction } from "../actions/WindowActions";
import { IWindowState } from "../redux/State";

const initialWindowState: IWindowState = {
    height: 600,
    width: 800,
};

const windowState = (state: IWindowState = initialWindowState, action: WindowAction): IWindowState => {
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
