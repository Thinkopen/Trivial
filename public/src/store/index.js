import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

import * as login from './modules/login';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: { login },
  strict: IS_PROD,
  plugins: [createPersistedState()],
});
