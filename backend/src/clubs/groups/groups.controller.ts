/**
 * Controller para Grupos
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
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from '../dto/create-group.dto';
import { UpdateGroupDto } from '../dto/update-group.dto';
import {
  CreateGroupLevelDto,
  UpdateGroupLevelDto,
} from '../dto/group-level.dto';

@Controller('groups')
@UseGuards(JwtAuthGuard)
export class GroupsController {
  constructor(private groupsService: GroupsService) {}

  /**
   * GET /groups/my-coach-groups
   * Obtener todos los grupos donde el usuario autenticado es coach
   */
  @Get('my-coach-groups')
  async getMyCoachGroups(@CurrentUser() user: any) {
    return this.groupsService.getMyCoachGroups(user.sub);
  }

  /**
   * GET /groups/admin/schedules
   * Obtener horarios de los grupos asignados al administrador
   * Endpoint optimizado solo para horarios
   */
  @Get('admin/schedules')
  async getAdminGroupsSchedules(@CurrentUser() user: any) {
    return this.groupsService.getAdminGroupsSchedules(user.sub);
  }

  /**
   * POST /groups
   * Crear un nuevo grupo
   * Solo administradores de la asignación del club
   */
  @Post()
  async createGroup(
    @Body() createGroupDto: CreateGroupDto,
    @CurrentUser() user: any,
  ) {
    return this.groupsService.createGroup(createGroupDto, user.sub);
  }

  /**
   * GET /groups/club/:clubId
   * Obtener todos los grupos de un club
   */
  @Get('club/:clubId')
  async getGroupsByClub(
    @Param('clubId') clubId: string,
    @CurrentUser() user: any,
  ) {
    return this.groupsService.getGroupsByClub(clubId, user.sub);
  }

  /**
   * GET /groups/:groupId
   * Obtener un grupo específico
   */
  @Get(':groupId')
  async getGroup(
    @Param('groupId') groupId: string,
    @CurrentUser() user: any,
    @Query('fields') fields?: string,
  ) {
    // fields query param: comma separated list of fields to return
    const parsedFields = fields
      ? fields
          .split(',')
          .map((f) => f.trim())
          .filter(Boolean)
      : undefined;

    // Ensure club_id is always requested because service verifies access
    const fieldsWithClub = parsedFields
      ? Array.from(new Set([...parsedFields, 'club_id']))
      : undefined;

    return this.groupsService.getGroup(groupId, user.sub, fieldsWithClub);
  }

  /**
   * PATCH /groups/:groupId
   * Actualizar un grupo
   */
  @Patch(':groupId')
  async updateGroup(
    @Param('groupId') groupId: string,
    @Body() updateGroupDto: UpdateGroupDto,
    @CurrentUser() user: any,
  ) {
    return this.groupsService.updateGroup(groupId, updateGroupDto, user.sub);
  }

  /**
   * DELETE /groups/:groupId
   * Eliminar un grupo
   */
  @Delete(':groupId')
  async deleteGroup(
    @Param('groupId') groupId: string,
    @CurrentUser() user: any,
  ) {
    return this.groupsService.deleteGroup(groupId, user.sub);
  }

  /**
   * POST /groups/:groupId/athletes/:athleteId
   * Añadir un atleta al grupo
   */
  @Post(':groupId/athletes/:athleteId')
  async addAthlete(
    @Param('groupId') groupId: string,
    @Param('athleteId') athleteId: string,
    @CurrentUser() user: any,
  ) {
    return this.groupsService.addAthlete(groupId, athleteId, user.sub);
  }

  /**
   * DELETE /groups/:groupId/athletes/:athleteId
   * Remover un atleta del grupo
   */
  @Delete(':groupId/athletes/:athleteId')
  async removeAthlete(
    @Param('groupId') groupId: string,
    @Param('athleteId') athleteId: string,
    @CurrentUser() user: any,
  ) {
    return this.groupsService.removeAthlete(groupId, athleteId, user.sub);
  }

  /**
   * POST /groups/:groupId/coaches/:coachId
   * Añadir un entrenador al grupo
   */
  @Post(':groupId/coaches/:coachId')
  async addCoach(
    @Param('groupId') groupId: string,
    @Param('coachId') coachId: string,
    @CurrentUser() user: any,
  ) {
    return this.groupsService.addCoach(groupId, coachId, user.sub);
  }

  /**
   * DELETE /groups/:groupId/coaches/:coachId
   * Remover un entrenador del grupo
   */
  @Delete(':groupId/coaches/:coachId')
  async removeCoach(
    @Param('groupId') groupId: string,
    @Param('coachId') coachId: string,
    @CurrentUser() user: any,
  ) {
    return this.groupsService.removeCoach(groupId, coachId, user.sub);
  }

  /**
   * POST /groups/:groupId/members/:memberId
   * Añadir un miembro al grupo (legacy)
   */
  @Post(':groupId/members/:memberId')
  async addMember(
    @Param('groupId') groupId: string,
    @Param('memberId') memberId: string,
    @CurrentUser() user: any,
    @Query('role') role?: string,
  ) {
    return this.groupsService.addMember(groupId, memberId, user.sub, role);
  }

  /**
   * DELETE /groups/:groupId/members/:memberId
   * Remover un miembro del grupo (legacy)
   */
  @Delete(':groupId/members/:memberId')
  async removeMember(
    @Param('groupId') groupId: string,
    @Param('memberId') memberId: string,
    @CurrentUser() user: any,
    @Query('role') role?: string,
  ) {
    return this.groupsService.removeMember(groupId, memberId, user.sub, role);
  }

  /**
   * POST /groups/:groupId/schedule
   * Agregar horario a un grupo
   */
  @Post(':groupId/schedule')
  async addSchedule(
    @Param('groupId') groupId: string,
    @Body()
    body: {
      day: string;
      startTime: string;
      endTime: string;
    },
    @CurrentUser() user: any,
  ) {
    return this.groupsService.addSchedule(
      groupId,
      body.day,
      body.startTime,
      body.endTime,
      user.sub,
    );
  }

  /**
   * DELETE /groups/:groupId/schedule/:index
   * Remover horario de un grupo
   */
  @Delete(':groupId/schedule/:index')
  async removeSchedule(
    @Param('groupId') groupId: string,
    @Param('index') index: string,
    @CurrentUser() user: any,
  ) {
    return this.groupsService.removeSchedule(
      groupId,
      parseInt(index),
      user.sub,
    );
  }

  /**
   * POST /groups/:groupId/schedule/batch
   * Actualizar múltiples horarios en una operación batch
   */
  @Post(':groupId/schedule/batch')
  async updateSchedulesBatch(
    @Param('groupId') groupId: string,
    @Body()
    body: {
      schedules: Array<{ day: string; startTime: string; endTime: string }>;
    },
    @CurrentUser() user: any,
  ) {
    return this.groupsService.updateSchedulesBatch(
      groupId,
      body.schedules,
      user.sub,
    );
  }

  /**
   * POST /groups/:groupId/levels
   * Agregar un nivel al grupo
   */
  @Post(':groupId/levels')
  async addLevel(
    @Param('groupId') groupId: string,
    @Body() createLevelDto: CreateGroupLevelDto,
    @CurrentUser() user: any,
  ) {
    return this.groupsService.addLevel(groupId, createLevelDto, user.sub);
  }

  /**
   * PATCH /groups/:groupId/levels/:levelId
   * Actualizar un nivel del grupo
   */
  @Patch(':groupId/levels/:levelId')
  async updateLevel(
    @Param('groupId') groupId: string,
    @Param('levelId') levelId: string,
    @Body() updateLevelDto: UpdateGroupLevelDto,
    @CurrentUser() user: any,
  ) {
    return this.groupsService.updateLevel(
      groupId,
      levelId,
      updateLevelDto,
      user.sub,
    );
  }

  /**
   * DELETE /groups/:groupId/levels/:levelId
   * Eliminar un nivel del grupo
   */
  @Delete(':groupId/levels/:levelId')
  async deleteLevel(
    @Param('groupId') groupId: string,
    @Param('levelId') levelId: string,
    @CurrentUser() user: any,
  ) {
    return this.groupsService.deleteLevel(groupId, levelId, user.sub);
  }
}
