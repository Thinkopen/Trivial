import Vue from 'vue';
import Router from 'vue-router';

import RoomContainer from '../components/Room/Container';

Vue.use(Router);

export default new Router({
  routes: [{
    path: '/',
    name: 'Room',
    component: RoomContainer,
  }],
});
