/**
 * Controller para Clubs
 * Rutas HTTP para operaciones CRUD
 */

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ClubsService } from './clubs.service';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { CreateClubLevelDto, UpdateClubLevelDto } from './dto/club-level.dto';

@Controller('clubs')
@UseGuards(JwtAuthGuard)
export class ClubsController {
  constructor(private clubsService: ClubsService) {}

  /**
   * POST /clubs
   * Crear un nuevo club
   * Solo administradores de la asignación
   */
  @Post()
  async createClub(
    @Body() createClubDto: CreateClubDto,
    @CurrentUser() user: any,
  ) {
    return this.clubsService.createClub(createClubDto, user.sub);
  }

  /**
   * POST /clubs/:clubId/levels
   * Agregar un nivel al club
   */
  @Post(':clubId/levels')
  async addLevel(
    @Param('clubId') clubId: string,
    @Body() createClubLevelDto: CreateClubLevelDto,
    @CurrentUser() user: any,
  ) {
    return this.clubsService.addLevelToClub(
      clubId,
      user.sub,
      createClubLevelDto,
    );
  }

  /**
   * PATCH /clubs/:clubId/levels/:levelId
   * Actualizar un nivel del club
   */
  @Patch(':clubId/levels/:levelId')
  async updateLevel(
    @Param('clubId') clubId: string,
    @Param('levelId') levelId: string,
    @Body() updateClubLevelDto: UpdateClubLevelDto,
    @CurrentUser() user: any,
  ) {
    return this.clubsService.updateLevelInClub(
      clubId,
      levelId,
      user.sub,
      updateClubLevelDto,
    );
  }

  /**
   * DELETE /clubs/:clubId/levels/:levelId
   */
  @Delete(':clubId/levels/:levelId')
  async deleteLevel(
    @Param('clubId') clubId: string,
    @Param('levelId') levelId: string,
    @CurrentUser() user: any,
  ) {
    return this.clubsService.deleteLevelFromClub(clubId, levelId, user.sub);
  }

  /**
   * GET /clubs/view-dashboard
   * Obtener datos del dashboard con clubs, deportes y miembros
   * IMPORTANTE: Esta ruta debe ir ANTES de @Get(':clubId')
   */
  @Get('view-dashboard')
  async getDashboardData(@CurrentUser() user: any) {
    return this.clubsService.getDashboardData(user.sub);
  }

  /**
   * GET /clubs/assistants
   * Obtener todos los asistentes que están registrados en los clubs de las
   * asignaciones administradas por el usuario actual. Cada objeto trae los
   * clubes asociados para facilitar la visualización en el frontend.
   * IMPORTANTE: Esta ruta debe ir ANTES de @Get(':clubId')
   */
  @Get('assistants')
  async getAssistants(@CurrentUser() user: any) {
    return this.clubsService.getAssistantsForAdmin(user.sub);
  }

  /**
   * GET /clubs
   * Obtener todos los clubs del usuario (de sus asignaciones)
   */
  @Get()
  async getMyClubs(@CurrentUser() user: any) {
    return this.clubsService.getMyClubs(user.sub);
  }

  /**
   * GET /clubs/:clubId
   * Obtener un club específico
   */
  @Get(':clubId')
  async getClub(@Param('clubId') clubId: string, @CurrentUser() user: any) {
    return this.clubsService.getClub(clubId, user.sub);
  }

  /**
   * PATCH /clubs/:clubId
   * Actualizar un club
   */
  @Patch(':clubId')
  async updateClub(
    @Param('clubId') clubId: string,
    @Body() updateClubDto: UpdateClubDto,
    @CurrentUser() user: any,
  ) {
    return this.clubsService.updateClub(clubId, updateClubDto, user.sub);
  }

  /**
   * PATCH /clubs/:clubId/logo
   * Actualizar logo del club (imagen en base64)
   */
  @Patch(':clubId/logo')
  async updateLogo(
    @Param('clubId') clubId: string,
    @Body() body: any,
    @CurrentUser() user: any,
  ) {
    // body: { image: string }
    return this.clubsService.updateClubLogo(clubId, body.image, user.sub);
  }

  /**
   * POST /clubs/:clubId/assistants
   * Asignar un assistant al club
   */
  @Post(':clubId/assistants')
  async addAssistant(
    @Param('clubId') clubId: string,
    @Body('assistantId') assistantId: string,
    @CurrentUser() user: any,
  ) {
    return this.clubsService.addAssistantToClub(clubId, user.sub, assistantId);
  }

  /**
   * DELETE /clubs/:clubId/assistants/:assistantId
   * Remover un assistant del club
   */
  @Delete(':clubId/assistants/:assistantId')
  async removeAssistant(
    @Param('clubId') clubId: string,
    @Param('assistantId') assistantId: string,
    @CurrentUser() user: any,
  ) {
    return this.clubsService.removeAssistantFromClub(
      clubId,
      user.sub,
      assistantId,
    );
  }

  /**
   * DELETE /clubs/:clubId
   * Eliminar un club
   */
  @Delete(':clubId')
  async deleteClub(@Param('clubId') clubId: string, @CurrentUser() user: any) {
    return this.clubsService.deleteClub(clubId, user.sub);
  }
}
