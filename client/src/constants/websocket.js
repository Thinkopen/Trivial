import { createSocketConstants } from '../utils';

export const port = 3000;
export const host = 'localhost';
export const uri = `http://${host}:${port}/rooms`;

// makes an object of the form {userJoined: 'userJoined'}
export const messageTypes = createSocketConstants([
  'join',
  'start quiz',
  'question',
  'score',
  'answer',
]);
