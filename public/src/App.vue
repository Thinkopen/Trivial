<template>
  <div id="app">
    <img src="./assets/logo.png">

    <SocialLogin v-if="!isUser"/>

    <router-view v-else/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import SocialLogin from './components/SocialLogin.vue';

export default {
  name: 'App',

  components: { SocialLogin },

  computed: {
    ...mapGetters(['isUser']),
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
</style>
