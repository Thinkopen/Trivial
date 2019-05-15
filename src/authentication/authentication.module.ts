import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { config } from 'node-config-ts';

import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';

import { JwtStrategy } from './strategies/jwt.strategy';

import { UsersModule } from '../users/users.module';
import { SocialsModule } from '../socials/socials.module';

@Module({
  controllers: [AuthenticationController],
  exports: [PassportModule, AuthenticationService],
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secretOrPrivateKey: config.jwt.secret,
      signOptions: {
        expiresIn: config.jwt.expiresIn,
      },
    }),
    UsersModule,
    SocialsModule,
  ],
  providers: [AuthenticationService, JwtStrategy],
})
export class AuthenticationModule {}
