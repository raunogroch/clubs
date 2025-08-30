// Servicio para hash de contraseñas
import { Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';

@Injectable()
export class UserPasswordService {
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}
