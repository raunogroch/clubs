import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { Assignment } from './schemas/assignment.schema';
import { CreateAssignmentDto, UpdateAssignmentDto } from './dto';
import { AssignmentRepository } from './repository/assignment.repository';

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
  constructor(private readonly assignmentRepository: AssignmentRepository) {}

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

    // Validar que al menos un admin esté asignado
    if (
      !createAssignmentDto.assigned_admins ||
      createAssignmentDto.assigned_admins.length === 0
    ) {
      throw new BadRequestException(
        'Debe asignar al menos un administrador al módulo',
      );
    }

    const assignment = await this.assignmentRepository.create({
      ...createAssignmentDto,
      assigned_by: superAdminId,
    });

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

    // Validar que si se actualizan los admins, haya al menos uno
    if (
      updateAssignmentDto.assigned_admins &&
      updateAssignmentDto.assigned_admins.length === 0
    ) {
      throw new BadRequestException(
        'Debe mantener al menos un administrador asignado al módulo',
      );
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
}
