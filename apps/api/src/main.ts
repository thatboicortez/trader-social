import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const port = Number(config.get('PORT') ?? 3001);
  const origin = config.get('CORS_ORIGIN') ?? 'http://localhost:3000';

  app.enableCors({
    origin,
    credentials: true,
  });

  await app.listen(port);
  console.log(`API listening on http://localhost:${port}`);
}
bootstrap();
