import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";

import configureStore from "./redux/Store";
import EaseContainer from "./Ease";

const store = configureStore();

ReactDOM.render((
    <Provider store={store} >
        <EaseContainer />
    </Provider>),
    document.getElementById("app"),
);
