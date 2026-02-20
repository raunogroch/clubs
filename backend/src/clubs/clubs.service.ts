/**
 * Service para Club (lógica de negocio)
 * Maneja creación, lectura, actualización y eliminación de clubs
 */

import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { ClubRepository } from './repository/club.repository';
import { CreateClubLevelDto, UpdateClubLevelDto } from './dto/club-level.dto';
import { AssignmentsService } from '../assignments/assignments.service';
import { SportsService } from '../sports/sports.service';
import { Assignment } from '../assignments/schemas/assignment.schema';

@Injectable()
export class ClubsService {
  constructor(
    private clubRepository: ClubRepository,
    private assignmentsService: AssignmentsService,
    private sportsService: SportsService,
    private configService: ConfigService,
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

    // Validar que el deporte existe
    const sport = await this.sportsService.findOne(createClubDto.sport_id);
    if (!sport) {
      throw new NotFoundException(
        `El deporte con ID ${createClubDto.sport_id} no existe`,
      );
    }

    // Validar que no existe un club con la misma combinación de deporte y asignación
    const clubExists = await this.clubRepository.existsBySportAndAssignment(
      createClubDto.sport_id,
      createClubDto.assignment_id,
    );
    if (clubExists) {
      throw new BadRequestException(
        `Ya existe un club de ${sport.name} en esta asignación`,
      );
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
      sport_id: club.sport_id,
      location: club.location,
      assignment_id: club.assignment_id,
      groups: club.groups || [],
      created_by: club.created_by,
      createdAt: club.createdAt,
      updatedAt: club.updatedAt,
    };
  }

  /**
   * Añadir un nivel al club
   */
  async addLevelToClub(
    clubId: string,
    userId: string,
    createClubLevelDto: CreateClubLevelDto,
  ) {
    const club = await this.clubRepository.findById(clubId);
    if (!club) throw new NotFoundException('Club no encontrado');

    // Permisos: creador o admin de la asignación
    const isCreator = club.created_by.toString() === userId;
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
      throw new ForbiddenException('No tienes permisos para agregar niveles');
    }

    const updated = await this.clubRepository.addLevel(
      clubId,
      createClubLevelDto as any,
    );
    return updated;
  }

  /**
   * Actualizar nivel del club
   */
  async updateLevelInClub(
    clubId: string,
    levelId: string,
    userId: string,
    updateClubLevelDto: UpdateClubLevelDto,
  ) {
    const club = await this.clubRepository.findById(clubId);
    if (!club) throw new NotFoundException('Club no encontrado');

    const isCreator = club.created_by.toString() === userId;
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
        'No tienes permisos para actualizar niveles',
      );
    }

    const updated = await this.clubRepository.updateLevel(
      clubId,
      levelId,
      updateClubLevelDto as any,
    );
    return updated;
  }

  /**
   * Eliminar nivel del club
   */
  async deleteLevelFromClub(clubId: string, levelId: string, userId: string) {
    const club = await this.clubRepository.findById(clubId);
    if (!club) throw new NotFoundException('Club no encontrado');

    const isCreator = club.created_by.toString() === userId;
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
      throw new ForbiddenException('No tienes permisos para eliminar niveles');
    }

    const updated = await this.clubRepository.deleteLevel(clubId, levelId);
    return updated;
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
  async addAssistantToClub(
    clubId: string,
    userId: string,
    assistantId: string,
  ) {
    const club = await this.clubRepository.findById(clubId);
    if (!club) throw new NotFoundException('Club no encontrado');

    const isCreator = club.created_by.toString() === userId;
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
        'No tienes permisos para asignar secretarios',
      );
    }

    await this.clubRepository.addAssistantToClub(clubId, assistantId);
    return this.clubRepository.findById(clubId);
  }

  async removeAssistantFromClub(
    clubId: string,
    userId: string,
    assistantId: string,
  ) {
    const club = await this.clubRepository.findById(clubId);
    if (!club) throw new NotFoundException('Club no encontrado');

    const isCreator = club.created_by.toString() === userId;
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
        'No tienes permisos para quitar secretarios',
      );
    }

    await this.clubRepository.removeAssistantFromClub(clubId, assistantId);
    return this.clubRepository.findById(clubId);
  }

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
    await club.save();

    return club;
  }

  /**
   * Obtener datos del dashboard de clubs
   * Retorna: _id, name, location, athletes_added, coaches
   */
  async getDashboardData(userId: string) {
    const assignments =
      await this.assignmentsService.getUserAssignments(userId);

    if (!assignments || assignments.length === 0) {
      return { clubs: [] };
    }

    const clubsByAssignment = await Promise.all(
      assignments.map((assignment: Assignment) =>
        this.clubRepository.findByAssignmentWithPopulate(
          (assignment._id as any).toString(),
        ),
      ),
    );

    const clubs = clubsByAssignment.flat();

    const processedClubs = clubs.map((club: any) => {
      let totalAthletes = 0;
      let totalCoaches = 0;

      if (club.groups && club.groups.length > 0) {
        club.groups.forEach((group: any) => {
          totalAthletes += group.athletes_added?.length || 0;
          totalCoaches += group.coaches?.length || 0;
        });
      }

      return {
        _id: club._id,
        name: club.name || 'Sin nombre',
        sport: club.sport_id.name,
        location: club.location || '-',
        athletes_added: totalAthletes,
        coaches: totalCoaches,
        levels: club.levels || [],
        images: {
          small: club.images?.small || null,
          medium: club.images?.medium || null,
          large: club.images?.large || null,
        },
      };
    });

    return { clubs: processedClubs };
  }

  /**
   * Actualizar logo del club (procesa imagen con image-processor y guarda URLs)
   */
  async updateClubLogo(
    clubId: string,
    imageBase64: string | undefined,
    userId: string,
  ) {
    try {
      const club = await this.clubRepository.findById(clubId);
      if (!club) throw new NotFoundException('Club no encontrado');

      // Permisos: creador o admin de la asignación
      const isCreator = club.created_by.toString() === userId;
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
          'No tienes permisos para actualizar el logo',
        );
      }

      // Si no viene imagen, solo limpiar el logo
      if (!imageBase64) {
        const updated = await this.clubRepository.update(clubId, {
          images: null,
        } as any);
        return updated;
      }

      // Procesar la imagen con image-processor
      const images = await this.processImageWithImageProcessor(imageBase64);

      // Actualizar club con las URLs devueltas
      const updated = await this.clubRepository.update(clubId, {
        images,
      } as any);

      return updated;
    } catch (error: any) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      const message = error?.message || 'Error desconocido';
      throw new ServiceUnavailableException(
        `Error al procesar logo: ${message}`,
      );
    }
  }

  /**
   * Procesa la imagen con el servicio image-processor
   */
  private async processImageWithImageProcessor(
    imageBase64: string,
  ): Promise<any> {
    const axios = require('axios');
    const imageProcessorApi = this.configService.get<string>(
      'IMAGE_PROCESSOR_API',
    );

    if (!imageProcessorApi) {
      throw new Error('IMAGE_PROCESSOR_API no configurada');
    }

    try {
      // Primero, procesa la imagen
      const processResponse = await axios.post(
        `${imageProcessorApi}/api/process`,
        {
          image: imageBase64,
        },
      );

      if (!processResponse.data || !processResponse.data.image) {
        throw new Error(
          'Respuesta inválida del procesador: ' +
            JSON.stringify(processResponse.data),
        );
      }

      // Luego, guarda las variantes (small, medium, large)
      const saveResponse = await axios.post(
        `${imageProcessorApi}/api/process/save`,
        {
          folder: 'clubs',
          image: processResponse.data.image,
        },
      );

      if (
        !saveResponse.data ||
        !saveResponse.data.images ||
        !saveResponse.data.images.small ||
        !saveResponse.data.images.medium ||
        !saveResponse.data.images.large
      ) {
        throw new Error(
          'Error al guardar variantes de imagen: ' +
            JSON.stringify(saveResponse.data),
        );
      }

      return saveResponse.data.images;
    } catch (error: any) {
      if (error?.response?.status) {
        throw new Error(
          `Image Processor error (${error.response.status}): ${
            error.response.data?.message || error.message
          }`,
        );
      } else if (error?.code === 'ECONNREFUSED') {
        throw new Error(
          `No se puede conectar a Image Processor en ${imageProcessorApi}. Verifique que el servicio esté corriendo.`,
        );
      } else {
        throw new Error(
          `Error al procesar imagen: ${error?.message || 'Error desconocido'}`,
        );
      }
    }
  }
}
