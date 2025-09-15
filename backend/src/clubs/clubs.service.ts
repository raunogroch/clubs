// Servicio para la gestión de clubes
import { Injectable } from '@nestjs/common';
import { CreateClubDto, UpdateClubDto } from './dto';
import { Club } from './schema/club.schema';
import { Inject } from '@nestjs/common';
import { ClubValidatorService } from './club-validator.service';
import { ImageService } from 'src/utils';

@Injectable()
export class ClubsService {
  constructor(
    @Inject('ClubRepository') private readonly clubRepository,
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
    // Buscar el club antes de eliminar para obtener la ruta de la imagen
    const club = await this.clubRepository.findById(id);
    if (!club) return null;
    const deleted = await this.clubRepository.deleteById(id);
    // Solo eliminar la imagen si la eliminación fue exitosa y hay imagen
    if (deleted && club.image) {
      await this.clubImageService.deleteImage(this.folder, club.image);
    }
    return deleted;
  }
}
