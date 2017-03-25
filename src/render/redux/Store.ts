import { Action, applyMiddleware, createStore, Store } from "redux";
// tslint:disable-next-line:no-var-requires
const createLogger = require("redux-logger").default;
import thunkMiddleware, { ThunkAction } from "redux-thunk";

import easeReducer from "../reducers/Reducer";
import IState from "./State";

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
