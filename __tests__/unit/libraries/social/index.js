const AbstractSocial = require('../../../../app/libraries/social');

describe('Liraries -> Social -> Abstract', () => {
  let abstractSocial;

  beforeEach(() => {
    abstractSocial = new AbstractSocial();
  });

  test('it should have an "abstract" method: validateToken', () => expect(abstractSocial.validateToken())
    .rejects.toHaveProperty('message', 'There must be the "validateToken" method in the AbstractSocial class'));

  test('it should have an "abstract" method: getMe', () => expect(abstractSocial.getMe())
    .rejects.toHaveProperty('message', 'There must be the "getMe" method in the AbstractSocial class'));

  test('it should have the "getUrl" method', () => {
    expect(abstractSocial).toHaveProperty('getUrl');
    expect(abstractSocial.getUrl).toBeInstanceOf(Function);
  });

  test('it should have the "baseUrl" attribute', () => {
    expect(abstractSocial).toHaveProperty('baseUrl');
    expect(abstractSocial.baseUrl).toBe('');
  });

  test('it should create a url with no base url by default', () => {
    const path = 'bar';

    expect(abstractSocial.getUrl(path)).toBe(`/${path}`);
  });

  test('it should create a url with the baseUrl specified', () => {
    abstractSocial.baseUrl = 'http://foo.com';

    const path = 'bar';

    expect(abstractSocial.getUrl(path)).toBe(`${abstractSocial.baseUrl}/${path}`);
  });
});
