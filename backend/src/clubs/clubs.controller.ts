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
import { CreateClubDto, UpdateClubDto } from './dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

// Controlador para la gestión de clubes
@Controller('clubs')
@UseGuards(JwtAuthGuard)
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
  async findAll() {
    return this.clubsService.findAll();
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
}
