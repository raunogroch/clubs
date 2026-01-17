/**
 * Punto de entrada principal de la aplicación
 * Este archivo configura y arranca el servidor NestJS
 *
 * Responsabilidades:
 * - Crear la instancia de la aplicación
 * - Configurar middleware (CORS, body parser, etc)
 * - Servir archivos estáticos
 * - Iniciar el servidor en el puerto especificado
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Función bootstrap que configura e inicia la aplicación NestJS
 * Esta es la función que ejecuta Node.js cuando se inicia el servidor
 */
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const logger = new Logger('BackendApp');
  const configService = app.get(ConfigService);

  /**
   * Habilitar CORS para permitir solicitudes desde cualquier origen
   * DEBE ser lo primero antes de otros middlewares
   * origin: '*' acepta requests desde cualquier dominio
   * credentials: true permite enviar cookies y headers de autenticación
   */
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    optionsSuccessStatus: 200,
  });

  /**
   * Configurar middleware para parsear JSON y URL-encoded data
   * El límite de 10mb permite enviar imágenes en base64 en el body
   */
  const bodyParser = require('body-parser');
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  /**
   * Servir archivos estáticos (imágenes) desde la carpeta 'images'
   * Las imágenes estarán disponibles en: http://localhost:3000/images/...
   */
  const { join } = require('path');
  app.useStaticAssets(join(__dirname, '..', 'images'), {
    prefix: '/images/',
  });

  /**
   * Prefijar todas las rutas con '/api' para mantener una estructura clara
   * Ejemplo: POST /api/auth/login en lugar de POST /auth/login
   */
  app.setGlobalPrefix('api');

  /**
   * Iniciar el servidor en el puerto especificado en .env o puerto 3000 por defecto
   */
  const PORT = configService.get<number>('PORT') || 3000;
  const IMAGE_PROCESSOR_API = configService.get<string>('IMAGE_PROCESSOR_API');

  await app.listen(PORT);

  logger.log(`✅ Aplicación iniciada en: ${await app.getUrl()}`);
  logger.log(`🔗 Image Processor API: ${IMAGE_PROCESSOR_API}`);
}

// Ejecutar la función bootstrap al iniciar el servidor
bootstrap();
