import { combineReducers } from 'redux-immutable'
import settings from './settings';
import user from './user';

export default combineReducers({
  settings,
  user,
})
