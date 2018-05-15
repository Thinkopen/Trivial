const axios = require('axios');
const config = require('config');
const { OAuth2Client } = require('google-auth-library');

const AbstractSocial = require('.');

class Google extends AbstractSocial {
  constructor() {
    super();

    this.version = 'v2.12';
    this.baseUrl = `https://graph.facebook.com/${this.version}`;

    this.clientId = config.get('google.clientId');
    this.clientSecret = config.get('google.clientSecret');
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
    try {
      const { data: { is_valid: isValid } } = await this.send({
        input_token: userToken,
      });

      return isValid;
    } catch (error) {
      return false;
    }
  }

  /* istanbul ignore next */
  async send({ input_token: idToken }, accessToken) {
    const client = new OAuth2Client(this.clientId);

    const ticket = await client.verifyIdToken({
      idToken,
      audience: this.clientId,
    });
    const payload = ticket.getPayload();
    console.log('PAYLOAD', payload);

    return data;
  }
}

module.exports = new Google();
