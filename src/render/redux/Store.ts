import thunkMiddleware from "redux-thunk";
import { createStore, applyMiddleware } from "redux";
import * as createLogger from "redux-logger";
import IState from "./State";

import easeReducer from "../Reducers/Reducer";

const loggerMiddleware = createLogger();

const configureStore = (preloadedState?: IState) => {
    return createStore(
        easeReducer,
        preloadedState,
        applyMiddleware(
            thunkMiddleware,
            loggerMiddleware,
        ),
    );
};

export default configureStore;
