import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Roles } from 'src/users/enum/roles.enum';
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
  async findAll(requestingUser?: { sub: string; role: string }) {
    let sports = await this.sportRepository.findAll();

    if (!requestingUser || requestingUser.role !== Roles.SUPERADMIN) {
      sports = sports.filter((s) => (s as any).active === true);
    }

    return sports;
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
   * Lanza una excepción si el deporte está vinculado a algún club
   */
  async remove(id: string): Promise<Sport | null> {
    // Verificar si el deporte está vinculado a algún club
    const isLinked = await this.sportRepository.isLinkedToAnyClub(id);
    if (isLinked) {
      throw new ConflictException(
        'No se puede eliminar un deporte vinculado a un club',
      );
    }

    // Validar existencia y eliminar
    await this.sportValidator.validateExistence(id);
    return this.sportRepository.deleteById(id);
  }

  /**
   * Restaurar (reactivar) un deporte previamente desactivado
   */
  async restore(id: string): Promise<Sport | null> {
    await this.sportValidator.validateExistence(id);
    // Use updateById to mark the sport as active again
    return this.sportRepository.updateById(id, { active: true } as any);
  }

  /**
   * Marca un deporte como inactivo (soft delete)
   */
  async softRemove(id: string): Promise<Sport | null> {
    await this.sportValidator.validateExistence(id);
    return this.sportRepository.updateById(id, { active: false } as any);
  }
}
