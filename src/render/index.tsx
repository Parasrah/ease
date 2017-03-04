import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";

import EaseContainer from "./Ease";
import { StoreWrapper } from "./redux/Store";

ReactDOM.render((
    <Provider store={StoreWrapper.getInstance().getStore()} >
        <EaseContainer />
    </Provider>),
    document.getElementById("app"),
);
