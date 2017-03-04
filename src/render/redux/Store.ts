import { applyMiddleware, createStore } from "redux";
import * as createLogger from "redux-logger";
import thunkMiddleware from "redux-thunk";
import IState from "./State";

import easeReducer from "../reducers/Reducer";

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
