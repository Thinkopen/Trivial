import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

import * as login from './modules/login';
import * as rooms from './modules/rooms';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: { login, rooms },
  strict: IS_PROD,
  // plugins: [createPersistedState()],
});