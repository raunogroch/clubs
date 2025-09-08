// Implementación de la interfaz de repositorio usando Mongoose
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { IUserRepository } from './user.repository.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findOneByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

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
          { email: regex },
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

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id);
  }

  async updateById(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
  }

  async deleteById(id: string): Promise<User | null> {
    return this.userModel.findByIdAndDelete(id);
  }
}
