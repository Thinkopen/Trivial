import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { List, Map } from 'immutable';
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { combineReducers } from 'redux-immutable';

// import rootReducer from './reducers';
import { init as websocketInit, emit } from './actions/websocket';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import './index.css';

const initialState = new Map()
  .set('questions', new List());

function startUp() {
  let composeEnhancers = compose;
  const middleware = [thunkMiddleware.withExtraArgument({ emit })];

  if (process.env.NODE_ENV === 'development') {
    middleware.push(createLogger());
    // eslint-disable-next-line no-underscore-dangle
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  }

  const enhancer = composeEnhancers(applyMiddleware(...middleware));

  const store = createStore(combineReducers({}), initialState, enhancer);
  websocketInit(store); // setup websocket listeners etc

  return store;
}


ReactDOM.render(
  <Provider store={startUp()}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
registerServiceWorker();
