import { messageTypes } from '../constants/websocket';

export const startQuiz = () => (dispatch, getState, { emit }) => {
  emit(messageTypes['start quiz']);
}

export const postAnswer = payload => (dispatch, getState, { emit }) => {
  emit(messageTypes.answer, payload);
}
