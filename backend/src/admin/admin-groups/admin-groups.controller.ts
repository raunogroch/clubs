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
import { AdminGroupsService } from './admin-groups.service';
import { CreateAdminGroupDto } from './dto';
import { UpdateAdminGroupDto } from './dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Roles as Role } from 'src/users/enum/roles.enum';

@Controller('admin/groups')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPERADMIN)
export class AdminGroupsController {
  constructor(private readonly adminGroupsService: AdminGroupsService) {}

  @Post()
  create(@Body() createAdminGroupDto: CreateAdminGroupDto) {
    return this.adminGroupsService.create(createAdminGroupDto);
  }

  @Get()
  findAll() {
    return this.adminGroupsService.findAll();
  }

  @Get('all/including-deleted')
  findAllIncludeDeleted() {
    return this.adminGroupsService.findAllIncludeDeleted();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminGroupsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAdminGroupDto: UpdateAdminGroupDto,
  ) {
    return this.adminGroupsService.update(id, updateAdminGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminGroupsService.remove(id);
  }

  @Patch(':id/restore')
  restore(@Param('id') id: string) {
    return this.adminGroupsService.restore(id);
  }

  /**
   * Asignar administrador a un grupo
   */
  @Patch(':id/administrator')
  assignAdministrator(
    @Param('id') id: string,
    @Body() body: { administratorId: string },
  ) {
    return this.adminGroupsService.update(id, {
      administrator: body.administratorId,
    });
  }
}
