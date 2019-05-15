import { config } from 'node-config-ts';

import { AbstractSocialService } from './abstract.social.service';

export class FacebookService extends AbstractSocialService {
  private readonly version = 'v2.12';
  protected readonly baseUrl = `https://graph.facebook.com/${this.version}`;

  protected readonly config = config.facebook;

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
    } = await this.request('me', {
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
      const { data: { is_valid: isValid } } = await this.request('debug_token', {
        input_token: userToken,
      });

      return isValid;
    } catch (error) {
      return false;
    }
  }

  private async request(url: string, params: any, accessToken?: string) {
    params.access_token = accessToken || `${this.config.clientId}|${this.config.clientSecret}`;

    const { data } = await this.httpService.get(this.getUrl(url), { params }).toPromise();

    return data;
  }
}
