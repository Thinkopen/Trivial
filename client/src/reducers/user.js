import { Map, fromJS } from 'immutable';
import { SET } from '../constants/user';

// Initial state
const initialState = Map();

// Reducer
const user = (state = initialState, { type, user }) => {
  switch (type) {
    case SET:
      return fromJS(user);

    default:
      return state;
  }
};

export default user;
