const axios = require('axios');
const config = require('config');

const AbstractSocial = require('.');

class Facebook extends AbstractSocial {
  constructor() {
    super();

    this.version = 'v2.12';
    this.baseUrl = `https://graph.facebook.com/${this.version}`;

    this.clientId = config.get('facebook.clientId');
    this.clientSecret = config.get('facebook.clientSecret');
  }

  async getMe(accessToken) {
    const {
      id,
      name,
      email,
      picture: {
        data: {
          url: picture,
        },
      },
    } = await this.send('me', {
      fields: 'id,name,picture,email',
    }, accessToken);

    return {
      id,
      name,
      email,
      picture,
    };
  }

  async validateToken(userToken) {
    const { data: { is_valid: isValid } } = await this.send('debug_token', {
      input_token: userToken,
    });

    return isValid;
  }

  async send(url, params, accessToken = config.get('facebook.accessToken')) {
    // eslint-disable-next-line no-param-reassign
    params.access_token = accessToken || `${this.clientId}|${this.clientSecret}`;

    const { data } = await axios.get(this.getUrl(url), { params });

    return data;
  }
}

module.exports = new Facebook();
