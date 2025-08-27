// Servicio para la gestión de usuarios
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { saveProfileImage } from '../utils/imageProcessor';
import { CreateUserDto, UpdateUserDto } from './dto';
import bcrypt from 'node_modules/bcryptjs';

interface currentAuth {
  sub: string;
  role: string;
}

@Injectable()
export class UsersService {
  // Constructor con inyección del modelo User
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  /**
   * Crea un nuevo usuario si el username no existe previamente
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.findByUsername(createUserDto.username);
    if (existingUser) {
      throw new Error('Username already exists');
    }

    // Procesa la imagen base64 si existe y guarda el link
    if (createUserDto.image && createUserDto.image.startsWith('data:image')) {
      createUserDto.image = saveProfileImage(createUserDto.image);
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    createUserDto.password = hashedPassword;

    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  /**
   * Crea un usuario con rol SUPERADMIN
   */
  async createSuperUser(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  /**
   * Busca un usuario por su username
   */
  async findOneByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }

  /**
   * Busca un usuario por su ID
   */
  async findOneById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }

  /**
   * Obtiene todos los usuarios
   */
  async findAll(requestingUser: currentAuth): Promise<User[]> {
    const allUsers = (await this.userModel.find()).filter(
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
    return await this.userModel.findById(id);
  }

  /**
   * Busca un usuario por su username
   */
  async findByUsername(username: string): Promise<User | null> {
    return await this.userModel.findOne({ username });
  }

  /**
   * Actualiza los datos de un usuario
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    if (updateUserDto.password) {
      const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
      updateUserDto.password = hashedPassword;
    }

    // Procesa la imagen base64 si existe y guarda el link
    if (updateUserDto.image && updateUserDto.image.startsWith('data:image')) {
      updateUserDto.image = saveProfileImage(updateUserDto.image);
    }

    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  /**
   * Elimina un usuario por su ID
   */
  async remove(id: string): Promise<null> {
    const exist = await this.findOne(id);
    if (!exist) throw new Error("User isn't exist");
    return exist.deleteOne();
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
