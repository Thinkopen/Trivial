import { NestFactory } from '@nestjs/core';

import { config } from 'node-config-ts';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(config.server.port);
}

bootstrap();
