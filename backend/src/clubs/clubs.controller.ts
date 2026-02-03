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
   * DELETE /clubs/:clubId
   * Eliminar un club
   */
  @Delete(':clubId')
  async deleteClub(@Param('clubId') clubId: string, @CurrentUser() user: any) {
    return this.clubsService.deleteClub(clubId, user.sub);
  }
}
