// Implementación de la interfaz de repositorio usando Mongoose
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Sport } from '../schemas/sport.schemas';
import { ISportRepository } from './sport.repository.interface';
import { CreateSportDto } from '../dto/create-sport.dto';
import { UpdateSportDto } from '../dto/update-sport.dto';

@Injectable()
export class SportRepository implements ISportRepository {
  constructor(@InjectModel(Sport.name) private sportModel: Model<Sport>) {}

  async findOneByName(name: string): Promise<Sport | null> {
    return this.sportModel.findOne({ name });
  }

  async create(createSportDto: CreateSportDto): Promise<Sport> {
    return this.sportModel.create(createSportDto);
  }

  async findAll(): Promise<Sport[]> {
    return this.sportModel.find();
  }

  async findById(id: string): Promise<Sport | null> {
    return this.sportModel.findById(id);
  }

  async updateById(
    id: string,
    updateSportDto: UpdateSportDto,
  ): Promise<Sport | null> {
    return this.sportModel.findByIdAndUpdate(id, updateSportDto, { new: true });
  }

  async deleteById(id: string): Promise<Sport | null> {
    return this.sportModel.findByIdAndDelete(id);
  }
}
