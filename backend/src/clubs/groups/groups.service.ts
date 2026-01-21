/**
 * Servicio de Grupos
 * Lógica de negocio para operaciones con grupos
 */

import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { GroupRepository } from '../repository/group.repository';
import { ClubRepository } from '../repository/club.repository';
import { CreateGroupDto } from '../dto/create-group.dto';
import { UpdateGroupDto } from '../dto/update-group.dto';
import { Group } from '../schemas/group.schema';
import { AssignmentsService } from '../../assignments/assignments.service';

@Injectable()
export class GroupsService {
  constructor(
    private groupRepository: GroupRepository,
    private clubRepository: ClubRepository,
    private assignmentsService: AssignmentsService,
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
   * Añadir miembro a un grupo
   */
  async addMember(
    groupId: string,
    memberId: string,
    userId: string,
  ): Promise<Group> {
    const group = await this.groupRepository.findById(groupId);
    if (!group) {
      throw new NotFoundException(`Grupo con ID ${groupId} no encontrado`);
    }

    // Verificar acceso al club
    await this.verifyClubAccess(group.club_id.toString(), userId);

    const updated = await this.groupRepository.addMember(groupId, memberId);
    if (!updated) {
      throw new NotFoundException(`Grupo con ID ${groupId} no encontrado`);
    }

    return updated;
  }

  /**
   * Remover miembro de un grupo
   */
  async removeMember(
    groupId: string,
    memberId: string,
    userId: string,
  ): Promise<Group> {
    const group = await this.groupRepository.findById(groupId);
    if (!group) {
      throw new NotFoundException(`Grupo con ID ${groupId} no encontrado`);
    }

    // Verificar acceso al club
    await this.verifyClubAccess(group.club_id.toString(), userId);

    const updated = await this.groupRepository.removeMember(groupId, memberId);
    if (!updated) {
      throw new NotFoundException(`Grupo con ID ${groupId} no encontrado`);
    }

    return updated;
  }
}
