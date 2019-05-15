import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly jwtService: JwtService,
  ) {}

  async sign(user: User): Promise<string> {
    return this.jwtService.sign(user);
  }
}
