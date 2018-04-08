const request = require('supertest');

const App = require('../../../app');

const Room = require('../../../app/models/room');

const baseUrl = '/rooms';
const activeUrl = `${baseUrl}/active`;

describe('Controllers -> Room', () => {
  let app;

  let room;

  beforeAll(() => {
    app = new App();

    return app.listen();
  });

  beforeEach(async () => {
    room = await Room.create();
  });

  afterAll(() => app.close());

  test('it should return the non started room', () => request(app.app)
    .get(activeUrl)
    .expect(200)
    .then(({ body }) => {
      expect(body).toHaveProperty('id', room.id);
    })
    .then(() => Room.findAll())
    .then(rooms => expect(rooms).toHaveLength(1)));

  test('it should return a new room if no rooms', () => room.destroy()
    .then(() => request(app.app)
      .get(activeUrl)
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty('id');
        expect(body.id).not.toBe(room.id);
      }))
    .then(() => Room.findAll())
    .then(rooms => expect(rooms).toHaveLength(1)));

  test('it should return a new room if only started rooms', () => room.setStarted()
    .then(() => request(app.app)
      .get(activeUrl)
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty('id');
        expect(body.id).not.toBe(room.id);
      }))
    .then(() => Room.findAll())
    .then(rooms => expect(rooms).toHaveLength(2)));
});
