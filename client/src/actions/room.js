import axios from 'axios';
import { GET_REQUEST, GET_SUCCESS, GET_ERROR } from '../constants/room';
import store from '../store';

const getRequest = () => ({ type: GET_REQUEST });
const getSuccess = room => ({
  type: GET_SUCCESS,
  room,
});
const getError = error => ({
  type: GET_ERROR,
  error,
});

export const getRoom = () => (dispatch) => {
  dispatch(getRequest());

  // return axios.get('rooms/active')
  return axios({
    method: 'get',
    url: 'rooms/active',
    headers: {
      Authorization: `Bearer ${store.getState().getIn(['user', 'token'])}`,
    },
  })
    .then(({ data }) => {
      dispatch(getSuccess(data));

      return Promise.resolve(data);
    })
    .catch((error) => {
      dispatch(getError(error));

      return Promise.reject(error);
    });
}
