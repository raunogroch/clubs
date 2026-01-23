import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { Assignment } from './schemas/assignment.schema';
import { CreateAssignmentDto, UpdateAssignmentDto } from './dto';
import { AssignmentRepository } from './repository/assignment.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';

/**
 * AssignmentsService - Servicio de Gestión de Asignaciones
 *
 * Responsabilidades principales:
 * - CRUD de asignaciones de módulos a administradores
 * - Validación de asignaciones
 * - Solo el superadmin puede acceder a este servicio
 * - Control de qué administradores pueden ver/usar qué módulos
 */
@Injectable()
export class AssignmentsService {
  constructor(
    private readonly assignmentRepository: AssignmentRepository,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  /**
   * Crear una nueva asignación de módulo
   * Solo accesible por superadmin
   * @param createAssignmentDto DTO con los datos de la asignación
   * @param superAdminId ID del superadmin que realiza la asignación
   * @returns Asignación creada
   */
  async create(
    createAssignmentDto: CreateAssignmentDto,
    superAdminId: string,
  ): Promise<Assignment> {
    // Verificar que el módulo no esté ya asignado
    const existingAssignment = await this.assignmentRepository.findByModuleName(
      createAssignmentDto.module_name,
    );

    if (existingAssignment) {
      throw new BadRequestException(
        `El módulo '${createAssignmentDto.module_name}' ya tiene una asignación existente`,
      );
    }

    const assignment = await this.assignmentRepository.create({
      ...createAssignmentDto,
      assigned_by: superAdminId,
    });

    // Agregar el ID del assignment a los usuarios asignados (si se proporcionan)
    if (
      createAssignmentDto.assigned_admins &&
      createAssignmentDto.assigned_admins.length > 0 &&
      assignment._id
    ) {
      await this.userModel.updateMany(
        { _id: { $in: createAssignmentDto.assigned_admins } },
        { assignment_id: assignment._id },
      );
    }

    return assignment;
  }

  /**
   * Obtener todas las asignaciones (solo superadmin)
   * @returns Array de todas las asignaciones
   */
  async findAll(): Promise<Assignment[]> {
    return this.assignmentRepository.findAll({ is_active: true });
  }

  /**
   * Obtener todas las asignaciones incluyendo inactivas (solo para superadmin)
   * @returns Array de todas las asignaciones
   */
  async findAllIncludeInactive(): Promise<Assignment[]> {
    return this.assignmentRepository.findAll();
  }

  /**
   * Obtener asignación por ID
   * @param id ID de la asignación
   * @returns Asignación
   */
  async findById(id: string): Promise<Assignment> {
    const assignment = await this.assignmentRepository.findById(id);

    if (!assignment) {
      throw new NotFoundException(`Asignación con ID '${id}' no encontrada`);
    }

    return assignment;
  }

  /**
   * Obtener asignación por nombre del módulo
   * @param moduleName Nombre del módulo
   * @returns Asignación
   */
  async findByModuleName(moduleName: string): Promise<Assignment> {
    const assignment =
      await this.assignmentRepository.findByModuleName(moduleName);

    if (!assignment) {
      throw new NotFoundException(
        `Asignación para el módulo '${moduleName}' no encontrada`,
      );
    }

    return assignment;
  }

  /**
   * Actualizar asignación por ID (solo superadmin)
   * @param id ID de la asignación
   * @param updateAssignmentDto DTO con los datos a actualizar
   * @returns Asignación actualizada
   */
  async update(
    id: string,
    updateAssignmentDto: UpdateAssignmentDto,
  ): Promise<Assignment | null> {
    const assignment = await this.assignmentRepository.findById(id);

    if (!assignment) {
      throw new NotFoundException(`Asignación con ID '${id}' no encontrada`);
    }

    // Si se intenta cambiar el nombre del módulo, verificar que no exista otro con ese nombre
    if (
      updateAssignmentDto.module_name &&
      updateAssignmentDto.module_name !== assignment.module_name
    ) {
      const existingAssignment =
        await this.assignmentRepository.findByModuleName(
          updateAssignmentDto.module_name,
        );

      if (existingAssignment) {
        throw new BadRequestException(
          `Ya existe una asignación para el módulo '${updateAssignmentDto.module_name}'`,
        );
      }
    }

    // Si se actualizan los admins asignados, actualizar también el campo assignment_id de los usuarios
    if (Array.isArray(updateAssignmentDto.assigned_admins)) {
      const oldAdmins = assignment.assigned_admins.map((a) => a.toString());
      const newAdmins = updateAssignmentDto.assigned_admins;

      // Admins que se removieron
      const removedAdmins = oldAdmins.filter((id) => !newAdmins.includes(id));
      // Admins que se agregaron
      const addedAdmins = newAdmins.filter((id) => !oldAdmins.includes(id));

      // Remover el ID del assignment de los admins removidos
      if (removedAdmins.length > 0) {
        await this.userModel.updateMany(
          { _id: { $in: removedAdmins } },
          { assignment_id: null },
        );
      }

      // Agregar el ID del assignment a los nuevos admins
      if (addedAdmins.length > 0) {
        await this.userModel.updateMany(
          { _id: { $in: addedAdmins } },
          { assignment_id: id },
        );
      }
    }

    const updatedAssignment = await this.assignmentRepository.update(
      id,
      updateAssignmentDto,
    );

    return updatedAssignment;
  }

  /**
   * Eliminar asignación por ID (solo superadmin)
   * @param id ID de la asignación
   * @returns Mensaje de éxito
   */
  async remove(id: string): Promise<{ message: string }> {
    const assignment = await this.assignmentRepository.findById(id);

    if (!assignment) {
      throw new NotFoundException(`Asignación con ID '${id}' no encontrada`);
    }

    // Remover el ID del assignment de todos los usuarios asignados
    if (assignment.assigned_admins && assignment.assigned_admins.length > 0) {
      await this.userModel.updateMany(
        { _id: { $in: assignment.assigned_admins } },
        { assignment_id: null },
      );
    }

    const deleted = await this.assignmentRepository.delete(id);

    if (!deleted) {
      throw new BadRequestException('No se pudo eliminar la asignación');
    }

    return { message: 'Asignación eliminada correctamente' };
  }

  /**
   * Obtener los módulos asignados a un administrador específico
   * @param adminId ID del administrador
   * @returns Array de módulos asignados
   */
  async getModulesByAdmin(adminId: string): Promise<string[]> {
    const assignments = await this.assignmentRepository.findAll({
      assigned_admins: adminId,
      is_active: true,
    });

    return assignments.map((a) => a.module_name);
  }

  /**
   * Verificar si un administrador tiene acceso a un módulo específico
   * @param adminId ID del administrador
   * @param moduleName Nombre del módulo
   * @returns true si tiene acceso, false en caso contrario
   */
  async hasAccessToModule(
    adminId: string,
    moduleName: string,
  ): Promise<boolean> {
    const assignment =
      await this.assignmentRepository.findByModuleName(moduleName);

    if (!assignment || !assignment.is_active) {
      return false;
    }

    return assignment.assigned_admins.some((id) => id.toString() === adminId);
  }

  /**
   * Verificar si un usuario es administrador de una asignación específica
   * @param userId ID del usuario
   * @param assignmentId ID de la asignación
   * @returns true si es administrador, false en caso contrario
   */
  async isUserAdminOfAssignment(
    userId: string,
    assignmentId: string,
  ): Promise<boolean> {
    const assignment = await this.assignmentRepository.findById(assignmentId);

    if (!assignment) {
      return false;
    }

    return assignment.assigned_admins.some((id) => id.toString() === userId);
  }

  /**
   * Obtener todas las asignaciones de un usuario
   * @param userId ID del usuario
   * @returns Array de asignaciones del usuario
   */
  async getUserAssignments(userId: string): Promise<Assignment[]> {
    return this.assignmentRepository.findAll({
      assigned_admins: userId,
      is_active: true,
    });
  }

  /**
   * Obtener todas las asignaciones del administrador autenticado
   * (alias para getUserAssignments)
   * @param adminId ID del administrador
   * @returns Array de asignaciones del administrador
   */
  async getAssignmentsByAdmin(adminId: string): Promise<Assignment[]> {
    return this.getUserAssignments(adminId);
  }

  /**
   * Agregar un club a una asignación
   * @param assignmentId ID de la asignación
   * @param clubId ID del club
   */
  async addClubToAssignment(
    assignmentId: string,
    clubId: string,
  ): Promise<void> {
    try {
      await this.assignmentRepository.addClubToAssignment(assignmentId, clubId);
    } catch (error) {
      console.error('Error al agregar club a asignación:', error);
    }
  }

  /**
   * Remover un club de una asignación
   * @param assignmentId ID de la asignación
   * @param clubId ID del club
   */
  async removeClubFromAssignment(
    assignmentId: string,
    clubId: string,
  ): Promise<void> {
    try {
      await this.assignmentRepository.removeClubFromAssignment(
        assignmentId,
        clubId,
      );
    } catch (error) {
      console.error('Error al remover club de asignación:', error);
    }
  }
}
