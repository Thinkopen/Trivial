<template>
  <div id="room-container">
    <RoomSelection v-if="!room"/>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  import RoomSelection from './RoomSelection';

  export default {
    name: 'RoomContainer',

    components: { RoomSelection },

    computed: {
      ...mapGetters({
        room: 'getRoom',
      }),
    },
  };
</script>
