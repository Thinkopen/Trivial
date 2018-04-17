const config = require('config');
const moment = require('moment');
const request = require('supertest');

const App = require('../../../app');

const jwt = require('../../../app/libraries/jwt');

const User = require('../../../app/models/user');

const app = new App();

const baseUrl = '/auth';
const validateFacebookTokenUrl = `${baseUrl}/validateFacebookToken`;

describe('Controllers -> Auth', () => {
  beforeEach(() => app.listen());

  afterEach(() => app.close());

  test('it should throw an error if no token is provided', () => request(app.app)
    .post(validateFacebookTokenUrl)
    .expect(500)
    .then(({ body }) => expect(body).toHaveProperty('error', 'No token provided')));

  test('it should throw an error it the token is not valid', () => request(app.app)
    .post(validateFacebookTokenUrl)
    .send({ token: 'aaaa' })
    .expect(500)
    .then(({ body }) => expect(body).toHaveProperty('error', 'Invalid token')));

  if (config.has('facebook.accessToken')) {
    test('it should take the facebook token and answer with the jwt token', () => User.create({
      email: 'niccolo@olivieriachille.com',
      name: 'Niccolò Olivieri Achille',
    })
      .then(dbUser => request(app.app)
        .post(validateFacebookTokenUrl)
        .send({ token: config.get('facebook.accessToken') })
        .expect(200)
        .then(({ body: { token, user } }) => {
          expect(token).toBeDefined();
          expect(() => jwt.verify(token)).not.toThrowError();

          expect(user).toBeDefined();
          expect(user).toHaveProperty('id', dbUser.id);
          expect(user).toHaveProperty('name', dbUser.name);
          expect(user).toHaveProperty('email', dbUser.email);

          const payload = jwt.verify(token);

          expect(payload).toBeDefined();
          expect(payload).toHaveProperty('id', dbUser.id);
          expect(payload).toHaveProperty('name', dbUser.name);
          expect(payload).toHaveProperty('email', dbUser.email);

          expect(payload).toHaveProperty('exp');

          const { exp } = payload;
          const expDate = moment(exp, 'X');
          const maxExp = moment().add(jwt.expiresIn, 'seconds');

          expect(expDate.isSameOrBefore(maxExp)).toBe(true);
        })));

    test('it should create a new user', () => User.findAll()
      .then(users => expect(users).toHaveLength(0))
      .then(() => request(app.app)
        .post(validateFacebookTokenUrl)
        .send({ token: config.get('facebook.accessToken') })
        .expect(200)
        .then(({ body: { token, user } }) => {
          expect(token).toBeDefined();
          expect(() => jwt.verify(token)).not.toThrowError();

          expect(user).toBeDefined();
          expect(user).toHaveProperty('id');
          expect(user).toHaveProperty('name');
          expect(user).toHaveProperty('email');

          const payload = jwt.verify(token);

          expect(payload).toBeDefined();
          expect(payload).toHaveProperty('id');
          expect(payload).toHaveProperty('name');
          expect(payload).toHaveProperty('email');

          expect(payload).toHaveProperty('exp');

          const { exp } = payload;
          const expDate = moment(exp, 'X');
          const maxExp = moment().add(jwt.expiresIn, 'seconds');

          expect(expDate.isSameOrBefore(maxExp)).toBe(true);

          return User.findAll();
        }))
      .then(users => expect(users).toHaveLength(1)));
  }
});
