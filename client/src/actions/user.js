import axios from 'axios';
import { SET_REQUEST, SET_SUCCESS } from '../constants/user';

const setUserRequest = ({ profile }) => ({
  type: SET_REQUEST,
  profile,
});
const setUserSuccess = (profile, token) => ({
  type: SET_SUCCESS,
  profile,
  token,
});

export const setUser = user => (dispatch) => {
  dispatch(setUserRequest(user));

  return axios.post('auth/validateFacebookToken', {
    token: user.tokenDetail.accessToken,
  })
    .then(({ data: { user: profile, token } }) => {
      dispatch(setUserSuccess(profile, token));
      return Promise.resolve();
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}
