/**
 * Controlador de Eventos
 * Maneja los endpoints para gestión de eventos
 */

import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { EventsService } from './events.service';
import { CreateEventDto, UpdateEventDto } from '../dto/event.dto';

@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  /**
   * POST /events
   * Crear un nuevo evento
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  /**
   * GET /events/group/:groupId/range
   * Obtener eventos en rango de fechas
   * Query params: startDate (YYYY-MM-DD), endDate (YYYY-MM-DD)
   */
  @Get('group/:groupId/range')
  async findByDateRange(
    @Param('groupId') groupId: string,
    @Body('startDate') startDate?: string,
    @Body('endDate') endDate?: string,
  ) {
    if (!startDate || !endDate) {
      throw new BadRequestException('startDate y endDate son requeridos');
    }
    return this.eventsService.findByDateRange(groupId, startDate, endDate);
  }

  /**
   * GET /events/group/:groupId
   * Obtener todos los eventos de un grupo
   */
  @Get('group/:groupId')
  async findByGroupId(@Param('groupId') groupId: string) {
    return this.eventsService.findByGroupId(groupId);
  }

  /**
   * GET /events/:id
   * Obtener un evento por ID
   */
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.eventsService.findById(id);
  }

  /**
   * PATCH /events/:id
   * Actualizar un evento
   */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventsService.update(id, updateEventDto);
  }

  /**
   * DELETE /events/:id
   * Eliminar un evento
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.eventsService.delete(id);
  }
}
