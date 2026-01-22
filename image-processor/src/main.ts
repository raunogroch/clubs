import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import * as bodyParser from "body-parser";
import { AppModule } from "./app.module";
import { join } from "path";
import * as express from "express";
import { NestExpressApplication } from "@nestjs/platform-express";
import { Logger } from "@nestjs/common";
import { getEnvConfig } from "./config/envs";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const logger = new Logger("ImageProcessorApp");

  /**
   * Obtener configuración desde variables de entorno
   */
  const envConfig = getEnvConfig();

  /**
   * Habilitar CORS para permitir solicitudes desde cualquier origen
   */
  app.enableCors();

  /**
   * Servir archivos estáticos de imágenes ANTES del prefijo global
   * Las imágenes estarán disponibles en: http://localhost:PORT/images/...
   * (sin el prefijo /api para evitar 404)
   */
  app.use("/storage", express.static(join(__dirname, "../storage")));
  app.use("/images", express.static(join(__dirname, "../images")));

  /**
   * Aplicar prefijo global solo a los endpoints de la API
   * Los endpoints estarán disponibles en: http://localhost:PORT/api/process/...
   */
  app.setGlobalPrefix("api");

  /**
   * Configurar middleware para parsear JSON
   * El límite de 20mb permite procesar imágenes grandes en base64
   */
  app.use(bodyParser.json({ limit: `${envConfig.image.maxFileSize}mb` }));
  app.use(
    bodyParser.urlencoded({
      extended: true,
      limit: `${envConfig.image.maxFileSize}mb`,
    }),
  );

  /**
   * Iniciar el servidor en el puerto especificado
   */
  await app.listen(envConfig.server.port);

  logger.log(`✅ Aplicación iniciada en puerto: ${envConfig.server.port}`);
  logger.log(`🌍 Entorno: ${envConfig.server.nodeEnv}`);
  logger.log(`📁 Carpeta de imágenes: ${envConfig.image.folder}`);
  logger.log(`📦 Tamaño máximo de archivo: ${envConfig.image.maxFileSize}mb`);
}

bootstrap();
