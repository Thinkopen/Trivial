import AbstractApi from '.';

export class AuthApi extends AbstractApi {
  async validateFacebookToken(token) {
    const { user, token: jwtToken } = await this.send('auth/validateFacebookToken', 'POST', {}, { token });

    AbstractApi.JWT = jwtToken;

    return { user, jwtToken };
  }
}

export default new AuthApi();
