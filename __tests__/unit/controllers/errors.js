const request = require('supertest');

const App = require('../../../app');

const app = new App();

describe('Controllers -> Errors', () => {
  beforeEach(() => app.listen());

  afterEach(() => app.close());

  test('it should catch "normal" errors', () => request(app.app)
    .get('/errors')
    .expect(500)
    .then(({ body }) => expect(body).toHaveProperty('error', 'Simple error')));

  test('it should catch "promise" errors', () => request(app.app)
    .get('/errors/promise')
    .expect(500)
    .then(({ body }) => expect(body).toHaveProperty('error', 'Promise error')));

  test('it should catch "next" errors', () => request(app.app)
    .get('/errors/next')
    .expect(500)
    .then(({ body }) => expect(body).toHaveProperty('error', 'Next error')));
});
