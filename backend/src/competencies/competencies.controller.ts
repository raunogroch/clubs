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
import { CompetenciesService } from './competencies.service';
import { CreateCompetencyDto } from './dto/create-competency.dto';
import { UpdateCompetencyDto } from './dto/update-competency.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

// Controlador para la gestión de competencias deportivas
@Controller('competencies')
@UseGuards(JwtAuthGuard)
export class CompetenciesController {
  constructor(private readonly competenciesService: CompetenciesService) {}

  /**
   * Endpoint para crear una competencia
   */
  @Post()
  create(@Body() createCompetencyDto: CreateCompetencyDto) {
    return this.competenciesService.create(createCompetencyDto);
  }

  /**
   * Endpoint para obtener todas las competencias
   */
  @Get()
  findAll() {
    return this.competenciesService.findAll();
  }

  /**
   * Endpoint para obtener una competencia por ID
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.competenciesService.findOne(id);
  }

  /**
   * Endpoint para actualizar una competencia
   */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCompetencyDto: UpdateCompetencyDto,
  ) {
    return this.competenciesService.update(id, updateCompetencyDto);
  }

  /**
   * Endpoint para eliminar una competencia
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.competenciesService.remove(id);
  }
}
