// Servicio para validaciones de User
import { Injectable } from '@nestjs/common';
import type { IUserRepository } from './repository/user.repository.interface';

@Injectable()
export class UserValidatorService {
  constructor(private readonly userRepository: IUserRepository) {}

  async validateUniqueUsername(username: string): Promise<void> {
    const user = await this.userRepository.findOneByUsername(username);
    if (user) {
      throw new Error('Username already exists');
    }
  }

  async validateExistence(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error(`User with id ${id} doesn't exist`);
    }
  }
}
