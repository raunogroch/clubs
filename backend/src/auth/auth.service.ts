/**
 * AuthService - Servicio de Autenticación
 *
 * Responsabilidades:
 * - Validar credenciales de usuario (username + password)
 * - Generar tokens JWT después de validar credenciales
 * - Revocar tokens (logout)
 * - Validar integridad de tokens revocados
 *
 * Flujo de autenticación:
 * 1. Usuario envía username y password
 * 2. Se validan las credenciales con bcrypt
 * 3. Si son válidas, se genera un JWT token
 * 4. El token se envía al cliente para futuras requests
 * 5. En logout, el token se añade a la lista de revocados
 */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/schemas/user.schema';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { Roles } from 'src/users/enum/roles.enum';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  /**
   * Constructor con inyección de dependencias
   * @param usersService - Servicio para acceder a usuarios
   * @param jwtService - Servicio para firmar y validar JWTs
   */
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Valida las credenciales de un usuario
   * Compara la contraseña enviada con la contraseña hasheada en la BD
   *
   * @param username - Usuario del que se valida la contraseña
   * @param pass - Contraseña en texto plano a validar
   * @returns Objeto del usuario sin la contraseña, o null si la validación falla
   */
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);

    // Comparar contraseña en texto plano con hash usando bcrypt
    if (user && (await bcrypt.compare(pass, user.password))) {
      // No devolver la contraseña en la respuesta (separar del objeto user)
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  /**
   * Realiza el login del usuario y genera un token JWT
   *
   * @param loginDto - DTO con username y password
   * @returns Objeto con el token JWT y información del usuario
   * @throws UnauthorizedException si las credenciales no son válidas
   */
  async login(loginDto: LoginDto) {
    // Validar credenciales primero
    const user = await this.validateUser(loginDto.username, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    /**
     * Generar un identificador único (jti) para el token
     * Esto permite revocar tokens específicos sin afectar otros tokens del mismo usuario
     */
    const jti = randomBytes(16).toString('hex');

    /**
     * Payload del JWT contiene:
     * - username: Usuario que se autenticó
     * - sub: ID del usuario (Standard JWT claim)
     * - role: Rol del usuario (para autorización)
     * - jti: ID único del token (para revocación)
     */
    const payload = {
      username: user.username,
      sub: user._id,
      role: user.role,
      jti,
    };
    return {
      access: {
        authorization: this.jwtService.sign(payload),
        user: {
          code: user._id,
          name: user.name,
          lastname: user.lastname,
          role: user.role,
          // Return the images object (preferred) - keep backward compatibility by including image? not included
          images: (user as any)?.images || undefined,
          // assignment_id para admins (singular)
          assignment_id: (user as any)?.assignment_id || null,
        },
      },
    };
  }

  /**
   * Registra un nuevo usuario con rol SUPERADMIN
   */
  async register(user: Partial<User>) {
    if (!user.username || !user.password) {
      throw new Error('username and password are required');
    }

    const existingUser = await this.usersService.findByUsername(user.username);
    if (existingUser) {
      throw new Error('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = await this.usersService.createSuperUser({
      username: user.username,
      password: hashedPassword,
      role: Roles.SUPERADMIN,
    });

    const { password, ...result } = newUser.toObject();
    return result;
  }
}
