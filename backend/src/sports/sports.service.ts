import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
  async findAll() {
    return await this.sportRepository.findAll();
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
    // 1. Verificar que el deporte existe
    const sport = await this.sportRepository.findById(id);
    if (!sport) {
      throw new NotFoundException('Deporte no encontrado');
    }

    // 2. Si quiere cambiar el nombre, verificar que no exista otro con ese nombre
    if (updateSportDto.name && updateSportDto.name !== sport.name) {
      const existingSport = await this.sportRepository.findOneByName(
        updateSportDto.name,
      );
      if (existingSport && existingSport.id !== id) {
        throw new ConflictException('Ya existe un deporte con ese nombre');
      }
    }

    // 3. Actualizar el deporte
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
