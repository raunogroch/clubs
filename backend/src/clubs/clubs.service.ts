// Servicio para la gestión de clubes
import { Injectable, NotFoundException } from '@nestjs/common';
import { Roles } from 'src/users/enum/roles.enum';
import { CreateClubDto, UpdateClubDto } from './dto';
import { Club } from './schema/club.schema';
import { Inject } from '@nestjs/common';
import { ClubValidatorService } from './club-validator.service';
import { ImageService } from 'src/utils';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class ClubsService {
  constructor(
    @Inject('ClubRepository') private readonly clubRepository,
    private readonly clubValidator: ClubValidatorService,
    private readonly clubImageService: ImageService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
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
  async findAll(requestingUser?: {
    sub: string;
    role: string;
  }): Promise<Club[]> {
    let clubs: Club[] = await this.clubRepository.findAllPopulated();

    // Si el solicitante no es superadmin, devolver sólo clubes activos
    if (!requestingUser || requestingUser.role !== Roles.SUPERADMIN) {
      clubs = clubs.filter((c) => c.active === true);
    }

    // Si el solicitante es ASSISTANT, devolver sólo los clubes donde esté asignado
    if (requestingUser && requestingUser.role === Roles.ASSISTANT) {
      const userId = requestingUser.sub;
      clubs = clubs.filter((c: any) => {
        if (!c.assistants || c.assistants.length === 0) return false;
        return c.assistants.some((a: any) => {
          const aid = a?._id ? a._id.toString() : a?.toString();
          return aid === userId;
        });
      });
    }

    return clubs;
  }

  /**
   * Asigna una lista de asistentes a un club (reemplaza la lista actual)
   */
  async assignAssistants(
    clubId: string,
    assistantIds: string[],
  ): Promise<Club | null> {
    // Validar que los usuarios existan y sean assistants
    const validUsers = await this.userModel.find({
      _id: { $in: assistantIds },
      role: Roles.ASSISTANT,
    });
    if (validUsers.length !== assistantIds.length) {
      throw new NotFoundException(
        'Algunos asistentes no existen o no tienen rol assistant',
      );
    }
    return this.clubRepository.updateById(clubId, {
      assistants: assistantIds,
    } as any);
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
    /*if (deleted && club.image) {
      await this.clubImageService.deleteImage(this.folder, club.image);
    }*/
    return deleted;
  }

  /**
   * Restaurar (reactivar) un club previamente desactivado
   */
  async restore(id: string): Promise<Club | null> {
    return this.clubRepository.updateById(id, { active: true } as Club);
  }
}
