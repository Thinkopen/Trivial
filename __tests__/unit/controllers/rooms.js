const request = require('supertest');

const App = require('../../../app');

const Room = require('../../../app/models/room');

const app = new App();

const baseUrl = '/rooms';
const activeUrl = `${baseUrl}/active`;

describe('Controllers -> Room', () => {
  let token;

  beforeEach(() => app.listen()
    .then(() => Room.create())
    .then(() => request(app.app)
      .post('/auth/validateFacebookToken')
      .send({ token: 'right-token' })
      .expect(200)
      .then(({ body: { token: theToken } }) => {
        token = theToken;
      })));

  afterEach(() => app.close());

  test('it should return the non started room', () => Room.findOne()
    .then(room => request(app.app)
      .get(activeUrl)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(({ body: theRoom }) => expect(theRoom).toHaveProperty('id', room.id)))
    .then(() => Room.findAll())
    .then(rooms => expect(rooms).toHaveLength(1)));

  test('it should return a new room if no rooms', () => Room.findOne()
    .then(room => room.destroy()
      .then(() => request(app.app)
        .get(activeUrl)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body: theRoom }) => {
          expect(theRoom).toHaveProperty('id');
          expect(theRoom.id).not.toBe(room.id);
        })))
    .then(() => Room.findAll())
    .then(rooms => expect(rooms).toHaveLength(1)));

  test('it should return a new room if only started rooms', () => Room.findOne()
    .then(room => room.setStarted()
      .then(() => request(app.app)
        .get(activeUrl)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body: theRoom }) => {
          expect(theRoom).toHaveProperty('id');
          expect(theRoom.id).not.toBe(room.id);
        })))
    .then(() => Room.findAll())
    .then(rooms => expect(rooms).toHaveLength(2)));

  test('it should not allow the access if the user isn\'t authenticated', () => request(app.app)
    .get(activeUrl)
    .expect(401)
    .then(({ body }) => expect(body).toHaveProperty('error', 'Unauthorized')));
});
