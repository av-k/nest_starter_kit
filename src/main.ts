import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { silentBootstrap } from './boot';
import { getEnvVariables } from './common/env';

(async () => {
  const { HOST, PORT } = getEnvVariables();
  const app = await NestFactory.create(AppModule);
  // Register global providers
  app.useGlobalPipes(new ValidationPipe());
  await silentBootstrap(app);
  await app.listen(PORT, HOST);
})();
