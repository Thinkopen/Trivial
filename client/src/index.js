import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { Map } from 'immutable';
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import rootReducer from './reducers';

import { emit } from './actions/websocket';
import { getSettings } from './actions/settings';

import App from './components/App';
import registerServiceWorker from './registerServiceWorker';

import './index.css';

const initialState = new Map()
  .set('settings', new Map());

const initStore = () => {
  let composeEnhancers = compose;
  const middleware = [thunkMiddleware.withExtraArgument({ emit })];

  if (process.env.NODE_ENV === 'development') {
    middleware.push(createLogger());
    // eslint-disable-next-line no-underscore-dangle
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  }

  const enhancer = composeEnhancers(applyMiddleware(...middleware));
  const store = createStore(rootReducer, initialState, enhancer);

  getSettings(store);

  return store;
}

ReactDOM.render(
  <Provider store={initStore()}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
registerServiceWorker();
