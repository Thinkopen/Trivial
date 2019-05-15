import { BadRequestException, Body, Controller, Post, UnauthorizedException } from '@nestjs/common';

import { AuthenticationService } from './authentication.service';

import { FacebookService } from '../socials/facebook.service';
import { AbstractSocialService } from '../socials/abstract.social.service';
import { UsersService } from '../users/users.service';

@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly facebookService: FacebookService,
    private readonly usersService: UsersService,
  ) {}

  @Post('validateFacebookToken')
  async validateFacebookToken(@Body('token') token: string) {
    return this.validateToken(this.facebookService, token);
  }

  private async validateToken<T extends AbstractSocialService>(socialService: T, token: string) {
    if (!token) {
      throw new BadRequestException('No token provided');
    }

    const isValid = await socialService.validateToken(token);

    if (!isValid) {
      throw new UnauthorizedException('Invalid token');
    }

    const userRaw = await socialService.getMe(token);

    const user = await this.usersService.upsertByEmail(userRaw.email, userRaw);

    const jwtToken = await this.authenticationService.sign(user);

    return { user, token: jwtToken };
  }
}
