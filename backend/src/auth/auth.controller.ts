import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginCiDto } from './dto/login-ci.dto';
import { RegisterDto } from './dto/register.dto';
import { RevokedTokensService } from './revoked-tokens.service';
import type { Request } from 'express';
import * as jwt from 'jsonwebtoken';

// Controlador para la autenticación de usuarios
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private revokedTokensService: RevokedTokensService,
  ) {}

  /**
   * Endpoint para login de usuario
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  /**
   * Endpoint para login por CI (atletas y padres)
   */
  @Post('login-ci')
  @HttpCode(HttpStatus.OK)
  loginByCi(@Body() loginCiDto: LoginCiDto) {
    return this.authService.loginByCi(loginCiDto);
  }

  /**
   * Endpoint para registrar usuario SUPERADMIN
   */
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  /**
   * Logout: extrae el token Bearer (si existe) y lo marca como revocado.
   * Responde 204 No Content; el frontend debe limpiar estado local.
   */
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() req: Request) {
    try {
      const auth = req.headers['authorization'] || req.headers['Authorization'];
      const token =
        typeof auth === 'string' && auth.startsWith('Bearer ')
          ? auth.split(' ')[1]
          : null;
      if (token) {
        const decoded: any = jwt.decode(token);
        const jti = decoded?.jti || decoded?.sub || token;
        const exp = decoded?.exp || null;
        if (jti && exp)
          await this.revokedTokensService.revoke(String(jti), Number(exp));
      }
    } catch (e) {
      // noop: logout should not fail the request
    }
    return;
  }
}
