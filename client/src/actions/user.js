import axios from 'axios';
import { SET } from '../constants/user';

const setUserSuccess = user => ({
  type: SET,
  user,
});

export const setUser = user => (dispatch) => {
  dispatch(setUserSuccess(user));

  return axios.post('auth/validateFacebookToken', {
    token: user.tokenDetail.accessToken,
  })
    .then(({ data }) => {
      return Promise.resolve(data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}
