// Interfaz para acceso a datos de User
import { User } from '../schemas/user.schema';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

export interface IUserRepository {
  findOneByUsername(username: string): Promise<User | null>;
  findByCi(ci: string): Promise<User | null>;
  findByCiByRole(ci: string, role?: string): Promise<User | null>;
  findByIds(ids: string[]): Promise<User[]>;
  create(createUserDto: CreateUserDto): Promise<User>;
  findAllPaginated(
    skip: number,
    limit: number,
    name?: string,
  ): Promise<[User[], number]>;
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  updateById(id: string, updateUserDto: UpdateUserDto): Promise<User | null>;
  deleteById(id: string): Promise<User | null>;
  findAthletesByParentId(parentId: string): Promise<User[]>;
}
