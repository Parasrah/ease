import { IAppState } from "../redux/State";
import { Action, ActionType } from "../Actions/Action";
import { AppAction, IChangePageAction } from "../Actions/AppActions";
import { Page } from "../utils/Definitions";

const initialAppState: IAppState = {
    page: Page.VIDEO_HOST,
    error: [],
};

const appState = (state: IAppState = initialAppState, action: Action<AppAction>): IAppState => {
    const types = ActionType.appAction;

    switch (action.type) {

        case types.changePageAction:
            return Object.assign({}, state, {
                page: (action as IChangePageAction).page,
            });

        default:
            return state;
    }
};

export default appState;
