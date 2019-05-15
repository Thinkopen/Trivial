import { HttpService } from '@nestjs/common';

export abstract class AbstractSocialService {
  protected abstract readonly baseUrl;
  protected abstract readonly config;

  constructor(protected readonly httpService: HttpService) {}

  abstract async validateToken(userToken);

  abstract async getMe(accessToken);

  protected getUrl(url) {
    return `${this.baseUrl}/${url}`;
  }
}
