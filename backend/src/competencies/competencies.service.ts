// Servicio para la gestión de competencias deportivas
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompetencyDto } from './dto/create-competency.dto';
import { UpdateCompetencyDto } from './dto/update-competency.dto';
import { Competency } from './schemas/competency.schema';
import type { ICompetencyRepository } from './repository/competency.repository.interface';
import { Inject } from '@nestjs/common';
import { CompetencyValidatorService } from './competency-validator.service';

@Injectable()
export class CompetenciesService {
  constructor(
    @Inject('CompetencyRepository')
    private readonly competencyRepository: ICompetencyRepository,
    private readonly competencyValidator: CompetencyValidatorService,
  ) {}

  /**
   * Crea una nueva competencia si el nombre no existe previamente
   * SRP: la validación se delega al validador
   */
  async create(createCompetencyDto: CreateCompetencyDto): Promise<Competency> {
    await this.competencyValidator.validateUniqueName(createCompetencyDto.name);
    return this.competencyRepository.create(createCompetencyDto);
  }

  /**
   * Obtiene todas las competencias con relaciones pobladas
   */
  async findAll(): Promise<Competency[]> {
    return this.competencyRepository.findAllPopulated();
  }

  /**
   * Busca una competencia por su ID
   */
  async findOne(id: string): Promise<Competency | null> {
    await this.competencyValidator.validateExistence(id);
    return this.competencyRepository.findById(id);
  }

  /**
   * Actualiza los datos de una competencia
   * SRP: la validación se delega al validador
   */
  async update(
    id: string,
    updateCompetencyDto: UpdateCompetencyDto,
  ): Promise<Competency | null> {
    await this.competencyValidator.validateExistence(id);
    return this.competencyRepository.updateById(id, updateCompetencyDto);
  }

  /**
   * Elimina una competencia por su ID
   */
  async remove(id: string): Promise<Competency | null> {
    await this.competencyValidator.validateExistence(id);
    return this.competencyRepository.deleteById(id);
  }
}
