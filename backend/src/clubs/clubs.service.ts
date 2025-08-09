import { Injectable } from '@nestjs/common';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Club } from './schema/club.schema';

@Injectable()
export class ClubsService {
  constructor(@InjectModel(Club.name) private clubModel: Model<Club>) {}

  async create(createClubDto: CreateClubDto): Promise<Club> {
    const club = await this.clubModel.findOne({ name: createClubDto.name });
    if (club) {
      throw new Error('Club with this name already exists');
    }
    return this.clubModel.create(createClubDto);
  }

  async findAll(): Promise<Club[]> {
    return this.clubModel.find();
  }

  async findOne(id: string): Promise<Club | null> {
    return this.clubModel.findById(id);
  }

  async update(id: string, updateClubDto: UpdateClubDto): Promise<Club | null> {
    return this.clubModel
      .findByIdAndUpdate(id, updateClubDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Club | null> {
    return this.clubModel.findByIdAndDelete(id).exec();
  }
}
