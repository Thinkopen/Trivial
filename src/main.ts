import { NestFactory } from '@nestjs/core';

import { config } from 'node-config-ts';

import { AppModule } from './app/app.module';

import { LoggerService } from './shared/utils/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new LoggerService('Main'),
  });

  await app.listen(config.server.port);
}

bootstrap();
