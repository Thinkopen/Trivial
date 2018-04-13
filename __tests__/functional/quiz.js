const request = require('supertest');
const config = require('config');
const jwt = require('jsonwebtoken');
const io = require('socket.io-client');

const App = require('../../app');

const Question = require('../../app/models/question');
const User = require('../../app/models/user');

const app = new App();
const ioOptions = {
  transports: ['websocket'],
  forceNew: true,
  reconnection: false,
};

describe('Functional -> Quiz', () => {
  let client;
  let clientAdmin;

  let ioOptionsUser;
  let ioOptionsAdmin;

  function connectClientAndReturn(namespace, options) {
    return io(`http://localhost:${app.server.address().port}/${namespace}`, options);
  }

  function connectClient(namespace, options) {
    client = connectClientAndReturn(namespace, options);
  }

  beforeEach(() => app.listen()
    .then(() => Promise.all([
      User.create({ name: 'foo', email: 'foo@bar.com' }),
      User.create({ name: 'admin', email: 'admin@bar.com', admin: true }),
    ]))
    .then(([user, admin]) => {
      const tokenUser = jwt.sign(user.toJSON(), config.get('jwt.secret'));
      const tokenAdmin = jwt.sign(admin.toJSON(), config.get('jwt.secret'));

      ioOptionsUser = {
        ...ioOptions,
        query: `auth_token=${tokenUser}`,
      };

      ioOptionsAdmin = {
        ...ioOptions,
        query: `auth_token=${tokenAdmin}`,
        forceNew: true,
      };
    })
    .then(() => Question.importFromArr([
      ['question-1', 'answer-1-1-right', 'answer-1-2-wrong'],
      ['question-2', 'answer-2-1-right', 'answer-2-2-wrong'],
    ])));

  afterEach(() => {
    client.disconnect();

    return app.close();
  });

  test('it should fail if no auth token', () => new Promise((resolve, reject) => {
    delete ioOptionsUser.query;

    connectClient('room-aaa', ioOptionsUser);

    const timeout = setTimeout(() => reject(new Error('Socket didn\'t fail')), 1000);

    client.on('error', (error) => {
      clearTimeout(timeout);

      if (error === 'No auth token') {
        resolve();

        return;
      }

      resolve(error);
    });
  }));

  test('it should fail if invalid auth token', () => new Promise((resolve, reject) => {
    ioOptionsUser.query = ioOptionsUser.query.replace(/A/g, 'B');

    connectClient('room-aaa', ioOptionsUser);

    const timeout = setTimeout(() => reject(new Error('Socket didn\'t fail')), 1000);

    client.on('error', (error) => {
      clearTimeout(timeout);

      if (error === 'Error: Signature verification failed') {
        resolve();

        return;
      }

      resolve(error);
    });
  }));

  test('it should fail if auth token of non existing user', () => new Promise((resolve, reject) => {
    ioOptionsUser.query = `auth_token=${jwt.sign({ id: 'aaa' }, config.get('jwt.secret'))}`;

    connectClient('room-aaa', ioOptionsUser);

    const timeout = setTimeout(() => reject(new Error('Socket didn\'t fail')), 1000);

    client.on('error', (error) => {
      clearTimeout(timeout);

      if (error === 'user does not exist') {
        resolve();

        return;
      }

      resolve(error);
    });
  }));

  test('it should fails when trying to access a non existing room', () => new Promise((resolve, reject) => {
    connectClient('room-aaa', ioOptionsUser);

    const timeout = setTimeout(() => reject(new Error('Socket didn\'t fail')), 1000);

    client.on('error', (error) => {
      reject(error);
    });

    client.on('invalid room id', () => {
      clearTimeout(timeout);

      resolve();
    });
  }));

  function requestActiveRoom() {
    return request(app.app)
      .get('/rooms/active')
      .expect(200)
      .then(({ body: room }) => room);
  }

  function checkWrongEvent(theClient, event, timeout, reject) {
    theClient.off(event);
    theClient.on(event, () => {
      if (timeout) {
        clearTimeout(timeout);
      }

      theClient.disconnect();

      reject(new Error(`Wrong event: ${event}`));
    });
  }

  function setTimeoutForNothing(theClient, reject) {
    return setTimeout(() => {
      reject(new Error('Nothing emitted'));

      theClient.disconnect();
    }, 2000);
  }

  test('it should do the entire quiz', () => requestActiveRoom()
    .then(room => new Promise((resolve, reject) => {
      const roomNamespace = `room-${room.id}`;

      connectClient(roomNamespace, ioOptionsUser);
      clientAdmin = connectClientAndReturn(roomNamespace, ioOptionsAdmin);

      const timeout = setTimeout(() => resolve(), 1000);

      checkWrongEvent(client, 'error', timeout, reject);
      checkWrongEvent(client, 'invalid room id', timeout, reject);
    }))
    .then(() => new Promise((resolve, reject) => {
      clientAdmin.emit('start quiz');

      const timeout = setTimeoutForNothing(clientAdmin, reject);

      clientAdmin.on('question', (question) => {
        clearTimeout(timeout);

        resolve(question.answers[0]);
      });
    }))
    .then(answer => new Promise((resolve, reject) => {
      client.emit('answer', { questionId: answer.questionId, answerId: answer.id });

      const timeout = setTimeoutForNothing(clientAdmin, reject);

      clientAdmin.off('question');
      clientAdmin.on('question', (question) => {
        clearTimeout(timeout);

        resolve(question.answers[0]);
      });

      checkWrongEvent(client, 'score', timeout, reject);
      checkWrongEvent(client, 'invalid question id', timeout, reject);
      checkWrongEvent(client, 'invalid answer id', timeout, reject);
    }))
    .then(answer => new Promise((resolve, reject) => {
      client.emit('answer', { questionId: answer.questionId, answerId: answer.answerId });

      const timeout = setTimeoutForNothing(clientAdmin, reject);

      clientAdmin.off('score');
      clientAdmin.on('score', () => {
        clearTimeout(timeout);

        clientAdmin.disconnect();

        resolve();
      });
    })));
});
