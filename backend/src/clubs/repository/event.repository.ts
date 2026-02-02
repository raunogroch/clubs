/**
 * Repository para Events
 * Maneja las operaciones con la base de datos para eventos
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Event } from '../schemas/event.schema';
import { CreateEventDto, UpdateEventDto } from '../dto/event.dto';

@Injectable()
export class EventRepository {
  constructor(
    @InjectModel('Event') private readonly eventModel: Model<Event>,
  ) {}

  /**
   * Crear un nuevo evento
   */
  async create(createEventDto: CreateEventDto): Promise<Event> {
    const newEvent = new this.eventModel(createEventDto);
    return newEvent.save();
  }

  /**
   * Obtener un evento por ID
   */
  async findById(id: string): Promise<Event | null> {
    return this.eventModel.findById(new Types.ObjectId(id)).exec();
  }

  /**
   * Obtener todos los eventos de un grupo
   */
  async findByGroupId(groupId: string): Promise<Event[]> {
    return this.eventModel
      .find({ group_id: new Types.ObjectId(groupId) })
      .sort({ eventDate: -1 })
      .exec();
  }

  /**
   * Actualizar un evento
   */
  async update(
    id: string,
    updateEventDto: UpdateEventDto,
  ): Promise<Event | null> {
    return this.eventModel
      .findByIdAndUpdate(new Types.ObjectId(id), updateEventDto, { new: true })
      .exec();
  }

  /**
   * Eliminar un evento
   */
  async delete(id: string): Promise<Event | null> {
    return this.eventModel.findByIdAndDelete(new Types.ObjectId(id)).exec();
  }

  /**
   * Eliminar todos los eventos de un grupo
   */
  async deleteByGroupId(groupId: string): Promise<void> {
    await this.eventModel
      .deleteMany({ group_id: new Types.ObjectId(groupId) })
      .exec();
  }

  /**
   * Obtener eventos en rango de fechas
   */
  async findByDateRange(
    groupId: string,
    startDate: string,
    endDate: string,
  ): Promise<Event[]> {
    return this.eventModel
      .find({
        group_id: new Types.ObjectId(groupId),
        eventDate: {
          $gte: startDate,
          $lte: endDate,
        },
      })
      .sort({ eventDate: 1 })
      .exec();
  }
}
