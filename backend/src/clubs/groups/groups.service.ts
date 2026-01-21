/**
 * Servicio de Grupos
 * Lógica de negocio para operaciones con grupos
 */

import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { GroupRepository } from '../repository/group.repository';
import { ClubRepository } from '../repository/club.repository';
import { CreateGroupDto } from '../dto/create-group.dto';
import { UpdateGroupDto } from '../dto/update-group.dto';
import { Group } from '../schemas/group.schema';
import { AssignmentsService } from '../../assignments/assignments.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

@Injectable()
export class GroupsService {
  constructor(
    private groupRepository: GroupRepository,
    private clubRepository: ClubRepository,
    private assignmentsService: AssignmentsService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  /**
   * Verificar si el usuario tiene permiso para acceder a un club
   * Extrae el ID de asignación correctamente (puede estar populated)
   */
  private async verifyClubAccess(
    clubId: string,
    userId: string,
  ): Promise<void> {
    const club = await this.clubRepository.findById(clubId);
    if (!club) {
      throw new NotFoundException(`Club con ID ${clubId} no encontrado`);
    }

    let assignmentId: string;

    if (typeof club.assignment_id === 'object' && club.assignment_id !== null) {
      // Si es un objeto (poblado), extrae el _id
      assignmentId =
        (club.assignment_id as any)._id?.toString?.() ||
        (club.assignment_id as any)?.toString?.();
    } else {
      // Si es un string o ID directo
      assignmentId =
        (club.assignment_id as any)?.toString?.() || String(club.assignment_id);
    }

    const isAdmin = await this.assignmentsService.isUserAdminOfAssignment(
      userId,
      assignmentId,
    );

    if (!isAdmin) {
      throw new ForbiddenException(
        'No tienes permiso para acceder a este club',
      );
    }
  }

  /**
   * Crear un nuevo grupo en un club
   */
  async createGroup(
    createGroupDto: CreateGroupDto,
    userId: string,
  ): Promise<Group> {
    // Verificar acceso al club
    await this.verifyClubAccess(createGroupDto.club_id, userId);

    // Crear el grupo
    return this.groupRepository.create(createGroupDto, userId);
  }

  /**
   * Obtener todos los grupos de un club
   */
  async getGroupsByClub(clubId: string, userId: string): Promise<Group[]> {
    // Verificar que el club existe
    const club = await this.clubRepository.findById(clubId);
    if (!club) {
      throw new NotFoundException(`Club con ID ${clubId} no encontrado`);
    }

    // Verificar que el usuario es admin de la asignación del club
    // Extraer el ID correctamente (puede estar populated como objeto)
    const assignmentId =
      typeof club.assignment_id === 'object' && club.assignment_id !== null
        ? (club.assignment_id as any)._id.toString()
        : (club.assignment_id as any).toString();

    const isAdmin = await this.assignmentsService.isUserAdminOfAssignment(
      userId,
      assignmentId,
    );

    if (!isAdmin) {
      throw new ForbiddenException(
        'No tienes permiso para ver grupos de este club',
      );
    }

    return this.groupRepository.findByClub(clubId);
  }

  /**
   * Obtener un grupo específico
   */
  async getGroup(groupId: string, userId: string): Promise<Group> {
    const group = await this.groupRepository.findById(groupId);
    if (!group) {
      throw new NotFoundException(`Grupo con ID ${groupId} no encontrado`);
    }

    // Verificar acceso al club
    await this.verifyClubAccess(group.club_id.toString(), userId);

    return group;
  }

  /**
   * Actualizar un grupo
   */
  async updateGroup(
    groupId: string,
    updateGroupDto: UpdateGroupDto,
    userId: string,
  ): Promise<Group> {
    const group = await this.groupRepository.findById(groupId);
    if (!group) {
      throw new NotFoundException(`Grupo con ID ${groupId} no encontrado`);
    }

    // Verificar acceso al club
    await this.verifyClubAccess(group.club_id.toString(), userId);

    const updated = await this.groupRepository.update(groupId, updateGroupDto);
    if (!updated) {
      throw new NotFoundException(`Grupo con ID ${groupId} no encontrado`);
    }

    return updated;
  }

  /**
   * Eliminar un grupo
   */
  async deleteGroup(groupId: string, userId: string): Promise<Group> {
    const group = await this.groupRepository.findById(groupId);
    if (!group) {
      throw new NotFoundException(`Grupo con ID ${groupId} no encontrado`);
    }

    // Verificar acceso al club
    await this.verifyClubAccess(group.club_id.toString(), userId);

    const deleted = await this.groupRepository.delete(groupId);
    if (!deleted) {
      throw new NotFoundException(`Grupo con ID ${groupId} no encontrado`);
    }

    return deleted;
  }

  /**
   * Añadir atleta a un grupo
   */
  async addAthlete(
    groupId: string,
    athleteId: string,
    userId: string,
  ): Promise<Group> {
    try {
      // Verificar que el usuario a agregar sea un atleta
      const athlete = await this.userModel.findById(athleteId);
      if (!athlete) {
        throw new NotFoundException(
          `Usuario con ID ${athleteId} no encontrado`,
        );
      }
      if (athlete.role !== 'athlete') {
        throw new BadRequestException(
          `El usuario con ID ${athleteId} no es un atleta`,
        );
      }

      const group = await this.groupRepository.findById(groupId);
      if (!group) {
        throw new NotFoundException(`Grupo con ID ${groupId} no encontrado`);
      }

      // Extraer el ID del club (puede estar poblado como objeto o ser un string)
      let clubId: string;
      if (typeof group.club_id === 'object' && group.club_id !== null) {
        clubId =
          (group.club_id as any)._id?.toString?.() ||
          (group.club_id as any)?.toString?.();
      } else {
        clubId = String(group.club_id);
      }

      // Verificar acceso al club
      await this.verifyClubAccess(clubId, userId);

      // Agregar atleta
      const updated = await this.groupRepository.addAthlete(groupId, athleteId);
      if (!updated) {
        throw new NotFoundException(`Grupo con ID ${groupId} no encontrado`);
      }

      return updated;
    } catch (error) {
      console.error('Error en addAthlete:', error);
      throw error;
    }
  }

  /**
   * Remover atleta de un grupo
   */
  async removeAthlete(
    groupId: string,
    athleteId: string,
    userId: string,
  ): Promise<Group> {
    try {
      const group = await this.groupRepository.findById(groupId);
      if (!group) {
        throw new NotFoundException(`Grupo con ID ${groupId} no encontrado`);
      }

      // Extraer el ID del club
      let clubId: string;
      if (typeof group.club_id === 'object' && group.club_id !== null) {
        clubId =
          (group.club_id as any)._id?.toString?.() ||
          (group.club_id as any)?.toString?.();
      } else {
        clubId = String(group.club_id);
      }

      // Verificar acceso al club
      await this.verifyClubAccess(clubId, userId);

      const updated = await this.groupRepository.removeAthlete(
        groupId,
        athleteId,
      );
      if (!updated) {
        throw new NotFoundException(`Grupo con ID ${groupId} no encontrado`);
      }

      return updated;
    } catch (error) {
      console.error('Error en removeAthlete:', error);
      throw error;
    }
  }

  /**
   * Añadir entrenador a un grupo
   */
  async addCoach(
    groupId: string,
    coachId: string,
    userId: string,
  ): Promise<Group> {
    try {
      // Verificar que el usuario a agregar sea un entrenador
      const coach = await this.userModel.findById(coachId);
      if (!coach) {
        throw new NotFoundException(`Usuario con ID ${coachId} no encontrado`);
      }
      if (coach.role !== 'coach') {
        throw new BadRequestException(
          `El usuario con ID ${coachId} no es un entrenador`,
        );
      }

      const group = await this.groupRepository.findById(groupId);
      if (!group) {
        throw new NotFoundException(`Grupo con ID ${groupId} no encontrado`);
      }

      // Extraer el ID del club
      let clubId: string;
      if (typeof group.club_id === 'object' && group.club_id !== null) {
        clubId =
          (group.club_id as any)._id?.toString?.() ||
          (group.club_id as any)?.toString?.();
      } else {
        clubId = String(group.club_id);
      }

      // Verificar acceso al club
      await this.verifyClubAccess(clubId, userId);

      // Agregar entrenador
      const updated = await this.groupRepository.addCoach(groupId, coachId);
      if (!updated) {
        throw new NotFoundException(`Grupo con ID ${groupId} no encontrado`);
      }

      return updated;
    } catch (error) {
      console.error('Error en addCoach:', error);
      throw error;
    }
  }

  /**
   * Remover entrenador de un grupo
   */
  async removeCoach(
    groupId: string,
    coachId: string,
    userId: string,
  ): Promise<Group> {
    try {
      const group = await this.groupRepository.findById(groupId);
      if (!group) {
        throw new NotFoundException(`Grupo con ID ${groupId} no encontrado`);
      }

      // Extraer el ID del club
      let clubId: string;
      if (typeof group.club_id === 'object' && group.club_id !== null) {
        clubId =
          (group.club_id as any)._id?.toString?.() ||
          (group.club_id as any)?.toString?.();
      } else {
        clubId = String(group.club_id);
      }

      // Verificar acceso al club
      await this.verifyClubAccess(clubId, userId);

      const updated = await this.groupRepository.removeCoach(groupId, coachId);
      if (!updated) {
        throw new NotFoundException(`Grupo con ID ${groupId} no encontrado`);
      }

      return updated;
    } catch (error) {
      console.error('Error en removeCoach:', error);
      throw error;
    }
  }

  /**
   * Añadir miembro a un grupo (legacy - mantener para compatibilidad)
   */
  async addMember(
    groupId: string,
    memberId: string,
    userId: string,
    role?: string,
  ): Promise<Group> {
    try {
      if (role === 'coach') {
        return await this.addCoach(groupId, memberId, userId);
      } else if (role === 'athlete') {
        return await this.addAthlete(groupId, memberId, userId);
      }

      const group = await this.groupRepository.findById(groupId);
      if (!group) {
        throw new NotFoundException(`Grupo con ID ${groupId} no encontrado`);
      }

      // Extraer el ID del club (puede estar poblado como objeto o ser un string)
      let clubId: string;
      if (typeof group.club_id === 'object' && group.club_id !== null) {
        clubId =
          (group.club_id as any)._id?.toString?.() ||
          (group.club_id as any)?.toString?.();
      } else {
        clubId = String(group.club_id);
      }

      // Verificar acceso al club
      await this.verifyClubAccess(clubId, userId);

      // Agregar el miembro - Mongoose validará los IDs automáticamente
      const updated = await this.groupRepository.addMember(
        groupId,
        memberId,
        role,
      );
      if (!updated) {
        throw new NotFoundException(`Grupo con ID ${groupId} no encontrado`);
      }

      return updated;
    } catch (error) {
      console.error('Error en addMember:', error);
      throw error;
    }
  }

  /**
   * Remover miembro de un grupo (legacy - mantener para compatibilidad)
   */
  async removeMember(
    groupId: string,
    memberId: string,
    userId: string,
    role?: string,
  ): Promise<Group> {
    try {
      if (role === 'coach') {
        return await this.removeCoach(groupId, memberId, userId);
      } else if (role === 'athlete') {
        return await this.removeAthlete(groupId, memberId, userId);
      }

      const group = await this.groupRepository.findById(groupId);
      if (!group) {
        throw new NotFoundException(`Grupo con ID ${groupId} no encontrado`);
      }

      // Extraer el ID del club (puede estar poblado como objeto o ser un string)
      let clubId: string;
      if (typeof group.club_id === 'object' && group.club_id !== null) {
        clubId =
          (group.club_id as any)._id?.toString?.() ||
          (group.club_id as any)?.toString?.();
      } else {
        clubId = String(group.club_id);
      }

      // Verificar acceso al club
      await this.verifyClubAccess(clubId, userId);

      const updated = await this.groupRepository.removeMember(
        groupId,
        memberId,
        role,
      );
      if (!updated) {
        throw new NotFoundException(`Grupo con ID ${groupId} no encontrado`);
      }

      return updated;
    } catch (error) {
      console.error('Error en removeMember:', error);
      throw error;
    }
  }
}
