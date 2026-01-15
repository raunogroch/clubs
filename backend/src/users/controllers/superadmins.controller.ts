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
 * Controlador CRUD para SUPERADMINS (Súper Administradores)
 * Rutas: /superadmins
 */
@Controller('superadmins')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SuperadminsController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Crear un nuevo súper administrador
   * POST /superadmins
   * Solo SUPERADMIN
   * Body debe incluir: role = "superadmin"
   */
  @Post()
  @Roles(Role.SUPERADMIN)
  async create(@Body() createUserDto: CreateUserDto) {
    if (createUserDto.role !== Role.SUPERADMIN) {
      throw new Error(
        `Invalid role. Expected 'superadmin' but got '${createUserDto.role}'`,
      );
    }
    return this.usersService.create(createUserDto);
  }

  /**
   * Obtener todos los súper administradores
   * GET /superadmins?page=1&limit=10&name=search
   * Solo SUPERADMIN
   */
  @Get()
  @Roles(Role.SUPERADMIN)
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
      Role.SUPERADMIN,
    );
  }

  /**
   * Obtener un súper administrador por ID
   * GET /superadmins/:id
   */
  @Get(':id')
  @Roles(Role.SUPERADMIN)
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  /**
   * Actualizar un súper administrador
   * PATCH /superadmins/:id
   * Solo SUPERADMIN (o el usuario a sí mismo)
   */
  @Patch(':id')
  @Roles(Role.SUPERADMIN)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * Eliminar un súper administrador (soft delete)
   * PATCH /superadmins/:id/remove
   * Solo SUPERADMIN (no puede auto-eliminarse)
   */
  @Patch(':id/remove')
  @Roles(Role.SUPERADMIN)
  async softRemove(@Param('id') id: string) {
    return this.usersService.softRemove(id);
  }

  /**
   * Restaurar un súper administrador (reactivar)
   * PATCH /superadmins/:id/restore
   * Solo SUPERADMIN
   */
  @Patch(':id/restore')
  @Roles(Role.SUPERADMIN)
  async restore(@Param('id') id: string) {
    return this.usersService.restore(id);
  }

  /**
   * Obtener perfil de un súper administrador
   * GET /superadmins/:id/profile
   */
  @Get(':id/profile')
  async profile(@Param('id') id: string) {
    return this.usersService.profile(id);
  }

  /**
   * Eliminar un súper administrador permanentemente
   * DELETE /superadmins/:id
   * Solo SUPERADMIN (no puede auto-eliminarse)
   */
  @Delete(':id')
  @Roles(Role.SUPERADMIN)
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
