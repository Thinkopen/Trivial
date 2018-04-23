import Vue from 'vue';
import FBSignInButton from 'vue-facebook-signin-button';

import App from './App';
import store from './store';
import router from './router';

Vue.config.productionTip = false;

Vue.use(FBSignInButton);

(function initFacebook(d, s, id) {
  const fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  const js = d.createElement(s); js.id = id;
  js.src = `https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.12&appId=${FB_CLIENT_ID}`;
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
});
