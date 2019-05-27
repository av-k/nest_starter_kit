import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as owasp from 'owasp-password-strength-test';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';
import { SilentLogger } from '../utils/logger';
import { getEnvVariables } from '../common/env';

export async function silentBootstrap(app: any): Promise<any> {
  const { HOST, PORT } = getEnvVariables();
  const logger = new SilentLogger('Main.ts');
  const windowMs = 15 * 60 * 1000; // 15 minutes
  // @ts-ignore
  const apiRequestsLimit = new rateLimit({ windowMs, max: 1000 });
  // Configure any globally configured modules
  owasp.config({
    allowPassphrases: true,
    maxLength: 128,
    minLength: 10,
    minPhraseLength: 20,
    minOptionalTestsToPass: 3,
  });
  // Rate limit API requests
  app.use(apiRequestsLimit);
  // Enable security middleware
  app.use(helmet());
  app.enableCors();
  // Enable Swagger
  const swaggerOptions = new DocumentBuilder()
    .setTitle('Starter Kit')
    .setDescription('The Starter Kit app API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('api', app, swaggerDocument);
  // Handle uncaught/unhandled exceptions
  process.on('uncaughtException', (err) => {
    logger.error(`Uncaught exception: ${err}`, err.stack);
  });
  process.on('unhandledRejection', (err) => {
    logger.error(`Unhandled exception: ${err}`, err.stack);
  });
  logger.log(`Listening on: ${HOST}:${PORT}`);
}
