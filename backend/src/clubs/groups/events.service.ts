/**
 * Servicio de Eventos
 * Maneja la lógica de negocio para eventos
 */

import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { EventRepository } from '../repository/event.repository';
import { CreateEventDto, UpdateEventDto } from '../dto/event.dto';
import { Event } from '../schemas/event.schema';
import { ClubRepository } from '../repository/club.repository';
import { Types } from 'mongoose';

@Injectable()
export class EventsService {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly clubRepository: ClubRepository,
  ) {}

  /**
   * Crear un nuevo evento
   */
  async create(createEventDto: CreateEventDto): Promise<Event> {
    // Validar que el club existe
    const club = await this.clubRepository.findById(createEventDto.club_id);
    if (!club) {
      throw new NotFoundException('Club no encontrado');
    }

    // Validar formato de fecha
    if (!/^\d{4}-\d{2}-\d{2}$/.test(createEventDto.eventDate)) {
      throw new BadRequestException('Fecha inválida. Use formato YYYY-MM-DD');
    }

    // Validar formato de hora
    if (!/^\d{2}:\d{2}$/.test(createEventDto.eventTime)) {
      throw new BadRequestException('Hora inválida. Use formato HH:mm');
    }

    // Validar duración
    if (!createEventDto.duration || createEventDto.duration <= 0) {
      throw new BadRequestException('La duración debe ser mayor a 0 minutos');
    }

    const event = await this.eventRepository.create(createEventDto);

    // Agregar evento a club.events_added
    if (!club.events_added) {
      club.events_added = [];
    }
    club.events_added.push(new Types.ObjectId(event._id));
    await club.save();

    return event;
  }

  /**
   * Obtener un evento por ID
   */
  async findById(id: string): Promise<Event> {
    const event = await this.eventRepository.findById(id);
    if (!event) {
      throw new NotFoundException('Evento no encontrado');
    }
    return event;
  }

  /**
   * Obtener todos los eventos de un grupo
   */
  async findByClubId(clubId: string): Promise<Event[]> {
    // Validar que el club existe
    const club = await this.clubRepository.findById(clubId);
    if (!club) {
      throw new NotFoundException('Club no encontrado');
    }

    return this.eventRepository.findByClubId(clubId);
  }

  /**
   * Actualizar un evento
   */
  async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    // Validar formato de fecha si se proporciona
    if (
      updateEventDto.eventDate &&
      !/^\d{4}-\d{2}-\d{2}$/.test(updateEventDto.eventDate)
    ) {
      throw new BadRequestException('Fecha inválida. Use formato YYYY-MM-DD');
    }

    // Validar formato de hora si se proporciona
    if (
      updateEventDto.eventTime &&
      !/^\d{2}:\d{2}$/.test(updateEventDto.eventTime)
    ) {
      throw new BadRequestException('Hora inválida. Use formato HH:mm');
    }

    // Validar duración si se proporciona
    if (updateEventDto.duration !== undefined && updateEventDto.duration <= 0) {
      throw new BadRequestException('La duración debe ser mayor a 0 minutos');
    }

    const event = await this.eventRepository.update(id, updateEventDto);
    if (!event) {
      throw new NotFoundException('Evento no encontrado');
    }

    return event;
  }

  /**
   * Eliminar un evento
   */
  async delete(id: string): Promise<void> {
    const event = await this.eventRepository.findById(id);
    if (!event) {
      throw new NotFoundException('Evento no encontrado');
    }

    // Remover evento de club.events_added
    const club = await this.clubRepository.findById(event.club_id.toString());
    if (club && club.events_added) {
      club.events_added = club.events_added.filter(
        (eventId) => eventId.toString() !== id,
      );
      await club.save();
    }

    await this.eventRepository.delete(id);
  }

  /**
   * Obtener eventos en rango de fechas para un club
   */
  async findByDateRange(
    clubId: string,
    startDate: string,
    endDate: string,
  ): Promise<Event[]> {
    // Validar que el club existe
    const club = await this.clubRepository.findById(clubId);
    if (!club) {
      throw new NotFoundException('Club no encontrado');
    }

    return this.eventRepository.findByDateRange(clubId, startDate, endDate);
  }
}
