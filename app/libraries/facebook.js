const axios = require('axios');
const config = require('config');

class Facebook {
  constructor() {
    this.version = 'v2.11';
    this.baseUrl = `https://graph.facebook.com/${this.version}`;

    this.clientId = config.get('facebook.clientId');
    this.clientSecret = config.get('facebook.clientSecret');
  }

  getUrl(url) {
    return `${this.baseUrl}/${url}`;
  }

  async getMe(accessToken) {
    return this.send('me', {}, accessToken);
  }

  async validateToken(userToken) {
    const { data: { is_valid: isValid } } = await this.send('debug_token', {
      input_token: userToken,
    });

    return isValid;
  }

  async send(url, params, accessToken) {
    // eslint-disable-next-line no-param-reassign
    params.access_token = accessToken ? accessToken : `${this.clientId}|${this.clientSecret}`;

    const { data } = await axios.get(this.getUrl(url), { params });

    return data;
  }
}

module.exports = new Facebook();
