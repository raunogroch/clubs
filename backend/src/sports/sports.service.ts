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
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class SportsService {
  constructor(
    @Inject('SportRepository')
    private readonly sportRepository: ISportRepository,
    private readonly sportValidator: SportValidatorService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  /**
   * Obtener el groupId del admin desde AdminGroup
   */
  private async getAdminGroup(userId: string): Promise<Types.ObjectId | null> {
    try {
      const adminGroupModel =
        this.userModel.collection.conn.model('AdminGroup');
      const adminGroup = await adminGroupModel.findOne({
        administrator: userId,
      });
      return adminGroup?._id || null;
    } catch (error) {
      console.error('Error getting admin group:', error);
      return null;
    }
  }

  /**
   * Validar que el admin puede acceder al deporte
   */
  private async validateAdminAccess(
    sportId: string,
    adminUserId: string,
  ): Promise<boolean> {
    const sport = await this.sportRepository.findById(sportId);
    if (!sport) return false;

    const adminGroup = await this.getAdminGroup(adminUserId);
    if (!adminGroup) return false;

    const sportGroupId =
      (sport as any).groupId?._id?.toString() ||
      (sport as any).groupId?.toString();
    const adminGroupId = adminGroup._id?.toString() || adminGroup?.toString();

    return sportGroupId === adminGroupId;
  }

  /**
   * Crea un nuevo deporte si el nombre no existe previamente
   * SRP: la validación se delega al validador
   */
  async create(
    createSportDto: CreateSportDto,
    requestingUser?: { sub: string; role: string },
  ): Promise<Sport> {
    // Si el usuario es ADMIN, asignar automáticamente su groupId
    if (requestingUser && requestingUser.role === Roles.ADMIN) {
      const adminGroup = await this.getAdminGroup(requestingUser.sub);
      if (adminGroup) {
        createSportDto.groupId = adminGroup.toString();
      }
    }

    await this.sportValidator.validateUniqueName(createSportDto.name);
    return this.sportRepository.create(createSportDto);
  }

  /**
   * Obtiene todos los deportes
   * Nota: Los deportes son compartidos entre todos los grupos
   */
  async findAll(requestingUser?: { sub: string; role: string }) {
    let sports = await this.sportRepository.findAll();

    if (!requestingUser || requestingUser.role !== Roles.SUPERADMIN) {
      sports = sports.filter((s) => (s as any).active === true);
    }

    // Los deportes se ven por todos (no se filtra por grupo)
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
    requestingUser?: { sub: string; role: string },
  ): Promise<Sport | null> {
    // Validar acceso si es admin
    if (requestingUser && requestingUser.role === Roles.ADMIN) {
      const hasAccess = await this.validateAdminAccess(id, requestingUser.sub);
      if (!hasAccess) {
        throw new NotFoundException('No tienes acceso a este deporte');
      }
    }

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
   * Lanza una excepción si el deporte está vinculado a algún club
   */
  async remove(
    id: string,
    requestingUser?: { sub: string; role: string },
  ): Promise<Sport | null> {
    // Validar acceso si es admin
    if (requestingUser && requestingUser.role === Roles.ADMIN) {
      const hasAccess = await this.validateAdminAccess(id, requestingUser.sub);
      if (!hasAccess) {
        throw new NotFoundException('No tienes acceso a este deporte');
      }
    }

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
