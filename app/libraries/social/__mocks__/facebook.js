const config = require('config');

// const facebookMock = jest.genMockFromModule('../facebook');
const facebookMock = jest.requireActual('../facebook');

const originalSend = facebookMock.send;
facebookMock.send = async function send(url, params, accessToken) {
  if (!config.has('facebook.accessToken')) {
    switch (url) {
      default:
        throw new Error(`Url "${url}" not implemented`);

      case 'me':
        if (accessToken === 'wrong-token') {
          throw new Error();
        }

        return {
          id: '1234567890',
          name: 'User Name',
          email: 'user@email.com',
          picture: {
            data: {
              url: 'http://user.com/picture.jpg',
            },
          },
        };

      case 'debug_token':
        if (params.input_token === 'wrong-token') {
          throw new Error();
        }

        return { data: { is_valid: params.input_token === 'right-token' } };
    }
  }

  return originalSend(url, params, accessToken);
};

module.exports = facebookMock;
