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
 * Controlador CRUD para ADMINS (Administradores)
 * Rutas: /admins
 */
@Controller('admins')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminsController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Crear un nuevo administrador
   * POST /admins
   * Solo SUPERADMIN
   * Body debe incluir: role = "admin"
   */
  @Post()
  @Roles(Role.SUPERADMIN)
  async create(@Body() createUserDto: CreateUserDto) {
    if (createUserDto.role !== Role.ADMIN) {
      throw new Error(
        `Invalid role. Expected 'admin' but got '${createUserDto.role}'`,
      );
    }
    return this.usersService.create(createUserDto);
  }

  /**
   * Obtener todos los administradores
   * GET /admins?page=1&limit=10&name=search
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
      Role.ADMIN,
    );
  }

  /**
   * Obtener un administrador por ID
   * GET /admins/:id
   */
  @Get(':id')
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  /**
   * Actualizar un administrador
   * PATCH /admins/:id
   * Solo SUPERADMIN (o el admin a sí mismo)
   */
  @Patch(':id')
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * Eliminar un administrador (soft delete)
   * PATCH /admins/:id/remove
   * Solo SUPERADMIN
   */
  @Patch(':id/remove')
  @Roles(Role.SUPERADMIN)
  async softRemove(@Param('id') id: string) {
    return this.usersService.softRemove(id);
  }

  /**
   * Restaurar un administrador (reactivar)
   * PATCH /admins/:id/restore
   * Solo SUPERADMIN
   */
  @Patch(':id/restore')
  @Roles(Role.SUPERADMIN)
  async restore(@Param('id') id: string) {
    return this.usersService.restore(id);
  }

  /**
   * Obtener perfil de un administrador
   * GET /admins/:id/profile
   */
  @Get(':id/profile')
  async profile(@Param('id') id: string) {
    return this.usersService.profile(id);
  }

  /**
   * Eliminar un administrador permanentemente
   * DELETE /admins/:id
   * Solo SUPERADMIN
   */
  @Delete(':id')
  @Roles(Role.SUPERADMIN)
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
