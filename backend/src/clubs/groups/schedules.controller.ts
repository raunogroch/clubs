import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { ScheduleService } from '../services/schedule.service';
import { CreateScheduleDto, UpdateScheduleDto } from '../dto/schedule.dto';

@Controller('groups/:groupId/schedules')
@UseGuards(JwtAuthGuard)
export class SchedulesController {
  constructor(private scheduleService: ScheduleService) {}

  /**
   * POST /groups/:groupId/schedules
   * Crear nuevo schedule para un grupo
   */
  @Post()
  async create(
    @Param('groupId') groupId: string,
    @Body() createScheduleDto: CreateScheduleDto,
    @CurrentUser() user: any,
  ) {
    return this.scheduleService.create(groupId, createScheduleDto, user.sub);
  }

  /**
   * GET /groups/:groupId/schedules
   * Obtener todos los schedules de un grupo
   */
  @Get()
  async findByGroupId(@Param('groupId') groupId: string) {
    return this.scheduleService.findByGroupId(groupId);
  }

  /**
   * GET /groups/:groupId/schedules/:scheduleId
   * Obtener un schedule específico
   */
  @Get(':scheduleId')
  async findById(@Param('scheduleId') scheduleId: string) {
    return this.scheduleService.findById(scheduleId);
  }

  /**
   * PATCH /groups/:groupId/schedules/:scheduleId
   * Actualizar un schedule
   */
  @Patch(':scheduleId')
  async update(
    @Param('scheduleId') scheduleId: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
    @CurrentUser() user: any,
  ) {
    return this.scheduleService.update(scheduleId, updateScheduleDto, user.sub);
  }

  /**
   * DELETE /groups/:groupId/schedules/:scheduleId
   * Eliminar un schedule
   */
  @Delete(':scheduleId')
  async delete(
    @Param('scheduleId') scheduleId: string,
    @CurrentUser() user: any,
  ) {
    await this.scheduleService.delete(scheduleId, user.sub);
    return { success: true };
  }

  /**
   * POST /groups/:groupId/schedules/batch
   * Reemplazar todos los schedules de un grupo (batch)
   */
  @Post('batch')
  async replaceBatch(
    @Param('groupId') groupId: string,
    @Body('schedules') schedules: CreateScheduleDto[],
    @CurrentUser() user: any,
  ) {
    if (!Array.isArray(schedules)) {
      throw new BadRequestException(
        'Se debe proporcionar un array de schedules',
      );
    }
    return this.scheduleService.replaceBatch(groupId, schedules, user.sub);
  }
}
