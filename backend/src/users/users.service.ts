// Servicio para la gestión de usuarios
import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { CreateUserDto, UpdateUserDto } from './dto';
import type { IUserRepository } from './repository/user.repository.interface';
import { Inject } from '@nestjs/common';
import { UserValidatorService } from './user-validator.service';
import { UserImageService } from './user-image.service';
import { UserPasswordService } from './user-password.service';

interface currentAuth {
  sub: string;
  role: string;
}

@Injectable()
export class UsersService {
  constructor(
    @Inject('UserRepository') private readonly userRepository: IUserRepository,
    private readonly userValidator: UserValidatorService,
    private readonly userImageService: UserImageService,
    private readonly userPasswordService: UserPasswordService,
  ) {}

  /**
   * Crea un nuevo usuario si el username no existe previamente
   * SRP: validación, imagen y password delegados a servicios
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    await this.userValidator.validateUniqueUsername(createUserDto.username);
    createUserDto.image = this.userImageService.processImage(
      createUserDto.image,
    );
    createUserDto.password = await this.userPasswordService.hashPassword(
      createUserDto.password,
    );
    return this.userRepository.create(createUserDto);
  }

  /**
   * Crea un usuario con rol SUPERADMIN
   */
  async createSuperUser(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.create(createUserDto);
  }

  /**
   * Busca un usuario por su username
   */
  async findOneByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOneByUsername(username);
  }

  /**
   * Busca un usuario por su ID
   */
  async findOneById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }

  /**
   * Obtiene todos los usuarios
   */
  async findAll(requestingUser: currentAuth): Promise<User[]> {
    const allUsers = (await this.userRepository.findAll()).filter(
      (user) => user.id !== requestingUser.sub,
    );

    switch (requestingUser.role) {
      case 'superadmin':
        return allUsers;
      case 'admin':
        return allUsers.filter((user) => user.role !== 'superadmin');
      case 'coach':
        return allUsers.filter((user) =>
          ['parent', 'athlete'].includes(user.role),
        );
      case 'parent':
        return allUsers.filter((user) => user.role === 'athlete');
      default:
        return [];
    }
  }

  /**
   * Busca un usuario por su ID
   */
  async findOne(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  /**
   * Busca un usuario por su username
   */
  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOneByUsername(username);
  }

  /**
   * Actualiza los datos de un usuario
   * SRP: imagen y password delegados a servicios
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    if (updateUserDto.password) {
      updateUserDto.password = await this.userPasswordService.hashPassword(
        updateUserDto.password,
      );
    }
    updateUserDto.image = this.userImageService.processImage(
      updateUserDto.image,
    );
    return this.userRepository.updateById(id, updateUserDto);
  }

  /**
   * Elimina un usuario por su ID
   */
  async remove(id: string): Promise<User | null> {
    await this.userValidator.validateExistence(id);
    return this.userRepository.deleteById(id);
  }

  /**
   * Obtiene el perfil de un usuario por su ID
   */
  async profile(id: string): Promise<User> {
    const userExist = await this.findOneById(id);
    if (!userExist) throw new NotFoundException('El usuario no fue encontrado');
    return userExist;
  }
}
