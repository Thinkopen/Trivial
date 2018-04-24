<template>
  <div>
    <h1>Tutto App-posto</h1>

    <button @click="enterRoom">
      Entra nella prossima partita
    </button>
  </div>
</template>

<script>
  import { mapActions } from 'vuex';

  export default {
    methods: {
      async enterRoom() {
        this.retrieveActiveRoom();
      },

      ...mapActions(['retrieveActiveRoom']),
    },
  }
</script>
