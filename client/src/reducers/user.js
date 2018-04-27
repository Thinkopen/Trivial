import { Map, fromJS } from 'immutable';
import { SET_REQUEST, SET_SUCCESS, SET_ERROR } from '../constants/user';

// Initial state
const initialState = fromJS({
  profile: new Map(),
  token: null,
  logged: false,
});

// Reducer
const user = (state = initialState, { type, profile, token }) => {
  switch (type) {
    case SET_REQUEST:
    case SET_ERROR:
      return state;

    case SET_SUCCESS:
      return state
        .set('token', token)
        .set('profile', fromJS(profile))
        .set('logged', true);

    default:
      return state;
  }
};

export default user;
