import { IAppState } from "../redux/State";
import { Action, ActionType } from "../actions/Action";
import { AppAction, IChangePageAction } from "../actions/AppActions";
import { Page } from "../utils/Definitions";

const initialAppState: IAppState = {
    page: Page.START,
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
