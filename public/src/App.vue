<template>
  <div id="app">
    <img
      src="./assets/top-white.png"
      class="main-logo">

    <SocialLogin v-if="!user"/>

    <Room v-else/>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  import Room from './components/Room/Container';
  import SocialLogin from './components/SocialLogin/Container';

  export default {
    name: 'App',

    components: { Room, SocialLogin },

    computed: {
      ...mapGetters(['user']),
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
