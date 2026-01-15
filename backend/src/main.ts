// Archivo principal de arranque de la aplicación
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from '@nestjs/common';

/**
 * Función de arranque de la aplicación NestJS
 */
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const logger = new Logger('BackendApp');

  // Aumenta el límite de tamaño del body a 10mb para imágenes base64
  const bodyParser = require('body-parser');
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Servir archivos estáticos de la carpeta images
  const { join } = require('path');
  app.useStaticAssets(join(__dirname, '..', 'images'), {
    prefix: '/images/',
  });

  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 3000);
  logger.log(`Application is running on: ${await app.getUrl()}`);
  logger.log(`Image Processor: ${process.env.IMAGE_PROCESSOR_API}`);
}
bootstrap();
