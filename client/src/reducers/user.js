import { Map, fromJS } from 'immutable';
import { SET_REQUEST, SET_SUCCESS, SET_ERROR } from '../constants/user';

// Initial state
const initialState = Map();

// Reducer
const user = (state = initialState, { type, profile, token }) => {
  switch (type) {
    case SET_REQUEST:
      return state
        .set('profile', profile);

    case SET_SUCCESS:
      return state
        .set('token', token)
        .set('profile', profile);

    default:
      return state;
  }
};

export default user;
