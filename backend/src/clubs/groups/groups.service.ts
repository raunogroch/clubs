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
import {
  CreateGroupLevelDto,
  UpdateGroupLevelDto,
} from '../dto/group-level.dto';
import { Group } from '../schemas/group.schema';
import { AssignmentsService } from '../../assignments/assignments.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { RegistrationsService } from '../../registrations/registrations.service';

@Injectable()
export class GroupsService {
  constructor(
    private groupRepository: GroupRepository,
    private clubRepository: ClubRepository,
    private assignmentsService: AssignmentsService,
    @InjectModel(User.name) private userModel: Model<User>,
    private registrationsService?: RegistrationsService,
  ) {}

  /**
   * Verificar si el usuario tiene permiso para acceder a un club
   * Extrae el ID de asignación correctamente (puede estar populated)
   */
  private async verifyClubAccess(
    clubId: string,
    userId: string,
  ): Promise<void> {
    // Validate clubId early to avoid passing the string "undefined" to Mongoose
    if (!clubId || clubId === 'undefined' || clubId === 'null') {
      throw new BadRequestException('Club ID inválido o ausente');
    }
    if (!Types.ObjectId.isValid(clubId as any)) {
      throw new BadRequestException(`Club ID inválido: ${clubId}`);
    }

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

    // Infer assignment_id from club (if not provided)
    const club = await this.clubRepository.findById(createGroupDto.club_id);
    if (club && !createGroupDto.assignment_id) {
      (createGroupDto as any).assignment_id =
        typeof club.assignment_id === 'object' && club.assignment_id !== null
          ? (club.assignment_id as any)._id?.toString?.() ||
            (club.assignment_id as any)?.toString?.()
          : (club.assignment_id as any)?.toString?.();
    }

    // Crear el grupo
    const created = await this.groupRepository.create(createGroupDto, userId);

    // Añadir referencia del grupo al club
    try {
      await this.clubRepository.addGroupToClub(
        createGroupDto.club_id,
        (created._id as any).toString(),
      );
    } catch (e) {
      console.error('No se pudo agregar groupId al club.groups:', e);
    }

    return created;
  }

  /**
   * Obtener todos los grupos donde el usuario autenticado es coach
   */
  async getMyCoachGroups(userId: string): Promise<Group[]> {
    const groups = await this.groupRepository.findByCoach(userId);
    // Log a concise summary to avoid noisy duplicate outputs when endpoint is
    // requested multiple times by the frontend. Include coachId and count.
    try {
      const names = groups.map((g) => (g as any).name || '(sin nombre)');
      console.log(
        `COACH SCHEDULES for ${userId}: ${groups.length} groups -> ${names.join(', ')}`,
      );
    } catch (e) {
      console.log(`COACH SCHEDULES for ${userId}: ${groups.length} groups`);
    }
    return groups;
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
  async getGroup(
    groupId: string,
    userId: string,
    fields?: string[],
  ): Promise<Group> {
    const group = await this.groupRepository.findById(groupId, fields);
    if (!group) {
      throw new NotFoundException(`Grupo con ID ${groupId} no encontrado`);
    }

    // Asegurarse que el grupo tiene un club asociado
    if (!group.club_id) {
      throw new NotFoundException(
        `Grupo con ID ${groupId} no tiene club asociado`,
      );
    }

    // Extraer el club_id correctamente (puede estar poblado)
    let clubId: string;
    if (typeof group.club_id === 'object' && group.club_id !== null) {
      clubId = (group.club_id as any)._id?.toString() || String(group.club_id);
    } else {
      clubId = String(group.club_id);
    }

    // Verificar acceso al club
    await this.verifyClubAccess(clubId, userId);

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

    // Extraer el club_id correctamente (puede estar poblado)
    let clubId: string;
    if (typeof group.club_id === 'object' && group.club_id !== null) {
      clubId = (group.club_id as any)._id?.toString() || String(group.club_id);
    } else {
      clubId = String(group.club_id);
    }

    // Verificar acceso al club
    await this.verifyClubAccess(clubId, userId);

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

    // Extraer el club_id correctamente (puede estar poblado)
    let clubId: string;
    if (typeof group.club_id === 'object' && group.club_id !== null) {
      clubId = (group.club_id as any)._id?.toString() || String(group.club_id);
    } else {
      clubId = String(group.club_id);
    }

    // Verificar acceso al club
    await this.verifyClubAccess(clubId, userId);

    // Cascade delete: eliminar registrations asociados y quitar referencia en club
    // 1) Eliminar registrations del grupo
    try {
      if (this.registrationsService) {
        await this.registrationsService.deleteByGroup(groupId);
      }
    } catch (e) {
      console.error('Error al eliminar registrations del grupo:', e);
    }

    // 2) Remover el groupId del club.groups
    try {
      const clubIdStr =
        typeof group.club_id === 'object' && group.club_id !== null
          ? (group.club_id as any)._id?.toString?.() || String(group.club_id)
          : String(group.club_id);
      await this.clubRepository.removeGroupFromClub(clubIdStr, groupId);
    } catch (e) {
      console.error('Error al remover groupId del club:', e);
    }

    // 3) Eliminar el grupo
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

      // Crear un registro (registration) y asociarlo al grupo
      if (!this.registrationsService) {
        throw new Error('RegistrationsService no disponible');
      }

      const registration = await this.registrationsService.createRegistration({
        group_id: groupId,
        athlete_id: athleteId,
        registration_date: new Date().toISOString(),
        registration_pay: null,
        monthly_payments: [],
        // Infer assignment_id from group if available
        assignment_id:
          typeof group.assignment_id === 'object' &&
          group.assignment_id !== null
            ? (group.assignment_id as any)._id?.toString?.() ||
              (group.assignment_id as any)?.toString?.()
            : (group.assignment_id as any)?.toString?.(),
      });

      // Agregar el id del registro al grupo (athletes_added)
      const updated = await this.groupRepository.addAthlete(
        groupId,
        registration._id.toString(),
      );
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

      if (!this.registrationsService) {
        throw new Error('RegistrationsService no disponible');
      }

      // Buscar el registro asociado a este athlete en el grupo
      const registration =
        await this.registrationsService.findByGroupAndAthlete(
          groupId,
          athleteId,
        );

      if (!registration) {
        throw new NotFoundException(
          `Registro de athlete ${athleteId} en grupo ${groupId} no encontrado`,
        );
      }

      // Validar que el atleta no tenga matrícula pagada
      if (
        registration.registration_pay !== null &&
        registration.registration_pay !== undefined
      ) {
        throw new BadRequestException(
          'No se puede remover un atleta con matrícula pagada. Contacta al administrador.',
        );
      }

      // Eliminar el registro y remover su id del grupo
      await this.registrationsService.delete(registration._id.toString());

      const updated = await this.groupRepository.removeAthlete(
        groupId,
        registration._id.toString(),
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

  /**
   * Agregar horario a un grupo
   */
  async addSchedule(
    groupId: string,
    day: string,
    startTime: string,
    endTime: string,
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

      // Validar que el horario sea válido
      if (
        ![
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ].includes(day)
      ) {
        throw new BadRequestException(`Día inválido: ${day}`);
      }

      if (startTime >= endTime) {
        throw new BadRequestException(
          'La hora de inicio debe ser menor a la hora de fin',
        );
      }

      const updated = await this.groupRepository.addSchedule(groupId, {
        day,
        startTime,
        endTime,
      });

      if (!updated) {
        throw new NotFoundException(`Grupo con ID ${groupId} no encontrado`);
      }

      return updated;
    } catch (error) {
      console.error('Error en addSchedule:', error);
      throw error;
    }
  }

  /**
   * Remover horario de un grupo
   */
  async removeSchedule(
    groupId: string,
    scheduleIndex: number,
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

      const updated = await this.groupRepository.removeSchedule(
        groupId,
        scheduleIndex,
      );

      if (!updated) {
        throw new NotFoundException(`Grupo con ID ${groupId} no encontrado`);
      }

      return updated;
    } catch (error) {
      console.error('Error en removeSchedule:', error);
      throw error;
    }
  }

  /**
   * Actualizar múltiples horarios en una operación batch
   * Elimina todos los horarios actuales y agrega los nuevos
   */
  async updateSchedulesBatch(
    groupId: string,
    schedules: Array<{ day: string; startTime: string; endTime: string }>,
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

      // Validar todos los horarios antes de hacer cambios
      const VALID_DAYS = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ];

      for (const schedule of schedules) {
        if (!VALID_DAYS.includes(schedule.day)) {
          throw new BadRequestException(`Día inválido: ${schedule.day}`);
        }
        if (schedule.startTime >= schedule.endTime) {
          throw new BadRequestException(
            'La hora de inicio debe ser menor a la hora de fin',
          );
        }
      }

      // Eliminar todos los horarios actuales
      const currentSchedules = group.schedule || [];
      let updatedGroup: Group | null = group;

      for (let i = currentSchedules.length - 1; i >= 0; i--) {
        updatedGroup = await this.groupRepository.removeSchedule(groupId, i);
        if (!updatedGroup)
          throw new BadRequestException('Failed to remove schedule');
      }

      // Agregar los nuevos horarios
      for (const schedule of schedules) {
        updatedGroup = await this.groupRepository.addSchedule(groupId, {
          day: schedule.day,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
        });
        if (!updatedGroup)
          throw new BadRequestException('Failed to add schedule');
      }

      if (!updatedGroup) throw new BadRequestException('No group updated');
      return updatedGroup;
    } catch (error) {
      console.error('Error en updateSchedulesBatch:', error);
      throw error;
    }
  }

  /**
   * Añadir un nivel al grupo
   */
  async addLevel(
    groupId: string,
    createLevelDto: CreateGroupLevelDto,
    userId: string,
  ): Promise<Group> {
    const group = await this.groupRepository.findById(groupId);
    if (!group) {
      throw new NotFoundException(`Grupo con ID ${groupId} no encontrado`);
    }

    // Extraer el club_id correctamente
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

    // Crear el nivel con _id automático
    const newLevel = {
      _id: new Types.ObjectId(),
      position: createLevelDto.position,
      name: createLevelDto.name,
      description: createLevelDto.description,
    };

    // Agregar el nivel al array levels del grupo
    const updated = await this.groupRepository.addLevel(groupId, newLevel);
    if (!updated) {
      throw new NotFoundException(`Grupo con ID ${groupId} no encontrado`);
    }

    return updated;
  }

  /**
   * Actualizar un nivel del grupo
   */
  async updateLevel(
    groupId: string,
    levelId: string,
    updateLevelDto: UpdateGroupLevelDto,
    userId: string,
  ): Promise<Group> {
    const group = await this.groupRepository.findById(groupId);
    if (!group) {
      throw new NotFoundException(`Grupo con ID ${groupId} no encontrado`);
    }

    // Extraer el club_id correctamente
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

    // Encontrar el nivel dentro del array
    if (!group.levels || group.levels.length === 0) {
      throw new NotFoundException(`Nivel con ID ${levelId} no encontrado`);
    }

    const levelIndex = group.levels.findIndex(
      (l) => l._id?.toString() === levelId,
    );
    if (levelIndex === -1) {
      throw new NotFoundException(`Nivel con ID ${levelId} no encontrado`);
    }

    // Actualizar el nivel
    const updated = await this.groupRepository.updateLevel(
      groupId,
      levelId,
      updateLevelDto,
    );
    if (!updated) {
      throw new NotFoundException(`Grupo con ID ${groupId} no encontrado`);
    }

    return updated;
  }

  /**
   * Eliminar un nivel del grupo
   */
  async deleteLevel(
    groupId: string,
    levelId: string,
    userId: string,
  ): Promise<Group> {
    const group = await this.groupRepository.findById(groupId);
    if (!group) {
      throw new NotFoundException(`Grupo con ID ${groupId} no encontrado`);
    }

    // Extraer el club_id correctamente
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

    // Eliminar el nivel del array
    const updated = await this.groupRepository.deleteLevel(groupId, levelId);
    if (!updated) {
      throw new NotFoundException(`Grupo con ID ${groupId} no encontrado`);
    }

    return updated;
  }
}
