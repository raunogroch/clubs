// Servicio para validaciones de Competency
import { Injectable } from '@nestjs/common';
import type { ICompetencyRepository } from './repository/competency.repository.interface';

@Injectable()
export class CompetencyValidatorService {
  constructor(private readonly competencyRepository: ICompetencyRepository) {}

  async validateUniqueName(name: string): Promise<void> {
    const competency = await this.competencyRepository.findOneByName(name);
    if (competency) {
      throw new Error('Competency with this name already exists');
    }
  }

  async validateExistence(id: string): Promise<void> {
    const competency = await this.competencyRepository.findById(id);
    if (!competency) {
      throw new Error(`Competency with id ${id} isn't exist`);
    }
  }
}
