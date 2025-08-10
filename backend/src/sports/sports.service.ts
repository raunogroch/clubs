import { Injectable } from '@nestjs/common';
import { CreateSportDto } from './dto/create-sport.dto';
import { UpdateSportDto } from './dto/update-sport.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Sport } from './schemas/sport.schemas';
import { Model } from 'mongoose';

@Injectable()
export class SportsService {
  constructor(@InjectModel(Sport.name) private sportModel: Model<Sport>) {}

  async create(createSportDto: CreateSportDto): Promise<Sport> {
    const sport = await this.sportModel.findOne({ name: createSportDto.name });
    if (sport) {
      throw new Error('Sport with this name already exists');
    }
    return this.sportModel.create(createSportDto);
  }

  async findAll() {
    return await this.sportModel.find();
  }

  async findOne(id: string) {
    return await this.sportModel.findById(id);
  }

  async update(id: string, updateSportDto: UpdateSportDto) {
    const sportExist = await this.sportModel.findById(id);
    if (!sportExist) {
      throw new Error(`Sport with id ${id} doesn't exist`);
    }
    return this.sportModel.findByIdAndUpdate(id, updateSportDto, { new: true });
  }

  async remove(id: string) {
    const sportExist = await this.sportModel.findById(id);
    if (!sportExist) {
      throw new Error(`Sport with id ${id} doesn't exist`);
    }
    return this.sportModel.findByIdAndDelete(id);
  }
}
