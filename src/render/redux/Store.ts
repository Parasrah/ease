import thunkMiddleware from "redux-thunk";
import { createStore, applyMiddleware } from "redux";
import * as createLogger from "redux-logger";
import IState from "./State";

import appReducer from "./Reducers";

const loggerMiddleware = createLogger();

const configureStore = (preloadedState?: IState) => {
    return createStore(
        appReducer,
        preloadedState,
        applyMiddleware(
            thunkMiddleware,
            loggerMiddleware,
        ),
    );
};

export default configureStore;
