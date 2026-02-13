/**
 * UsersController - Controlador de Usuarios
 *
 * Responsabilidades:
 * - Manejar solicitudes HTTP para operaciones de usuarios
 * - Validar autenticación con JwtAuthGuard
 * - Validar autorización con RolesGuard
 * - Delegar lógica de negocio a UsersService
 *
 * Endpoints:
 * POST   /api/users              - Crear usuario
 * GET    /api/users              - Listar usuarios
 * GET    /api/users/:id          - Obtener usuario por ID
 * PATCH  /api/users/:id          - Actualizar usuario
 * DELETE /api/users/:id          - Eliminar usuario
 * GET    /api/users/:id/profile  - Obtener perfil del usuario
 * POST   /api/users/:id/restore  - Restaurar usuario eliminado
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
  Query,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Roles as Role } from 'src/users/enum/roles.enum';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

/**
 * Interfaz para el usuario autenticado extraído del JWT
 * Se obtiene del decorador @CurrentUser()
 */
interface currentAuth {
  sub: string; // ID del usuario (subject del JWT)
  role: string; // Rol del usuario
}

/**
 * Controlador principal para todas las operaciones con usuarios
 *
 * Guards:
 * - JwtAuthGuard: Valida que el cliente envíe un JWT válido
 * - RolesGuard: Valida que el usuario tenga el rol requerido
 */
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * POST /api/users/batch/by-ids
   * Obtener múltiples usuarios por sus IDs
   *
   * Roles permitidos: SUPERADMIN, ADMIN, ASSISTANT, COACH
   *
   * @param body - { ids: string[] } - Array de IDs de usuarios
   * @returns Array de usuarios
   */
  @Post('batch/by-ids')
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.ASSISTANT, Role.COACH)
  findByIds(@Body() body: { ids: string[] }) {
    return this.usersService.findByIds(body.ids);
  }

  /**
   * POST /api/users
   * Crear un nuevo usuario
   *
   * Roles permitidos: SUPERADMIN, ADMIN, ASSISTANT
   *
   * Validaciones:
   * - Campos requeridos según el rol
   * - Username único
   * - Contraseña mínimo 8 caracteres
   *
   * @param createUserDto - DTO con los datos del usuario a crear
   * @returns Usuario creado (sin contraseña)
   */
  @Post()
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.ASSISTANT)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /**
   * GET /api/users
   * Obtener lista de usuarios con filtros y paginación
   *
   * Roles permitidos: SUPERADMIN, ADMIN, ASSISTANT, COACH
   *
   * Filtrado automático según el rol:
   * - SUPERADMIN: Ve todos los usuarios
   * - ADMIN: Ve todos excepto SUPERADMIN
   * - ASSISTANT: Ve solo ATHLETE y PARENT
   * - COACH: Ve solo ATHLETE y PARENT
   *
   * @param user - Usuario autenticado (inyectado por @CurrentUser)
   * @param page - Número de página (default: 1)
   * @param limit - Usuarios por página (default: 0 = todos)
   * @param name - Filtrar por nombre (búsqueda por nombre o apellido)
   * @param role - Filtrar por rol específico
   * @returns Array de usuarios filtrados y paginados
   */
  @Get('coaches/from-groups')
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.ASSISTANT)
  async getCoachesFromGroups(@CurrentUser() user: currentAuth) {
    return this.usersService.getCoachesFromGroups(user);
  }

  @Get('athletes/from-groups')
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.ASSISTANT)
  async getAthletesFromGroups(@CurrentUser() user: currentAuth) {
    return this.usersService.getAthletesFromGroups(user);
  }

  @Get('athletes/unpaid/by-assignment')
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.ASSISTANT)
  async getUnpaidByAssignment(@CurrentUser() user: currentAuth) {
    return this.usersService.getUnpaidAthletesCountByAssignment(user);
  }

  @Get('athletes/breakdown/by-assignment')
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.ASSISTANT)
  async getAthletesBreakdownByAssignment(@CurrentUser() user: currentAuth) {
    return this.usersService.getAthletesBreakdownByAssignment(user);
  }

  @Get()
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.ASSISTANT, Role.COACH)
  findAll(
    @CurrentUser() user: currentAuth,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('name') name?: string,
    @Query('role') role?: string,
  ) {
    return this.usersService.findAll(
      user,
      Number(page),
      Number(limit),
      name,
      role,
    );
  }

  /**
   * Endpoint para obtener un usuario por ID
   */
  @Get(':id')
  @Roles(
    Role.SUPERADMIN,
    Role.ADMIN,
    Role.ASSISTANT,
    Role.COACH,
    Role.ATHLETE,
    Role.PARENT,
  )
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  /**
   * Endpoint para actualizar un usuario
   */
  @Patch(':id')
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.ASSISTANT)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * Endpoint para eliminar un usuario
   */
  @Delete(':id')
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
  /**
   * Endpoint para marcar un usuario como inactivo (soft delete)
   */
  @Patch(':id/remove')
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  softRemove(@Param('id') id: string) {
    return this.usersService.softRemove(id);
  }
  /**
   * Endpoint para restaurar (reactivar) un usuario
   */
  @Patch(':id/restore')
  @Roles(Role.SUPERADMIN)
  restore(@Param('id') id: string) {
    return this.usersService.restore(id);
  }
  /**
   * Endpoint para obtener el perfil de un usuario
   */
  @Get(':id/profile')
  profile(@Param('id') id: string) {
    return this.usersService.profile(id);
  }

  /**
   * Endpoint para buscar un usuario por CI con filtro de rol opcional
   * Query params:
   * - role: 'coach' | 'athlete' (opcional, por defecto busca cualquier rol)
   */
  @Get('search/by-ci/:ci')
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.ASSISTANT, Role.COACH)
  findByCi(@Param('ci') ci: string, @Query('role') role?: string) {
    return this.usersService.findByCiByRole(ci, role);
  }

  /**
   * Endpoint para cargar una imagen de usuario
   * Recibe imagen en base64 y la procesa con image-processor
   */
  @Post('upload-image')
  @HttpCode(200)
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.ASSISTANT, Role.COACH)
  async uploadImage(@Body() payload: any) {
    return this.usersService.uploadUserImage(payload);
  }

  /**
   * POST /api/users/upload-ci
   * Cargar PDF de Carnet de Identidad del atleta
   *
   * @param payload - { userId: string, pdfBase64: string, role: string }
   * @returns { message: string, code: number, data: { documentPath: string } }
   */
  @Post('upload-ci')
  @HttpCode(200)
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.ASSISTANT, Role.COACH, Role.ATHLETE)
  async uploadCI(@Body() payload: any) {
    return this.usersService.uploadAthleteCI(payload);
  }

  /**
   * POST /api/users/change-password
   * Cambiar la contraseña del usuario autenticado
   *
   * @param body - { currentPassword: string, newPassword: string }
   * @param currentUser - Usuario autenticado (del JWT)
   * @returns { message: string, code: number }
   */
  @Post('change-password')
  @HttpCode(200)
  async changePassword(
    @Body() body: { currentPassword: string; newPassword: string },
    @CurrentUser() currentUser: currentAuth,
  ) {
    return this.usersService.changePassword(
      currentUser.sub,
      body.currentPassword,
      body.newPassword,
    );
  }

  /**
   * POST /api/users/:id/reset-password
   * Resetear la contraseña de un usuario a su CI
   * Solo para ADMIN, SUPERADMIN o ASSISTANT
   *
   * @param id - ID del usuario a resetear la contraseña
   * @returns { message: string, code: number }
   */
  @Post(':id/reset-password')
  @HttpCode(200)
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.ASSISTANT)
  async resetPassword(@Param('id') id: string) {
    return this.usersService.resetPassword(id);
  }
}
