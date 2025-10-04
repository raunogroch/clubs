import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

interface currentAuth {
  sub: string;
  role: string;
}
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Roles as Role } from 'src/users/enum/roles.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('clubs/:clubId/groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  create(
    @Param('clubId') clubId: string,
    @Body() createGroupDto: CreateGroupDto,
  ) {
    return this.groupsService.createForClub(clubId, createGroupDto);
  }

  @Get()
  findAll(@Param('clubId') clubId: string, @CurrentUser() user: currentAuth) {
    return this.groupsService.findByClub(clubId, user);
  }

  @Get(':id')
  findOne(@Param('clubId') clubId: string, @Param('id') id: string) {
    // Si necesitas buscar un grupo por club y id
    return this.groupsService.findOneByClub(clubId, id);
  }

  @Patch(':id')
  update(
    @Param('clubId') clubId: string,
    @Param('id') id: string,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    return this.groupsService.updateByClub(clubId, id, updateGroupDto);
  }

  @Delete(':id')
  remove(@Param('clubId') clubId: string, @Param('id') id: string) {
    return this.groupsService.removeByClub(clubId, id);
  }

  /**
   * Restaurar (reactivar) un grupo
   */
  @Patch(':id/restore')
  @Roles(Role.SUPERADMIN)
  restore(@Param('clubId') clubId: string, @Param('id') id: string) {
    return this.groupsService.restoreByClub(clubId, id);
  }
}
