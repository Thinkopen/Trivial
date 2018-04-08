const request = require('supertest');

const App = require('../../../app');

const Room = require('../../../app/models/room');

const app = new App();

const baseUrl = '/rooms';
const activeUrl = `${baseUrl}/active`;

describe('Controllers -> Room', () => {
  let room;

  beforeEach(() => app.listen()
    .then(async () => {
      room = await Room.create();
    }));

  afterEach(() => app.close());

  test('it should return the non started room', () => request(app.app)
    .get(activeUrl)
    .expect(200)
    .then(({ body: theRoom }) => {
      expect(theRoom).toHaveProperty('id', room.id);
    })
    .then(() => Room.findAll())
    .then(rooms => expect(rooms).toHaveLength(1)));

  test('it should return a new room if no rooms', () => room.destroy()
    .then(() => request(app.app)
      .get(activeUrl)
      .expect(200)
      .then(({ body: theRoom }) => {
        expect(theRoom).toHaveProperty('id');
        expect(theRoom.id).not.toBe(room.id);
      }))
    .then(() => Room.findAll())
    .then(rooms => expect(rooms).toHaveLength(1)));

  test('it should return a new room if only started rooms', () => room.setStarted()
    .then(() => request(app.app)
      .get(activeUrl)
      .expect(200)
      .then(({ body: theRoom }) => {
        expect(theRoom).toHaveProperty('id');
        expect(theRoom.id).not.toBe(room.id);
      }))
    .then(() => Room.findAll())
    .then(rooms => expect(rooms).toHaveLength(2)));
});
