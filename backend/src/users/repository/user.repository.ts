// UserRepository: Implementa el acceso a datos de usuarios usando Mongoose
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { Roles } from '../enum/roles.enum';
import { IUserRepository } from './user.repository.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  /**
   * Devuelve todos los usuarios sin filtros ni paginación
   */
  async findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  /**
   * Busca un usuario por su username
   */
  async findOneByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username });
  }

  /**
   * Busca un usuario por su CI
   */
  async findByCi(ci: string): Promise<User | null> {
    return this.userModel.findOne({ ci, role: Roles.ATHLETE });
  }

  /**
   * Busca un usuario por su CI y rol opcional
   */
  async findByCiByRole(ci: string, role?: string): Promise<User | null> {
    const filter: any = { ci };
    if (role) {
      filter.role = role;
    }
    return this.userModel.findOne(filter);
  }

  /**
   * Obtiene múltiples usuarios por sus IDs
   */
  async findByIds(ids: string[]): Promise<User[]> {
    if (!ids || ids.length === 0) {
      return [];
    }
    return this.userModel.find({ _id: { $in: ids } });
  }

  /**
   * Crea un nuevo usuario
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  /**
   * Devuelve usuarios paginados y filtrados por nombre, username, cédula, etc.
   */
  async findAllPaginated(
    skip = 0,
    limit = 10,
    name?: string,
  ): Promise<[User[], number]> {
    let filter: any = {};
    if (name) {
      const regex = { $regex: name, $options: 'i' };
      filter = {
        $or: [
          { name: regex },
          { lastname: regex },
          { username: regex },
          { ci: regex },
        ],
      };
    }
    const [users, total] = await Promise.all([
      this.userModel.find(filter).skip(skip).limit(limit),
      this.userModel.countDocuments(filter),
    ]);
    return [users, total];
  }

  /**
   * Busca un usuario por su ID
   */
  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id);
  }

  /**
   * Actualiza un usuario por su ID
   */
  async updateById(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
  }

  /**
   * Elimina un usuario por su ID (Hard Delete)
   */
  async deleteById(id: string): Promise<User | null> {
    return this.userModel.findByIdAndDelete(id);
  }
}
