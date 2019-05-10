import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { config } from 'node-config-ts';

import { AppModule } from './app/app.module';

import { LoggerService } from './shared/utils/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new LoggerService('Main'),
  });

  const options = new DocumentBuilder()
    .setTitle('ThinkOpen Trivial')
    .setDescription('An easy game to entertain at open days')
    .setVersion('1.0')
    .addTag('questions')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs/api', app, document);

  await app.listen(config.server.port);
}

bootstrap();
