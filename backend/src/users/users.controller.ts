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
  @Get(':id/clubs')
  @Roles(Role.ATHLETE)
  async getAthleteClubs(@Param('id') id: string) {
    return this.clubsService.findClubsByUserId(id);
  }

  /**
   * Endpoint para crear un usuario
   */
  @Post()
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /**
   * Endpoint para obtener todos los usuarios
   */
  @Get()
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.COACH)
  findAll(
    @CurrentUser() user: currentAuth,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('name') name?: string,
  ) {
    return this.usersService.findAll(user, Number(page), Number(limit), name);
  }

  /**
   * Endpoint para obtener un usuario por ID
   */
  @Get(':id')
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.COACH, Role.ATHLETE)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  /**
   * Endpoint para actualizar un usuario
   */
  @Patch(':id')
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * Endpoint para eliminar un usuario
   */
  @Delete(':id')
  @Roles(Role.SUPERADMIN)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
  /**
   * Endpoint para obtener el perfil de un usuario
   */
  @Get(':id/profile')
  @Roles(Role.SUPERADMIN)
  profile(@Param('id') id: string) {
    return this.usersService.profile(id);
  }
}
