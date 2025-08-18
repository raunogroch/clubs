import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/schemas/user.schema';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { Roles } from 'src/users/enum/roles.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);

    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user.toObject(); // Usar toObject() para MongoDB
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.username, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = {
      username: user.username,
      sub: user._id,
      role: user.role,
    };
    return {
      access: {
        authorization: this.jwtService.sign(payload),
        user: {
          name: user.name,
          lastname: user.lastname,
          role: user.role,
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
