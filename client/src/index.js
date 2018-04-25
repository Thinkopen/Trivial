import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { init as websocketInit } from './actions/websocket';
import { getSettings } from './actions/settings';

import App from './App';
import registerServiceWorker from './registerServiceWorker';

import './index.css';

import store from './store';

websocketInit(store); // setup websocket listeners etc
getSettings(store);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
registerServiceWorker();
