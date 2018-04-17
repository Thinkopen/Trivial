const request = require('supertest');

const App = require('../../../app');
const AbstractController = require('../../../app/controllers');

const app = new App();

describe('Controllers -> Abstract', () => {
  beforeEach(() => app.listen());

  afterEach(() => app.close());

  test('it should throw an error to implement an "abstract" controller', () => {
    expect(() => new AbstractController()).toThrow('"initRouter" method must be implemented');
  });

  test('it should return the 404 page', () => request(app.app)
    .get('/foo')
    .expect(404)
    .then(({ body }) => {
      expect(body).toHaveProperty('error', 'Not found: /foo');
    }));
});
