// Estrategia JWT para autenticación
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { RevokedTokensService } from '../revoked-tokens.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private revokedTokensService: RevokedTokensService,
  ) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in configuration');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  /**
   * Valida el payload del JWT
   */
  async validate(payload: any) {
    // si el token tiene un jti o identificador único, úsalo; si no, usa el propio token id
    const jti = payload.jti || payload.sub || null;
    if (jti) {
      const revoked = await this.revokedTokensService.isRevoked(String(jti));
      if (revoked) throw new UnauthorizedException('Token revoked');
    }
    return {
      sub: payload.sub,
      username: payload.username,
      role: payload.role,
    };
  }
}
