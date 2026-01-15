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
 * Controlador CRUD para ATHLETES (Atletas)
 * Rutas: /athletes
 */
@Controller('athletes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AthletesController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Crear un nuevo atleta
   * POST /athletes
   * Solo SUPERADMIN, ADMIN, ASSISTANT
   * Body debe incluir: role = "athlete"
   */
  @Post()
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.ASSISTANT)
  async create(@Body() createUserDto: CreateUserDto) {
    if (createUserDto.role !== Role.ATHLETE) {
      throw new Error(
        `Invalid role. Expected 'athlete' but got '${createUserDto.role}'`,
      );
    }
    return this.usersService.create(createUserDto);
  }

  /**
   * Obtener todos los atletas
   * GET /athletes?page=1&limit=10&name=search
   * Solo SUPERADMIN, ADMIN, ASSISTANT, COACH
   */
  @Get()
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.ASSISTANT, Role.COACH)
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
      Role.ATHLETE,
    );
  }

  /**
   * Obtener un atleta por ID
   * GET /athletes/:id
   */
  @Get(':id')
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.ASSISTANT, Role.COACH, Role.ATHLETE)
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  /**
   * Actualizar un atleta
   * PATCH /athletes/:id
   * Solo SUPERADMIN, ADMIN, ASSISTANT
   */
  @Patch(':id')
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.ASSISTANT)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * Eliminar un atleta (soft delete)
   * PATCH /athletes/:id/remove
   * Solo SUPERADMIN, ADMIN
   */
  @Patch(':id/remove')
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  async softRemove(@Param('id') id: string) {
    return this.usersService.softRemove(id);
  }

  /**
   * Restaurar un atleta (reactivar)
   * PATCH /athletes/:id/restore
   * Solo SUPERADMIN
   */
  @Patch(':id/restore')
  @Roles(Role.SUPERADMIN)
  async restore(@Param('id') id: string) {
    return this.usersService.restore(id);
  }

  /**
   * Obtener perfil de un atleta
   * GET /athletes/:id/profile
   */
  @Get(':id/profile')
  async profile(@Param('id') id: string) {
    return this.usersService.profile(id);
  }

  /**
   * Obtener clubes y grupos donde está inscrito el atleta
   * GET /athletes/:id/clubs-groups
   */
  @Get(':id/clubs-groups')
  async getClubsAndGroups(@Param('id') id: string) {
    return this.usersService.getClubsAndGroupsByUser(id);
  }

  /**
   * Eliminar un atleta permanentemente
   * DELETE /athletes/:id
   * Solo SUPERADMIN, ADMIN
   */
  @Delete(':id')
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
