const port = 3000;
const host = 'localhost';

// makes an object of the form {userJoined: 'userJoined'}
const messageTypes = [
  'startQuiz',
].reduce((result, msg) => Object.assign(result, { [msg]: msg }), {});

module.exports = {
  port,
  host,
  messageTypes,
  uri: `http://${host}:${port}`,
};
