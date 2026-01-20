/**
 * AssignmentsController - Controlador de Asignaciones
 *
 * Responsabilidades:
 * - Manejar solicitudes HTTP para operaciones de asignaciones
 * - Validar autenticación con JwtAuthGuard
 * - Validar autorización con RolesGuard (solo SUPERADMIN)
 * - Delegar lógica de negocio a AssignmentsService
 *
 * Endpoints:
 * POST   /api/assignments                        - Crear asignación (SUPERADMIN)
 * GET    /api/assignments                        - Listar asignaciones (SUPERADMIN)
 * GET    /api/assignments/:id                    - Obtener asignación por ID (SUPERADMIN)
 * GET    /api/assignments/module/:moduleName     - Obtener asignación por nombre del módulo (SUPERADMIN)
 * PATCH  /api/assignments/:id                    - Actualizar asignación (SUPERADMIN)
 * DELETE /api/assignments/:id                    - Eliminar asignación (SUPERADMIN)
 * GET    /api/assignments/admin/modules          - Obtener módulos asignados al admin actual (ADMIN)
 * GET    /api/assignments/admin/access/:moduleName - Verificar acceso a módulo (ADMIN)
 * GET    /api/assignments/admin/my-assignments   - Obtener asignaciones del admin actual (ADMIN)
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto, UpdateAssignmentDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Roles as Role } from '../users/enum/roles.enum';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

/**
 * Interfaz para el usuario autenticado extraído del JWT
 */
interface CurrentAuth {
  sub: string; // ID del usuario (subject del JWT)
  role: string; // Rol del usuario
}

/**
 * Controlador para todas las operaciones con asignaciones de módulos
 *
 * Guards:
 * - JwtAuthGuard: Valida que el cliente envíe un JWT válido
 * - RolesGuard: Valida que el usuario sea SUPERADMIN
 */
@Controller('assignments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  /**
   * POST /api/assignments
   * Crear una nueva asignación de módulo
   *
   * Roles permitidos: SUPERADMIN
   *
   * Validaciones:
   * - El módulo no debe tener una asignación existente
   * - Debe haber al menos un administrador asignado
   *
   * @param createAssignmentDto DTO con los datos de la asignación
   * @param currentUser Usuario autenticado (superadmin)
   * @returns Asignación creada
   */
  @Post()
  @Roles(Role.SUPERADMIN)
  async create(
    @Body() createAssignmentDto: CreateAssignmentDto,
    @CurrentUser() currentUser: CurrentAuth,
  ) {
    return this.assignmentsService.create(createAssignmentDto, currentUser.sub);
  }

  /**
   * GET /api/assignments/admin/modules
   * Obtener módulos asignados al administrador autenticado
   *
   * Roles permitidos: ADMIN
   *
   * @param currentUser Usuario autenticado (admin)
   * @returns Array de nombres de módulos asignados
   */
  @Get('admin/modules')
  @Roles(Role.ADMIN)
  async getMyModules(@CurrentUser() currentUser: CurrentAuth) {
    return this.assignmentsService.getModulesByAdmin(currentUser.sub);
  }

  /**
   * GET /api/assignments/admin/access/:moduleName
   * Verificar si el administrador autenticado tiene acceso a un módulo
   *
   * Roles permitidos: ADMIN
   *
   * @param moduleName Nombre del módulo
   * @param currentUser Usuario autenticado (admin)
   * @returns { hasAccess: boolean }
   */
  @Get('admin/access/:moduleName')
  @Roles(Role.ADMIN)
  async checkModuleAccess(
    @Param('moduleName') moduleName: string,
    @CurrentUser() currentUser: CurrentAuth,
  ) {
    const hasAccess = await this.assignmentsService.hasAccessToModule(
      currentUser.sub,
      moduleName,
    );

    return { module: moduleName, hasAccess };
  }

  /**
   * GET /api/assignments/admin/my-assignments
   * Obtener todas las asignaciones del administrador autenticado
   *
   * Roles permitidos: ADMIN
   *
   * @param currentUser Usuario autenticado (admin)
   * @returns Array de asignaciones donde el usuario es admin
   */
  @Get('admin/my-assignments')
  @Roles(Role.ADMIN)
  async getMyAssignments(@CurrentUser() currentUser: CurrentAuth) {
    return this.assignmentsService.getAssignmentsByAdmin(currentUser.sub);
  }

  /**
   * GET /api/assignments/module/:moduleName
   * Obtener asignación por nombre del módulo
   *
   * Roles permitidos: SUPERADMIN
   *
   * @param moduleName Nombre del módulo
   * @returns Asignación
   */
  @Get('module/:moduleName')
  @Roles(Role.SUPERADMIN)
  async findByModuleName(@Param('moduleName') moduleName: string) {
    return this.assignmentsService.findByModuleName(moduleName);
  }

  /**
   * GET /api/assignments
   * Obtener todas las asignaciones activas
   *
   * Roles permitidos: SUPERADMIN
   *
   * @returns Array de todas las asignaciones activas
   */
  @Get()
  @Roles(Role.SUPERADMIN)
  async findAll() {
    return this.assignmentsService.findAll();
  }

  /**
   * GET /api/assignments/:id
   * Obtener asignación por ID
   *
   * Roles permitidos: SUPERADMIN
   *
   * @param id ID de la asignación
   * @returns Asignación
   */
  @Get(':id')
  @Roles(Role.SUPERADMIN)
  async findById(@Param('id') id: string) {
    return this.assignmentsService.findById(id);
  }

  /**
   * PATCH /api/assignments/:id
   * Actualizar asignación por ID
   *
   * Roles permitidos: SUPERADMIN
   *
   * @param id ID de la asignación
   * @param updateAssignmentDto DTO con los datos a actualizar
   * @returns Asignación actualizada
   */
  @Patch(':id')
  @Roles(Role.SUPERADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateAssignmentDto: UpdateAssignmentDto,
  ) {
    return this.assignmentsService.update(id, updateAssignmentDto);
  }

  /**
   * DELETE /api/assignments/:id
   * Eliminar asignación por ID
   *
   * Roles permitidos: SUPERADMIN
   *
   * @param id ID de la asignación
   * @returns Mensaje de éxito
   */
  @Delete(':id')
  @Roles(Role.SUPERADMIN)
  async remove(@Param('id') id: string) {
    return this.assignmentsService.remove(id);
  }
}
