import camelcase from 'camelcase';
import io from 'socket.io-client';

export const state = {
  roomClient: null,
};

export const getters = {

};

export const actions = {
  initRoomClient({ commit }, jwt, isAdmin) {
    const client = io('/rooms', {
      query: `auth_token=${jwt}&admin=${isAdmin ? '1' : '0'}`,
    });

    const onevent = client.onevent;
    client.onevent = function (packet) {
      const args = packet.data || [];
      onevent.call(this, packet); // original call
      packet.data = ['*'].concat(args);
      onevent.call(this, packet); // additional call to catch-all
    };

    client.on('*', (event, data) => {
      const mutation = camelcase(`event ${event}`);

      commit(mutations[mutation] ? mutation : 'eventError', data, event);
    });

    commit('setRoomClient', client);
  },

  joinRoom({ state: { roomClient } }, roomId) {
    roomClient.emit('join', roomId);
  },

  startQuiz({ state: { roomClient } }) {
    roomClient.emit('start quiz');
  },
};

export const mutations = {
  setRoomClient(theState, client) {
    theState.roomClient = client;
  },

  eventQuestion(question) {
    console.log(question);
  },

  eventScore(score) {
    console.log(score);
  },

  eventError(data, event) {
    console.log(event);
    console.log(data);
  },
};
