// Servicio para validaciones de Sport
import { Injectable, ConflictException } from '@nestjs/common';
import type { ISportRepository } from './repository/sport.repository.interface';
import { Inject } from '@nestjs/common';

@Injectable()
export class SportValidatorService {
  constructor(
    @Inject('SportRepository')
    private readonly sportRepository: ISportRepository,
  ) {}

  /**
   * Valida que no exista un deporte con el mismo nombre (ignorando mayúsculas, minúsculas y caracteres especiales)
   */
  async validateUniqueName(name: string): Promise<void> {
    const sport = await this.sportRepository.findOneByName(name);
    if (sport) {
      throw new ConflictException('Ya existe un deporte con ese nombre');
    }
  }

  async validateExistence(id: string): Promise<void> {
    const sport = await this.sportRepository.findById(id);
    if (!sport) {
      throw new Error(`Sport with id ${id} doesn't exist`);
    }
  }
}
