import { createSocketConstants } from '../utils';

export const port = 3000;
export const host = 'localhost';
export const uri = `http://${host}:${port}`;

// makes an object of the form {userJoined: 'userJoined'}
export const messageTypes = createSocketConstants([
  'startQuiz',
]);
