import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompetencyDto } from './dto/create-competency.dto';
import { UpdateCompetencyDto } from './dto/update-competency.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Competency } from './schemas/competency.schema';
import { Model } from 'mongoose';

@Injectable()
export class CompetenciesService {
  constructor(
    @InjectModel(Competency.name) private competencyModel: Model<Competency>,
  ) {}

  async create(createCompetencyDto: CreateCompetencyDto) {
    const existingCompetency = await this.competencyModel.findOne({
      name: createCompetencyDto.name,
    });
    if (existingCompetency) {
      throw new Error('Competency with this name already exists');
    }
    return await this.competencyModel.create(createCompetencyDto);
  }

  async findAll() {
    return this.competencyModel
      .find()
      .populate('discipline', 'name')
      .populate('attendees.coaches', 'name email')
      .populate('attendees.competitors.athlete', 'name');
  }

  async findOne(id: string) {
    const competency = await this.competencyModel.findById(id);
    if (!competency) {
      throw new Error(`Competency with id ${id} isn't exist`);
    }

    return competency.populate('discipline', 'name');
  }

  async update(id: string, updateCompetencyDto: UpdateCompetencyDto) {
    const competencyExist = await this.competencyModel.findById(id);
    if (!competencyExist) {
      throw new Error(`Competency with id ${id} isn't exist`);
    }
    return this.competencyModel
      .findByIdAndUpdate(id, updateCompetencyDto, { new: true })
      .populate('discipline', 'name');
  }

  async remove(id: string) {
    const deleted = await this.competencyModel.findByIdAndDelete(id);
    if (!deleted) {
      throw new NotFoundException(`Competency not found`);
    }
    return deleted;
  }
}
