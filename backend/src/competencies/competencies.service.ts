// Servicio para la gestión de competencias deportivas
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompetencyDto } from './dto/create-competency.dto';
import { UpdateCompetencyDto } from './dto/update-competency.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Competency } from './schemas/competency.schema';
import { Model } from 'mongoose';

@Injectable()
export class CompetenciesService {
  // Constructor con inyección del modelo Competency
  constructor(
    @InjectModel(Competency.name) private competencyModel: Model<Competency>,
  ) {}

  /**
   * Crea una nueva competencia si el nombre no existe previamente
   */
  async create(createCompetencyDto: CreateCompetencyDto) {
    const existingCompetency = await this.competencyModel.findOne({
      name: createCompetencyDto.name,
    });
    if (existingCompetency) {
      throw new Error('Competency with this name already exists');
    }
    return await this.competencyModel.create(createCompetencyDto);
  }

  /**
   * Obtiene todas las competencias con relaciones pobladas
   */
  async findAll() {
    return this.competencyModel
      .find()
      .populate('discipline', 'name')
      .populate('attendees.coaches', 'name email')
      .populate('attendees.competitors.athlete', 'name');
  }

  /**
   * Busca una competencia por su ID
   */
  async findOne(id: string) {
    const competency = await this.competencyModel.findById(id);
    if (!competency) {
      throw new Error(`Competency with id ${id} isn't exist`);
    }

    return competency.populate('discipline', 'name');
  }

  /**
   * Actualiza los datos de una competencia
   */
  async update(id: string, updateCompetencyDto: UpdateCompetencyDto) {
    const competencyExist = await this.competencyModel.findById(id);
    if (!competencyExist) {
      throw new Error(`Competency with id ${id} isn't exist`);
    }
    return this.competencyModel
      .findByIdAndUpdate(id, updateCompetencyDto, { new: true })
      .populate('discipline', 'name');
  }

  /**
   * Elimina una competencia por su ID
   */
  async remove(id: string) {
    const deleted = await this.competencyModel.findByIdAndDelete(id);
    if (!deleted) {
      throw new NotFoundException(`Competency not found`);
    }
    return deleted;
  }
}
