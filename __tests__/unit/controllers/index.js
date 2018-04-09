const request = require('supertest');

const App = require('../../../app');

const app = new App();

describe('Controllers -> Abstract', () => {
  beforeEach(() => app.listen());

  afterEach(() => app.close());

  test('it should return the 404 page', () => request(app.app)
    .get('/foo')
    .expect(404)
    .then(({ body }) => {
      expect(body).toHaveProperty('error', 'Not found: /foo');
    }));
});
