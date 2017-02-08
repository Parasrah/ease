import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Start } from './start/Start';

export class AppContainer extends React.Component<{}, {}> {
    
    constructor() {
        super();
    }

    render() : JSX.Element {
        return (
            <Start />
        );
    }
}
