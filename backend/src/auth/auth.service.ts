import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/schemas/user.schema';
import { LoginDto } from './dto/login.dto';
import { LoginCiDto } from './dto/login-ci.dto';
import bcrypt from 'bcryptjs';
import { Roles } from 'src/users/enum/roles.enum';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private hasRestrictedRoles(user: any): boolean {
    const userRoles = user.roles || (user.role ? [user.role] : []);
    const rolesArray = Array.isArray(userRoles) ? userRoles : [userRoles];
    return (
      rolesArray.includes(Roles.PARENT) || rolesArray.includes(Roles.ATHLETE)
    );
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (user && user.password && (await bcrypt.compare(pass, user.password))) {
      if (this.hasRestrictedRoles(user)) {
        return null;
      }
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.username, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    const userRole = user.role;
    console.log(
      `✓ Login exitoso | Usuario: ${loginDto.username} | Role identificado: ${userRole} | Nombre: ${user.name} ${user.lastname}`,
    );
    const jti = randomBytes(16).toString('hex');
    const payload = {
      username: user.username,
      sub: user._id,
      role: userRole,
      jti,
    };
    return {
      access: {
        authorization: this.jwtService.sign(payload),
        user: {
          code: user._id,
          name: user.name,
          lastname: user.lastname,
          role: userRole,
          images: (user as any)?.images || undefined,
          assignment_id: (user as any)?.assignment_id || null,
        },
      },
    };
  }

  async loginByCi(loginCiDto: LoginCiDto) {
    const roleFilter = loginCiDto.role
      ? loginCiDto.role === 'athlete'
        ? Roles.ATHLETE
        : Roles.PARENT
      : undefined;

    const user = await this.usersService.findByCiByRole(
      loginCiDto.ci,
      roleFilter,
    );

    if (!user) {
      if (!roleFilter) {
        const fallback = await this.usersService.findByCi(loginCiDto.ci);
        if (!fallback) throw new UnauthorizedException('CI no válido');
      }
      throw new UnauthorizedException('CI no válido');
    }

    const userRole =
      user.roles && user.roles.length > 0 ? user.roles[0] : user.role;

    if (loginCiDto.role) {
      const selectedRoleEnum =
        loginCiDto.role === 'athlete' ? Roles.ATHLETE : Roles.PARENT;
      if (userRole !== selectedRoleEnum) {
        console.log(
          `✗ Login CI rechazado | CI: ${loginCiDto.ci} | Role seleccionado: ${loginCiDto.role} | Role real: ${userRole} | Usuario: ${user.name} ${user.lastname}`,
        );
        throw new UnauthorizedException(
          'El role seleccionado no coincide con tu usuario',
        );
      }
    }

    const jti = randomBytes(16).toString('hex');

    const payload = {
      sub: user._id,
      ci: user.ci,
      role: userRole,
      jti,
    };

    return {
      access: {
        authorization: this.jwtService.sign(payload),
        user: {
          code: user._id,
          name: user.name,
          lastname: user.lastname,
          role: userRole,
          images: (user as any)?.images || undefined,
          assignment_id: (user as any)?.assignment_id || null,
        },
      },
    };
  }

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
