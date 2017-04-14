import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { StoreWrapper } from "../redux/Store";
import EaseContainer from "./Ease";

ReactDOM.render((
    <Provider store={StoreWrapper.getInstance().getStore()} >
        <EaseContainer />
    </Provider>),
    document.getElementById("app"),
);
