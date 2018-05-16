import io from 'socket.io-client';
import { messageTypes } from '../constants/websocket';

let socket;

const init = (dispatch, getState) => {
  const user = getState().get('user');
  const uri = getState().getIn(['settings', 'data', 'baseUrl']);

  // add listeners to socket messages so we can re-dispatch them as actions
  socket = io(
    `${uri}/rooms`,
    {
      query: `auth_token=${user.get('token')}&admin=${user.getIn(['profile', 'admin']) ? 1 : 0}`,
      transports: ['websocket', 'polling']
    },
  );

  Object
    .keys(messageTypes)
    .forEach(type => socket.on(type, payload => dispatch({ type, payload })));
};

const emit = (type, payload) => socket && socket.emit(type, payload);

export {
  init,
  emit,
};
