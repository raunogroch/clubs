/**
 * Módulo de Autenticación (AuthModule)
 *
 * Responsabilidades:
 * - Autenticar usuarios (login)
 * - Generar y validar tokens JWT
 * - Gestionar tokens revocados (logout)
 * - Proporcionar estrategia de seguridad JWT
 *
 * Componentes:
 * - AuthService: Lógica de autenticación
 * - AuthController: Endpoints de auth (/login, /logout)
 * - JwtStrategy: Estrategia para validar tokens JWT
 * - RevokedTokensService: Gestión de tokens invalidados
 */

import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { RevokedTokensService } from './revoked-tokens.service';
import {
  RevokedToken,
  RevokedTokenSchema,
} from './schemas/revoked-token.schema';

@Module({
  imports: [
    // UsersModule se importa con forwardRef para evitar dependencias circulares
    forwardRef(() => UsersModule),

    /**
     * JwtModule: Configura la librería JWT de NestJS
     * - secret: Clave privada para firmar tokens (desde ConfigService)
     * - signOptions: Opciones para firmar tokens (expiración de 60 minutos)
     */
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' }, // Los tokens expiran en 60 minutos
      }),
      inject: [ConfigService],
    }),

    // UsersModule para acceder a los usuarios
    UsersModule,

    // RevokedToken: Colección para almacenar tokens revocados (logout)
    MongooseModule.forFeature([
      { name: RevokedToken.name, schema: RevokedTokenSchema },
    ]),
  ],

  // Servicios que proporciona este módulo
  providers: [AuthService, JwtStrategy, RevokedTokensService],

  // Servicios exportados para que otros módulos puedan usarlos
  exports: [AuthService, RevokedTokensService],

  // Controladores (endpoints HTTP) de este módulo
  controllers: [AuthController],
})
export class AuthModule {}
