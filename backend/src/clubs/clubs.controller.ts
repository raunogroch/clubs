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

  /**
   * POST /clubs/:clubId/members/:memberId
   * Añadir un miembro al club
   */
  @Post(':clubId/members/:memberId')
  async addMember(
    @Param('clubId') clubId: string,
    @Param('memberId') memberId: string,
    @CurrentUser() user: any,
  ) {
    return this.clubsService.addMember(clubId, user.sub, memberId);
  }

  /**
   * DELETE /clubs/:clubId/members/:memberId
   * Remover un miembro del club
   */
  @Delete(':clubId/members/:memberId')
  async removeMember(
    @Param('clubId') clubId: string,
    @Param('memberId') memberId: string,
    @CurrentUser() user: any,
  ) {
    return this.clubsService.removeMember(clubId, user.sub, memberId);
  }
}
