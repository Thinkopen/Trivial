const config = require('config');

const facebook = require('../../../../app/libraries/social/facebook');

describe('Libraries -> Social -> Facebook', () => {
  test('it should have some default properties', () => {
    expect(facebook).toHaveProperty('version');
    expect(facebook.version).toBeDefined();

    expect(facebook).toHaveProperty('clientId');
    expect(facebook.clientId).toBeDefined();

    expect(facebook).toHaveProperty('clientSecret');
    expect(facebook.clientSecret).toBeDefined();
  });

  test('it should invalidate a wrong token', () => expect(facebook.validateToken('foo')).resolves.toBe(false));

  test('it should throw an error with a wrong token', () => expect(facebook.getMe('foo')).rejects.toBeDefined());

  if (config.get('facebook.accessToken')) {
    test('it should validate a correct token', () => facebook.validateToken(config.get('facebook.accessToken'))
      .catch(error => expect(error).not.toBeDefined())
      .then((validateTokenResponse) => {
        expect(validateTokenResponse).toBe(true);
      }));

    test('it should get the user properties', () => facebook.getMe(config.get('facebook.accessToken'))
      .catch(error => expect(error).not.toBeDefined())
      .then((getMeResponse) => {
        expect(getMeResponse).toHaveProperty('id');
        expect(getMeResponse).toHaveProperty('name');
        expect(getMeResponse).toHaveProperty('email');
        expect(getMeResponse).toHaveProperty('picture');
      }));
  }
});
