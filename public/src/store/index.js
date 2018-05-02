import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

import * as login from './modules/login';
import * as rooms from './modules/rooms';
import * as socket from './modules/socket';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: { login, rooms, socket },
  strict: IS_PROD,
  // plugins: [createPersistedState()],
});
