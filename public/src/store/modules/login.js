export const state = {
  facebook: null,
  google: null,
};

export const getters = {
  getFacebook: theState => theState.facebook,
  getGoogle: theState => theState.google,
  anyLogin: theState => theState.facebook || theState.google,
};

export const actions = {
  setFacebook({ commit }, userId) {
    commit('setFacebookId', userId);
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
};
