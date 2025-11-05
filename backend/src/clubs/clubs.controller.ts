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
import { ClubsService } from './clubs.service';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Roles as Role } from 'src/users/enum/roles.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';

interface currentAuth {
  sub: string;
  role: string;
}

// Controlador para la gestión de clubes
@Controller('clubs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClubsController {
  constructor(private readonly clubsService: ClubsService) {}

  /**
   * Endpoint para crear un club
   */
  @Post()
  async create(@Body() createClubDto: CreateClubDto) {
    return this.clubsService.create(createClubDto);
  }

  /**
   * Endpoint para obtener todos los clubes
   */
  @Get()
  async findAll(@CurrentUser() user: currentAuth) {
    return this.clubsService.findAll(user);
  }

  /**
   * Endpoint para obtener un club por ID
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.clubsService.findOne(id);
  }

  /**
   * Endpoint para actualizar un club
   */
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateClubDto: UpdateClubDto) {
    return this.clubsService.update(id, updateClubDto);
  }

  /**
   * Endpoint para eliminar un club
   */
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.clubsService.remove(id);
  }

  /**
   * Asignar asistentes a un club (reemplaza la lista actual)
   */
  @Patch(':id/assign-assistants')
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  async assignAssistants(
    @Param('id') id: string,
    @Body() body: { assistants: string[] },
  ) {
    return this.clubsService.assignAssistants(id, body.assistants || []);
  }

  /**
   * Restaurar (reactivar) un club
   */
  @Patch(':id/restore')
  @Roles(Role.SUPERADMIN)
  async restore(@Param('id') id: string) {
    return this.clubsService.restore(id);
  }

  /**
   * Endpoint para desactivar un club (soft delete)
   */
  @Patch(':id/remove')
  @Roles(Role.SUPERADMIN)
  async softRemove(@Param('id') id: string) {
    return this.clubsService.softRemove(id);
  }
}
