import '@babel/polyfill';
import React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from 'mobx-react';
import { BrowserRouter } from 'react-router-dom';
import AppState from '../store';
import App from './containers/App';

const appstate = new AppState(window.__INITIAL_STATE__);

hydrate(
    <Provider appstate={appstate}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>, document.getElementById('app-container'));
