import { createSocketConstants } from '../utils';

// makes an object of the form {userJoined: 'userJoined'}
export const messageTypes = createSocketConstants([
  'join',
  'start quiz',
  'question',
  'score',
  'answer',
]);
