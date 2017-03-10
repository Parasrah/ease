import { applyMiddleware, createStore, Store } from "redux";
import * as createLogger from "redux-logger";
import thunkMiddleware from "redux-thunk";
import IState from "./State";

import { Action, ThunkAction } from "redux";
import easeReducer from "../reducers/Reducer";

const loggerMiddleware = createLogger();

export class StoreWrapper {
    private static instance = null;

    private store: Store<IState>;

    private constructor() {
        this.store = StoreWrapper.configureStore();
    }

    public getStore(): Store<IState> {
        return this.store;
    }

    public static getInstance(): StoreWrapper {
        if (StoreWrapper.instance === null) {
            StoreWrapper.instance = new StoreWrapper();
        }

        return StoreWrapper.instance;
    }

    public getState(): IState {
        return this.store.getState();
    }

    public dispatch(action: Action | ThunkAction<any, IState, any>) {
        this.store.dispatch(action as any);
    }

    /**
     * Generate a store, should not be called directly save for testing purposes
     * @param preloadedState - initial state for store
     */
    public static configureStore(preloadedState?: IState, log?: boolean) {
        let middleware;
        if (log === false) {
            middleware = applyMiddleware(
                thunkMiddleware,
            );
        }
        else {
            middleware = applyMiddleware(
                thunkMiddleware,
                loggerMiddleware,
            );
        }

        return createStore<IState>(
            easeReducer,
            preloadedState,
            middleware,
        );
    }
}
