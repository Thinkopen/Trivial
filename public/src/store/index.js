import Vue from 'vue';
import Vuex from 'vuex';

import * as login from './modules/login';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: { login },
  strict: IS_PROD,
});
