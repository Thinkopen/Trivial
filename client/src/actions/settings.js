import axios from 'axios';
import { GET_REQUEST, GET_SUCCESS, GET_ERROR } from '../constants/settings';

const getRequest = () => ({ type: GET_REQUEST });
const getSuccess = settings => ({
  type: GET_SUCCESS,
  settings,
});
const getError = error => ({
  type: GET_ERROR,
  error,
});

export const getSettings = ({ dispatch }) => {
  dispatch(getRequest());

  return axios.get('settings')
    .then(({ data }) => {
      dispatch(getSuccess(data));

      return Promise.resolve(data);
    })
    .catch((error) => {
      dispatch(getError(error));

      return Promise.reject(error);
    });
}
