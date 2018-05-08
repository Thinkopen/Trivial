const config = require('config');
const request = require('supertest');

const App = require('../../../app');

const app = new App();

const baseUrl = '/settings';

describe('Controllers -> Settings', () => {
  beforeEach(() => app.listen());

  afterEach(() => app.close());

  test('it should expose the app settings', () => request(app.app)
    .get(baseUrl)
    .expect(200)
    .then(({ body: settings }) => {
      expect(settings).toBeDefined();

      expect(settings).toHaveProperty('environment', config.get('environment'));
      expect(settings).toHaveProperty('baseUrl', config.get('server.baseUrl'));
      expect(settings).toHaveProperty('quiz', config.get('quiz'));
      expect(settings).toHaveProperty('facebookClientId', config.get('facebook.clientId'));
      expect(settings).toHaveProperty('questionsCount', 0);
    }));
});
