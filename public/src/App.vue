<template>
  <div id="app">
    <img
      src="./assets/top-white.png"
      class="main-logo">

    <SocialLogin v-if="!isUser"/>

    <router-view v-else/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import SocialLogin from './components/SocialLogin/Container';

export default {
  name: 'App',

  components: { SocialLogin },

  computed: {
    ...mapGetters(['isUser']),
  },
};
</script>

<style>
body {
  background: #534292;
  color: white;
}

.main-logo {
  margin-bottom: 30px;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin-top: 40px;
}
</style>
