<template>
  <div id="app">
    <img src="./assets/logo.png">
    <fb-signin-button
      :show="!anyLogin"
      :params="fbSignInParams"
      @success="onSignInSuccess"
      @error="onSignInError">
      Sign in with Facebook
    </fb-signin-button>
    <!--<router-view :show="anyLogin"/>-->
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'App',

  computed: {
    ...mapGetters({
      anyLogin: 'anyLogin',
    }),
  },

  data() {
    return {
      fbSignInParams: {
        scope: 'public_profile,email',
        return_scopes: true,
      },
    };
  },

  methods: {
    onSignInSuccess(response) {
      console.log(response);
      FB.api('/me', dude => console.log(`Good to see you, ${dude.name}.`));
    },
    onSignInError(error) {
      console.log('OH NOES', error);
    },
  },
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.fb-signin-button {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 3px;
  background-color: #4267b2;
  color: #fff;
  cursor: pointer;
}
</style>
