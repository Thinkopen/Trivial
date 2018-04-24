<template>
  <div id="app">
    <img src="./assets/logo.png">
    <fb-signin-button
      v-if="!isUser"
      :params="fbSignInParams"
      @success="onSignInSuccess"
      @error="onSignInError">
      Sign in with Facebook
    </fb-signin-button>

    <router-view v-else/>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'App',

  computed: {
    ...mapGetters(['isUser']),
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
    onSignInSuccess({ authResponse }) {
      this.setFacebook(authResponse);
    },

    onSignInError(error) {
      console.log('OH NOES', error);
    },

    ...mapActions(['setFacebook']),
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
