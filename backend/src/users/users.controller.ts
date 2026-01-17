import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Query } from '@nestjs/common';
import { ClubsService } from 'src/clubs/clubs.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Roles as Role } from 'src/users/enum/roles.enum';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

interface currentAuth {
  sub: string;
  role: string;
}

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly clubsService: ClubsService,
  ) {}

  /**
   * Endpoint para obtener los clubes donde el usuario atleta está inscrito
   */
  @Get(':id/clubs-groups')
  async getClubsAndGroupsByUser(@Param('id') id: string) {
    return this.usersService.getClubsAndGroupsByUser(id);
  }

  /**
   * Endpoint para crear un usuario
   */
  @Post()
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.ASSISTANT)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /**
   * Endpoint para obtener todos los usuarios
   */
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
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.ASSISTANT, Role.COACH, Role.ATHLETE)
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
   * Endpoint para buscar un atleta por CI
   */
  @Get('search/by-ci/:ci')
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.ASSISTANT)
  findByCi(@Param('ci') ci: string) {
    return this.usersService.findByCi(ci);
  }
}
