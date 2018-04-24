import authApi from '../../api/auth';

export const state = {
  facebook: null,
  google: null,
  user: null,
};

export const getters = {
  getFacebook: theState => theState.facebook,
  getGoogle: theState => theState.google,

  isUser: theState => theState.user,
};

export const actions = {
  async setFacebook({ commit }, { userID: userId, accessToken }) {
    commit('setFacebookId', userId);

    const { user } = await authApi.validateFacebookToken(accessToken);

    commit('setUser', user);
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
