/**
 * Service para Club (lógica de negocio)
 * Maneja creación, lectura, actualización y eliminación de clubs
 */

import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { ClubRepository } from './repository/club.repository';
import { AssignmentsService } from '../assignments/assignments.service';
import { Assignment } from '../assignments/schemas/assignment.schema';

@Injectable()
export class ClubsService {
  constructor(
    private clubRepository: ClubRepository,
    private assignmentsService: AssignmentsService,
  ) {}

  /**
   * Crear un nuevo club
   * Solo los administradores de la asignación pueden crear clubs
   */
  async createClub(createClubDto: CreateClubDto, userId: string) {
    // Validar que el usuario es administrador de esta asignación
    const isAdmin = await this.assignmentsService.isUserAdminOfAssignment(
      userId,
      createClubDto.assignment_id,
    );

    if (!isAdmin) {
      throw new ForbiddenException(
        'No tienes permisos para crear clubs en esta asignación',
      );
    }

    // Validar que el nombre no esté vacío
    if (!createClubDto.name || createClubDto.name.trim().length === 0) {
      throw new BadRequestException('El nombre del club no puede estar vacío');
    }

    // Crear el club
    const club = await this.clubRepository.create(createClubDto, userId);

    // Agregar el club al assignment
    await this.assignmentsService.addClubToAssignment(
      createClubDto.assignment_id,
      (club._id as any).toString(),
    );

    return {
      _id: club._id,
      name: club.name,
      description: club.description,
      location: club.location,
      assignment_id: club.assignment_id,
      created_by: club.created_by,
      members: club.members,
      createdAt: club.createdAt,
      updatedAt: club.updatedAt,
    };
  }

  /**
   * Obtener todos los clubs de las asignaciones del usuario
   */
  async getMyClubs(userId: string) {
    // Obtener las asignaciones del usuario
    const assignments =
      await this.assignmentsService.getUserAssignments(userId);

    if (!assignments || assignments.length === 0) {
      return [];
    }

    // Obtener todos los clubs de estas asignaciones
    const clubsByAssignment = await Promise.all(
      assignments.map((assignment: Assignment) =>
        this.clubRepository.findByAssignment(
          (assignment._id as any).toString(),
        ),
      ),
    );

    // Aplanar el array y retornar
    return clubsByAssignment.flat();
  }

  /**
   * Obtener un club por ID
   * Verifica que el usuario tenga acceso (sea admin de la asignación)
   */
  async getClub(clubId: string, userId: string) {
    const club = await this.clubRepository.findById(clubId);

    if (!club) {
      throw new NotFoundException(`Club con ID ${clubId} no encontrado`);
    }

    // Verificar que el usuario es admin de la asignación
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
        'No tienes permisos para acceder a este club',
      );
    }

    return club;
  }

  /**
   * Actualizar un club
   * El creador o administrador de la asignación pueden actualizar
   */
  async updateClub(
    clubId: string,
    updateClubDto: UpdateClubDto,
    userId: string,
  ) {
    try {
      const club = await this.clubRepository.findById(clubId);

      if (!club) {
        throw new NotFoundException(`Club con ID ${clubId} no encontrado`);
      }

      // Verificar permisos - creador o admin de la asignación
      const isCreator = club.created_by.toString() === userId;
      // Extraer el ID correctamente (puede estar populated como objeto)
      const assignmentId =
        typeof club.assignment_id === 'object' && club.assignment_id !== null
          ? (club.assignment_id as any)._id.toString()
          : (club.assignment_id as any).toString();
      const isAssignmentAdmin =
        await this.assignmentsService.isUserAdminOfAssignment(
          userId,
          assignmentId,
        );

      if (!isCreator && !isAssignmentAdmin) {
        throw new ForbiddenException(
          'No tienes permisos para actualizar este club',
        );
      }

      const updatedClub = await this.clubRepository.update(
        clubId,
        updateClubDto,
      );

      if (!updatedClub) {
        throw new NotFoundException('No se pudo actualizar el club');
      }

      return updatedClub;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      console.error('Error al actualizar club:', error);
      throw new BadRequestException(
        'Error al actualizar el club. Por favor intenta nuevamente.',
      );
    }
  }

  /**
   * Eliminar un club
   * Solo el creador o admin de la asignación pueden eliminar
   */
  async deleteClub(clubId: string, userId: string) {
    try {
      // Validar que el ID sea un ObjectId válido
      if (!clubId || clubId.length !== 24) {
        throw new BadRequestException('ID de club inválido');
      }

      const club = await this.clubRepository.findById(clubId);

      if (!club) {
        throw new NotFoundException(`Club con ID ${clubId} no encontrado`);
      }

      // Verificar permisos
      const isCreator = club.created_by.toString() === userId;
      // Extraer el ID correctamente (puede estar populated como objeto)
      const assignmentId =
        typeof club.assignment_id === 'object' && club.assignment_id !== null
          ? (club.assignment_id as any)._id.toString()
          : (club.assignment_id as any).toString();
      const isAssignmentAdmin =
        await this.assignmentsService.isUserAdminOfAssignment(
          userId,
          assignmentId,
        );

      if (!isCreator && !isAssignmentAdmin) {
        throw new ForbiddenException(
          'No tienes permisos para eliminar este club',
        );
      }

      const deletedClub = await this.clubRepository.delete(clubId);

      if (!deletedClub) {
        throw new NotFoundException('No se pudo eliminar el club');
      }

      // Remover el club del assignment
      await this.assignmentsService.removeClubFromAssignment(
        assignmentId,
        clubId,
      );

      return { message: 'Club eliminado exitosamente' };
    } catch (error) {
      // Re-lanzar excepciones de NestJS
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }

      // Log del error para debugging
      console.error('Error al eliminar club:', error);

      // Lanzar error genérico para otros errores
      throw new BadRequestException(
        'Error al eliminar el club. Por favor intenta nuevamente.',
      );
    }
  }

  /**
   * Agregar un miembro al club
   */
  async addMember(clubId: string, userId: string, newMemberId: string) {
    const club = await this.clubRepository.findById(clubId);

    if (!club) {
      throw new NotFoundException(`Club con ID ${clubId} no encontrado`);
    }

    // Verificar que el usuario que añade es admin o creador
    const isCreator = club.created_by.toString() === userId;
    const isAssignmentAdmin =
      await this.assignmentsService.isUserAdminOfAssignment(
        userId,
        club.assignment_id.toString(),
      );

    if (!isCreator && !isAssignmentAdmin) {
      throw new ForbiddenException(
        'No tienes permisos para añadir miembros a este club',
      );
    }

    // Agregar miembro si no está ya
    if (!club.members.some((memberId) => memberId.toString() === newMemberId)) {
      club.members.push(newMemberId as any);
      await club.save();
    }

    return club;
  }

  /**
   * Remover un miembro del club
   */
  async removeMember(clubId: string, userId: string, memberId: string) {
    const club = await this.clubRepository.findById(clubId);

    if (!club) {
      throw new NotFoundException(`Club con ID ${clubId} no encontrado`);
    }

    // Verificar que el usuario que remueve es admin o creador
    const isCreator = club.created_by.toString() === userId;
    const isAssignmentAdmin =
      await this.assignmentsService.isUserAdminOfAssignment(
        userId,
        club.assignment_id.toString(),
      );

    if (!isCreator && !isAssignmentAdmin) {
      throw new ForbiddenException(
        'No tienes permisos para remover miembros de este club',
      );
    }

    // Remover miembro
    club.members = club.members.filter((m) => m.toString() !== memberId);
    await club.save();

    return club;
  }
}
