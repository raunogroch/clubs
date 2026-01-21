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

  /**
   * Busca un deporte por nombre, ignorando mayúsculas, minúsculas y caracteres especiales
   */
  async findOneByName(name: string): Promise<Sport | null> {
    // Normaliza el nombre quitando espacios y caracteres especiales para comparar
    const normalize = (str: string) =>
      str
        .normalize('NFD')
        .replace(/[^\w\s]|_/g, '')
        .replace(/\s+/g, '')
        .toLowerCase();
    const allSports = await this.sportModel.find();
    return (
      allSports.find((sport) => normalize(sport.name) === normalize(name)) ||
      null
    );
  }

  async create(createSportDto: CreateSportDto): Promise<Sport> {
    return this.sportModel.create(createSportDto);
  }

  async findAll(): Promise<Sport[]> {
    return await this.sportModel.find();
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
    return this.sportModel.findByIdAndDelete(id, { new: true });
  }

  /**
   * Verifica si un deporte está vinculado a algún club
   */
  async isLinkedToAnyClub(sportId: string): Promise<boolean> {
    const linkedClub = await this.sportModel.db
      .collection('clubs')
      .findOne({ sport_id: sportId });
    return !!linkedClub;
  }
}
