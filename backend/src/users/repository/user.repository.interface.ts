// Interfaz para acceso a datos de User
import { User } from '../schemas/user.schema';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

export interface IUserRepository {
  findOneByUsername(username: string): Promise<User | null>;
  create(createUserDto: CreateUserDto): Promise<User>;
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  updateById(id: string, updateUserDto: UpdateUserDto): Promise<User | null>;
  deleteById(id: string): Promise<User | null>;
}
