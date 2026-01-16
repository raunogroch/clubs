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
import { SportsService } from './sports.service';
import { CreateSportDto } from './dto/create-sport.dto';
import { UpdateSportDto } from './dto/update-sport.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Roles as Role } from 'src/users/enum/roles.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';

interface currentAuth {
  sub: string;
  role: string;
}

// Controlador para la gestión de deportes
@Controller('sports')
@UseGuards(JwtAuthGuard)
export class SportsController {
  constructor(private readonly sportsService: SportsService) {}

  /**
   * Endpoint para crear un deporte
   */
  @Post()
  create(
    @Body() createSportDto: CreateSportDto,
    @CurrentUser() user: currentAuth,
  ) {
    return this.sportsService.create(createSportDto, user);
  }

  /**
   * Endpoint para obtener todos los deportes
   */
  @Get()
  findAll(@CurrentUser() user: currentAuth) {
    return this.sportsService.findAll(user);
  }

  /**
   * Endpoint para obtener un deporte por ID
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sportsService.findOne(id);
  }

  /**
   * Endpoint para actualizar un deporte
   */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSportDto: UpdateSportDto,
    @CurrentUser() user: currentAuth,
  ) {
    return this.sportsService.update(id, updateSportDto, user);
  }

  /**
   * Endpoint para eliminar un deporte
   */
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: currentAuth) {
    return this.sportsService.remove(id, user);
  }

  /**
   * Restaurar (reactivar) un deporte
   */
  @Patch(':id/restore')
  @Roles(Role.SUPERADMIN)
  restore(@Param('id') id: string) {
    return this.sportsService.restore(id);
  }
}
