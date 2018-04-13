const facebook = require('../../../app/libraries/facebook');

describe('Libraries -> Facebook', () => {
  test('it should have some default properties', () => {
    expect(facebook).toHaveProperty('version');
    expect(facebook.version).toBeDefined();

    expect(facebook).toHaveProperty('baseUrl');
    expect(facebook.baseUrl).toBeDefined();

    expect(facebook).toHaveProperty('clientId');
    expect(facebook.clientId).toBeDefined();

    expect(facebook).toHaveProperty('clientSecret');
    expect(facebook.clientSecret).toBeDefined();
  });

  test('it should (in)validate a token', () => expect(facebook.validateToken('foo')).resolves.toBe(false));
});
