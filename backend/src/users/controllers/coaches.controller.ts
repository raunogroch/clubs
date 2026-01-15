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
} from '@nestjs/common';
import { UsersService } from '../users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Roles as Role } from '../enum/roles.enum';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

interface CurrentAuth {
  sub: string;
  role: string;
}

/**
 * Controlador CRUD para COACHES (Entrenadores)
 * Rutas: /coaches
 */
@Controller('coaches')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CoachesController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Crear un nuevo entrenador
   * POST /coaches
   * Solo SUPERADMIN, ADMIN
   * Body debe incluir: role = "coach"
   */
  @Post()
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  async create(@Body() createUserDto: CreateUserDto) {
    if (createUserDto.role !== Role.COACH) {
      throw new Error(
        `Invalid role. Expected 'coach' but got '${createUserDto.role}'`,
      );
    }
    return this.usersService.create(createUserDto);
  }

  /**
   * Obtener todos los entrenadores
   * GET /coaches?page=1&limit=10&name=search
   * Solo SUPERADMIN, ADMIN, ASSISTANT
   */
  @Get()
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.ASSISTANT)
  async findAll(
    @CurrentUser() user: CurrentAuth,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('name') name?: string,
  ) {
    return this.usersService.findAll(
      user,
      Number(page),
      Number(limit),
      name,
      Role.COACH,
    );
  }

  /**
   * Obtener un entrenador por ID
   * GET /coaches/:id
   */
  @Get(':id')
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.ASSISTANT, Role.COACH)
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  /**
   * Actualizar un entrenador
   * PATCH /coaches/:id
   * Solo SUPERADMIN, ADMIN (o el coach a sí mismo)
   */
  @Patch(':id')
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.COACH)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * Eliminar un entrenador (soft delete)
   * PATCH /coaches/:id/remove
   * Solo SUPERADMIN, ADMIN
   */
  @Patch(':id/remove')
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  async softRemove(@Param('id') id: string) {
    return this.usersService.softRemove(id);
  }

  /**
   * Restaurar un entrenador (reactivar)
   * PATCH /coaches/:id/restore
   * Solo SUPERADMIN, ADMIN
   */
  @Patch(':id/restore')
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  async restore(@Param('id') id: string) {
    return this.usersService.restore(id);
  }

  /**
   * Obtener perfil de un entrenador
   * GET /coaches/:id/profile
   */
  @Get(':id/profile')
  async profile(@Param('id') id: string) {
    return this.usersService.profile(id);
  }

  /**
   * Eliminar un entrenador permanentemente
   * DELETE /coaches/:id
   * Solo SUPERADMIN, ADMIN
   */
  @Delete(':id')
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
