// Servicio para la gestión de clubes
import { Injectable } from '@nestjs/common';
import { CreateClubDto, UpdateClubDto } from './dto';
import { Club } from './schema/club.schema';
import type { IClubRepository } from './repository/club.repository.interface';
import { Inject } from '@nestjs/common';
import { ClubValidatorService } from './club-validator.service';
import { ImageService } from 'src/utils';

@Injectable()
export class ClubsService {
  constructor(
    @Inject('ClubRepository') private readonly clubRepository: IClubRepository,
    private readonly clubValidator: ClubValidatorService,
    private readonly clubImageService: ImageService,
  ) {}

  folder = 'clubs';

  /**
   * Crea un nuevo club si el nombre no existe previamente
   * SRP: la validación se delega al validador
   */
  async create(createClubDto: CreateClubDto): Promise<Club> {
    createClubDto.image = this.clubImageService.processImage(
      this.folder,
      createClubDto.image,
    );
    await this.clubValidator.validateUniqueName(createClubDto.name);
    return this.clubRepository.create(createClubDto);
  }

  /**
   * Obtiene todos los clubes con sus relaciones pobladas
   */
  async findAll(): Promise<Club[]> {
    return this.clubRepository.findAllPopulated();
  }

  /**
   * Busca un club por su ID
   */
  async findOne(id: string): Promise<Club | null> {
    return this.clubRepository.findById(id);
  }

  /**
   * Actualiza los datos de un club
   * SRP: la validación se delega al validador
   */
  async update(id: string, updateClubDto: UpdateClubDto): Promise<Club | null> {
    updateClubDto.image = this.clubImageService.processImage(
      this.folder,
      updateClubDto.image,
    );
    await this.clubValidator.validateExistence(id);
    return this.clubRepository.updateById(id, updateClubDto);
  }

  /**
   * Elimina un club por su ID
   */
  async remove(id: string): Promise<Club | null> {
    await this.clubValidator.validateExistence(id);
    return this.clubRepository.deleteById(id);
  }

  /**
   * Busca los clubes donde el usuario actual es coach o athlete
   */
  async findClubsByUserId(userId: string): Promise<Club[]> {
    // Busca clubes donde el usuario esté en coaches o athletes
    return this.clubRepository.findClubsByUserId(userId);
  }
}
