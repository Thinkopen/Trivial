import { fromJS, List } from 'immutable';
import { messageTypes } from '../constants/websocket';

const initialState = fromJS({
  questions: new List(),
  scores: new List(),
});

const quiz = (state = initialState, { type, payload }) => {
  const { question, score } = messageTypes;

  if (type === question) {
    return state.set('questions', state.get('questions').push(fromJS(payload)));
  } else if (type === score) {
    return state.set('scores', fromJS(payload));
  }

  return state;
}

export default quiz;
