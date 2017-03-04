import { SIGNAL_HOST } from "../../constants/Constants";
import { ToAction, ActionType } from "../actions/Action";
import { ISetSignalHostAction, SettingsAction } from "../actions/SettingsActions";
import { ISettingsState } from "../redux/State";

const initialSettingsState: ISettingsState = {
    signalHost: SIGNAL_HOST,
};

const settingsState = (state: ISettingsState = initialSettingsState, action: ToAction<SettingsAction>): ISettingsState => {
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
