import { Map } from 'immutable';
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import rootReducer from './reducers';

import { emit } from './actions/websocket';

const initialState = new Map()
  .set('settings', new Map());

let composeEnhancers = compose;
const middleware = [thunkMiddleware.withExtraArgument({ emit })];

if (process.env.NODE_ENV === 'development') {
  middleware.push(createLogger());
  // eslint-disable-next-line no-underscore-dangle
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}

const enhancer = composeEnhancers(applyMiddleware(...middleware));

const store = createStore(rootReducer, initialState, enhancer);

export default store;
