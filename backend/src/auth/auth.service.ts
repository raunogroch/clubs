// Servicio para la autenticación de usuarios
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
  // Constructor con inyección de servicios y JWT
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Valida las credenciales de un usuario
   */
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);

    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user.toObject(); // Usar toObject() para MongoDB
      return result;
    }
    return null;
  }

  /**
   * Realiza el login y retorna el token JWT
   */
  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.username, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Generar un jti único para permitir revocación de tokens
    const jti = randomBytes(16).toString('hex');
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
          image: user.image,
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
