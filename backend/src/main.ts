// Archivo principal de arranque de la aplicación
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * Función de arranque de la aplicación NestJS
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS con opciones personalizadas (opcional)
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
