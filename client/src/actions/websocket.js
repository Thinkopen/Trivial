import io from 'socket.io-client';
import { messageTypes, uri } from '../constants/websocket';

let socket;

const init = (dispatch, getState) => {
  // add listeners to socket messages so we can re-dispatch them as actions
  socket = io(uri, { query: `auth_token=${getState().get('user').get('token')}&admin=0` });

  Object
    .keys(messageTypes)
    .forEach(type => socket.on(type, payload => dispatch({ type, payload })));
};

const emit = (type, payload) => socket && socket.emit(type, payload);

export {
  init,
  emit,
};
