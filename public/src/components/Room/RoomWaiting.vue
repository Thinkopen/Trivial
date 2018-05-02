<template>
  <button
    v-if="user.admin"
    @click="startQuiz">
    Start Quiz
  </button>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';

  export default {
    name: 'RoomWaiting',

    computed: {
      ...mapGetters(['user']),
    },

    methods: {
      ...mapActions(['startQuiz']),
    },
  }
</script>
