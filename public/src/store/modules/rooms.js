import roomsApi from '../../api/rooms';

export const state = {
  room: null,
};

export const getters = {
  getRoom: theState => theState.room,
};

export const actions = {
  async retrieveActiveRoom({ commit }) {
    const room = await roomsApi.getActive();

    commit('setRoom', room);
  },
};

export const mutations = {
  setRoom(theState, room) {
    theState.room = room;
  },
};
