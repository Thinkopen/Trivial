import { fromJS } from 'immutable';
import { GET_REQUEST, GET_SUCCESS, GET_ERROR } from '../constants/settings';

// Initial state
const initialState = fromJS({
  loading: false,
  error: false,
  data: fromJS([]),
});

// Reducer
const settings = (state = initialState, { type, settings, error }) => {
  switch (type) {
    case GET_REQUEST:
      return state
        .set('loading', true)
        .set('error', false);

    case GET_SUCCESS:
      return state
        .set('loading', false)
        .set('error', false)
        .set('data', fromJS(settings));

    case GET_ERROR:
      return state
        .set('loading', false)
        .set('error', error);

    default:
      return state;
  }
};

export default settings;
