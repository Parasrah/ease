import * as React from "react";
import * as ReactDOM from "react-dom";
import app from "./redux/Reducers";
import { createStore } from "redux";
import { Provider } from "react-redux";

const store = createStore(app);

import EaseContainer from "./Ease";

ReactDOM.render((
    <Provider store={store} >
        <EaseContainer />
    </Provider>),
    document.getElementById("app"),
);
