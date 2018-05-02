import authApi from '../../api/auth';

export const state = {
  facebook: null,
  google: null,
  user: null,
};

export const getters = {
  facebook: theState => theState.facebook,
  google: theState => theState.google,

  user: theState => theState.user,
};

export const actions = {
  async setFacebook({ commit, dispatch }, { userID: userId, accessToken }) {
    commit('setFacebookId', userId);

    const { user, jwtToken } = await authApi.validateFacebookToken(accessToken);

    commit('setUser', user);

    dispatch('initRoomClient', jwtToken, user.admin);
  },

  setGoogle({ commit }, userId) {
    commit('setGoogleId', userId);
  },
};

export const mutations = {
  setFacebookId(theState, userId) {
    theState.facebook = userId;
  },

  setGoogleId(theState, userId) {
    theState.google = userId;
  },

  setUser(theState, user) {
    theState.user = user;
  },
};
