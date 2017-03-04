import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";

import EaseContainer from "./Ease";
import configureStore from "./redux/Store";

const store = configureStore();

ReactDOM.render((
    <Provider store={store} >
        <EaseContainer />
    </Provider>),
    document.getElementById("app"),
);
