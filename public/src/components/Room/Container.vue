<template>
  <div id="room-container">
    <RoomSelection v-if="!room"/>

    <RoomWaiting v-if="room"/>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  import RoomSelection from './RoomSelection';
  import RoomWaiting from './RoomWaiting';

  export default {
    name: 'RoomContainer',

    components: { RoomSelection, RoomWaiting },

    computed: {
      ...mapGetters({
        room: 'getRoom',
      }),
    },
  };
</script>
