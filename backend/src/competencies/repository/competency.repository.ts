// Implementación de la interfaz de repositorio usando Mongoose
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Competency } from '../schemas/competency.schema';
import { ICompetencyRepository } from './competency.repository.interface';
import { CreateCompetencyDto } from '../dto/create-competency.dto';
import { UpdateCompetencyDto } from '../dto/update-competency.dto';

@Injectable()
export class CompetencyRepository implements ICompetencyRepository {
  constructor(
    @InjectModel(Competency.name) private competencyModel: Model<Competency>,
  ) {}

  async findOneByName(name: string): Promise<Competency | null> {
    return this.competencyModel.findOne({ name });
  }

  async create(createCompetencyDto: CreateCompetencyDto): Promise<Competency> {
    return this.competencyModel.create(createCompetencyDto);
  }

  async findAllPopulated(): Promise<Competency[]> {
    return this.competencyModel
      .find()
      .populate('discipline', 'name')
      .populate('attendees.coaches', 'name email')
      .populate('attendees.competitors.athlete', 'name');
  }

  async findById(id: string): Promise<Competency | null> {
    return this.competencyModel.findById(id);
  }

  async updateById(
    id: string,
    updateCompetencyDto: UpdateCompetencyDto,
  ): Promise<Competency | null> {
    return this.competencyModel
      .findByIdAndUpdate(id, updateCompetencyDto, { new: true })
      .populate('discipline', 'name');
  }

  async deleteById(id: string): Promise<Competency | null> {
    return this.competencyModel.findByIdAndUpdate(id, { active: false }, { new: true });
  }
}
