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
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from '../dto/create-group.dto';
import { UpdateGroupDto } from '../dto/update-group.dto';

@Controller('groups')
@UseGuards(JwtAuthGuard)
export class GroupsController {
  constructor(private groupsService: GroupsService) {}

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
  async getGroup(@Param('groupId') groupId: string, @CurrentUser() user: any) {
    return this.groupsService.getGroup(groupId, user.sub);
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
   * POST /groups/:groupId/members/:memberId
   * Añadir un miembro al grupo
   */
  @Post(':groupId/members/:memberId')
  async addMember(
    @Param('groupId') groupId: string,
    @Param('memberId') memberId: string,
    @CurrentUser() user: any,
  ) {
    return this.groupsService.addMember(groupId, memberId, user.sub);
  }

  /**
   * DELETE /groups/:groupId/members/:memberId
   * Remover un miembro del grupo
   */
  @Delete(':groupId/members/:memberId')
  async removeMember(
    @Param('groupId') groupId: string,
    @Param('memberId') memberId: string,
    @CurrentUser() user: any,
  ) {
    return this.groupsService.removeMember(groupId, memberId, user.sub);
  }
}
