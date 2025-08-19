// Servicio para la gestión de deportes
import { Injectable } from '@nestjs/common';
import { CreateSportDto } from './dto/create-sport.dto';
import { UpdateSportDto } from './dto/update-sport.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Sport } from './schemas/sport.schemas';
import { Model } from 'mongoose';

@Injectable()
export class SportsService {
  // Constructor con inyección del modelo Sport
  constructor(@InjectModel(Sport.name) private sportModel: Model<Sport>) {}

  /**
   * Crea un nuevo deporte si el nombre no existe previamente
   */
  async create(createSportDto: CreateSportDto): Promise<Sport> {
    const sport = await this.sportModel.findOne({ name: createSportDto.name });
    if (sport) {
      throw new Error('Sport with this name already exists');
    }
    return this.sportModel.create(createSportDto);
  }

  /**
   * Obtiene todos los deportes
   */
  async findAll() {
    return await this.sportModel.find();
  }

  /**
   * Busca un deporte por su ID
   */
  async findOne(id: string) {
    return await this.sportModel.findById(id);
  }

  /**
   * Actualiza los datos de un deporte
   */
  async update(id: string, updateSportDto: UpdateSportDto) {
    const sportExist = await this.sportModel.findById(id);
    if (!sportExist) {
      throw new Error(`Sport with id ${id} doesn't exist`);
    }
    return this.sportModel.findByIdAndUpdate(id, updateSportDto, { new: true });
  }

  /**
   * Elimina un deporte por su ID
   */
  async remove(id: string) {
    const sportExist = await this.sportModel.findById(id);
    if (!sportExist) {
      throw new Error(`Sport with id ${id} doesn't exist`);
    }
    return this.sportModel.findByIdAndDelete(id);
  }
}
