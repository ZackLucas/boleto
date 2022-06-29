import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { config } from 'dotenv';
import { json, urlencoded } from 'express';
import helmet from 'helmet';

import { AppModule } from '@/core/protocols';

import { HttpExceptionFilter } from '@/core/protocols';

config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(helmet());
  app.use(json({ limit: '2mb' }));
  app.use(urlencoded({ extended: true, limit: '2mb' }));
  app.useGlobalFilters(new HttpExceptionFilter())

  await app.listen(process.env.APP_SERVER_PORT);
}
bootstrap();
