<template>
  <fb-signin-button
    :params="fbSignInParams"
    @success="onSignInSuccess"
    @error="onSignInError">
    Sign in with Facebook
  </fb-signin-button>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'App',

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
.fb-signin-button {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 3px;
  background-color: #4267b2;
  color: #fff;
  cursor: pointer;
}
</style>
