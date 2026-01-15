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
 * Controlador CRUD para ASSISTANTS (Asistentes)
 * Rutas: /assistants
 */
@Controller('assistants')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AssistantsController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Crear un nuevo asistente
   * POST /assistants
   * Solo SUPERADMIN, ADMIN
   * Body debe incluir: role = "assistant"
   */
  @Post()
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  async create(@Body() createUserDto: CreateUserDto) {
    if (createUserDto.role !== Role.ASSISTANT) {
      throw new Error(
        `Invalid role. Expected 'assistant' but got '${createUserDto.role}'`,
      );
    }
    return this.usersService.create(createUserDto);
  }

  /**
   * Obtener todos los asistentes
   * GET /assistants?page=1&limit=10&name=search
   * Solo SUPERADMIN, ADMIN
   */
  @Get()
  @Roles(Role.SUPERADMIN, Role.ADMIN)
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
      Role.ASSISTANT,
    );
  }

  /**
   * Obtener un asistente por ID
   * GET /assistants/:id
   */
  @Get(':id')
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.ASSISTANT)
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  /**
   * Actualizar un asistente
   * PATCH /assistants/:id
   * Solo SUPERADMIN, ADMIN (o el asistente a sí mismo)
   */
  @Patch(':id')
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.ASSISTANT)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * Eliminar un asistente (soft delete)
   * PATCH /assistants/:id/remove
   * Solo SUPERADMIN, ADMIN
   */
  @Patch(':id/remove')
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  async softRemove(@Param('id') id: string) {
    return this.usersService.softRemove(id);
  }

  /**
   * Restaurar un asistente (reactivar)
   * PATCH /assistants/:id/restore
   * Solo SUPERADMIN, ADMIN
   */
  @Patch(':id/restore')
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  async restore(@Param('id') id: string) {
    return this.usersService.restore(id);
  }

  /**
   * Obtener perfil de un asistente
   * GET /assistants/:id/profile
   */
  @Get(':id/profile')
  async profile(@Param('id') id: string) {
    return this.usersService.profile(id);
  }

  /**
   * Eliminar un asistente permanentemente
   * DELETE /assistants/:id
   * Solo SUPERADMIN, ADMIN
   */
  @Delete(':id')
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
