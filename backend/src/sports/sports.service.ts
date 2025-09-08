// Servicio para la gestión de deportes
import { Injectable } from '@nestjs/common';
import { CreateSportDto } from './dto/create-sport.dto';
import { UpdateSportDto } from './dto/update-sport.dto';
import { Sport } from './schemas/sport.schemas';
import type { ISportRepository } from './repository/sport.repository.interface';
import { Inject } from '@nestjs/common';
import { SportValidatorService } from './sport-validator.service';

@Injectable()
export class SportsService {
  constructor(
    @Inject('SportRepository')
    private readonly sportRepository: ISportRepository,
    private readonly sportValidator: SportValidatorService,
  ) {}

  /**
   * Crea un nuevo deporte si el nombre no existe previamente
   * SRP: la validación se delega al validador
   */
  async create(createSportDto: CreateSportDto): Promise<Sport> {
    await this.sportValidator.validateUniqueName(createSportDto.name);
    return this.sportRepository.create(createSportDto);
  }

  /**
   * Obtiene todos los deportes
   */
  async findAll(page = 1, limit = 10, name?: string) {
    const skip = (page - 1) * limit;
    const [data, total] = await this.sportRepository.findAllPaginated(
      skip,
      limit,
      name,
    );
    return { data, total, page, limit };
  }

  /**
   * Busca un deporte por su ID
   */
  async findOne(id: string): Promise<Sport | null> {
    return this.sportRepository.findById(id);
  }

  /**
   * Actualiza los datos de un deporte
   * SRP: la validación se delega al validador
   */
  async update(
    id: string,
    updateSportDto: UpdateSportDto,
  ): Promise<Sport | null> {
    await this.sportValidator.validateExistence(id);
    return this.sportRepository.updateById(id, updateSportDto);
  }

  /**
   * Elimina un deporte por su ID
   */
  async remove(id: string): Promise<Sport | null> {
    await this.sportValidator.validateExistence(id);
    return this.sportRepository.deleteById(id);
  }
}
