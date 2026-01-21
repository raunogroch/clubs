/**
 * Módulo raíz de la aplicación (AppModule)
 * Este módulo contiene la configuración general de la aplicación
 *
 * Módulos importados:
 * - ConfigModule: Carga variables de entorno desde el archivo .env
 * - MongooseModule: Conexión a la base de datos MongoDB
 * - AuthModule: Autenticación y JWT
 * - UsersModule: Gestión de usuarios
 */

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { ClubsModule } from './clubs/clubs.module';
import { SportsModule } from './sports/sports.module';

@Module({
  imports: [
    /**
     * ConfigModule: Carga las variables de entorno desde .env
     * isGlobal: true hace que las variables estén disponibles en toda la aplicación
     */
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    /**
     * MongooseModule: Conecta la aplicación a MongoDB
     * Usa las variables de entorno MONGODB_URI desde ConfigService
     *
     * Ejemplo de MONGODB_URI:
     * mongodb+srv://usuario:contraseña@cluster.mongodb.net/nombreBaseDatos
     */
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),

    // Módulo de autenticación (JWT, login, logout)
    AuthModule,

    // Módulo de gestión de usuarios
    UsersModule,

    // Módulo de asignaciones (asignar módulos a administradores)
    AssignmentsModule,

    // Módulo de deportes (crear y gestionar deportes)
    SportsModule,

    // Módulo de clubs (crear y gestionar clubs por asignación)
    ClubsModule,
  ],
})
export class AppModule {}
