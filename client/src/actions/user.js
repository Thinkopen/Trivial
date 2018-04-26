import axios from 'axios';
import { SET_REQUEST, SET_SUCCESS } from '../constants/user';
import { init as websocketInit } from '../actions/websocket';

const setUserRequest = () => ({
  type: SET_REQUEST,
});
const setUserSuccess = (profile, token) => ({
  type: SET_SUCCESS,
  profile,
  token,
});

export const setUser = user => (dispatch, getState) => {
  dispatch(setUserRequest(user));

  return axios.post('auth/validateFacebookToken', {
    token: user.accessToken,
  })
    .then(({ data: { user: profile, token } }) => {
      dispatch(setUserSuccess(profile, token));
      websocketInit(dispatch, getState);

      return Promise.resolve();
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}
