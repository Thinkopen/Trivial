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

  async getAccessToken() {
    if (!this.accessToken) {
      const { access_token: accessToken } = await this.send('oauth/access_token', {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials',
      });

      this.accessToken = accessToken;
    }

    return this.accessToken;
  }

  async validateToken(userToken) {
    const { data } = await this.send('debug_token', {
      input_token: userToken,
      access_token: this.getAccessToken(),
    });

    return data;
  }

  async send(url, params) {
    const { data } = await axios.get(this.getUrl(url), { params });

    return data;
  }
}

module.exports = new Facebook();
