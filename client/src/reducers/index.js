import { combineReducers } from 'redux-immutable'
import settings from './settings';
import user from './user';
import room from './room';
import quiz from './quiz';

export default combineReducers({
  settings,
  user,
  room,
  quiz,
})
