// Implementación de la interfaz de repositorio usando Mongoose
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Club } from '../schema/club.schema';
import { IClubRepository } from './club.repository.interface';
import { CreateClubDto } from '../dto/create-club.dto';
import { UpdateClubDto } from '../dto/update-club.dto';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class ClubRepository implements IClubRepository {
  constructor(
    @InjectModel(Club.name) private clubModel: Model<Club>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async findOneByName(name: string): Promise<Club | null> {
    return this.clubModel.findOne({ name });
  }

  async create(createClubDto: CreateClubDto): Promise<Club> {
    return this.clubModel.create(createClubDto);
  }

  async findAllPopulated(): Promise<Club[]> {
    return this.clubModel.find().populate([
      { path: 'schedule', select: 'startTime endTime' },
      { path: 'discipline', select: 'name' },
      { path: 'coaches', select: 'name lastname image' },
      { path: 'athletes', select: 'name lastname image' },
    ]);
  }

  async findById(id: string): Promise<Club | null> {
    return this.clubModel.findById(id);
  }

  async updateById(
    id: string,
    updateClubDto: UpdateClubDto,
  ): Promise<Club | null> {
    return this.clubModel.findByIdAndUpdate(id, updateClubDto, { new: true });
  }

  async deleteById(id: string): Promise<Club | null> {
    return this.clubModel.findByIdAndDelete(id).exec();
  }

  async findClubsByUserId(userId: string): Promise<Club[]> {
    return this.clubModel
      .find({
        $or: [{ athletes: userId }],
      })
      .populate([
        { path: 'schedule', select: 'startTime endTime' },
        { path: 'discipline', select: 'name' },
        { path: 'coaches', select: 'name lastname' },
      ]);
  }
}
