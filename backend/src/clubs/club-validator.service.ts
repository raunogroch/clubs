// Servicio para validaciones de Club
import { Injectable } from '@nestjs/common';
import type { IClubRepository } from './repository/club.repository.interface';

@Injectable()
export class ClubValidatorService {
  constructor(private readonly clubRepository: IClubRepository) {}

  async validateUniqueName(name: string): Promise<void> {
    const club = await this.clubRepository.findOneByName(name);
    if (club) {
      throw new Error('Club with this name already exists');
    }
  }

  async validateExistence(id: string): Promise<void> {
    const club = await this.clubRepository.findById(id);
    if (!club) {
      throw new Error(`Club with id ${id} doesn't exist`);
    }
  }
}
