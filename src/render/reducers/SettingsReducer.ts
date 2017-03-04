import { ISettingsState } from "../redux/State";
import { Action, ActionType } from "../actions/Action";
import { SettingsAction, ISetSignalHostAction } from "../actions/SettingsActions";
import { SIGNAL_HOST } from "../../constants/Constants";

const initialSettingsState: ISettingsState = {
    signalHost: SIGNAL_HOST,
};

const settingsState = (state: ISettingsState = initialSettingsState, action: Action<SettingsAction>): ISettingsState => {
    const types = ActionType.settingsAction;

    switch (action.type) {
        case types.setSignalHostAction:
            return Object.assign({}, state, {
                signalHost: (action as ISetSignalHostAction).signalHost,
            });

        default:
            return state;
    }
};

export default settingsState;
