import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Schedule } from '../schemas/schedule.schema';

@Injectable()
export class ScheduleRepository {
  constructor(
    @InjectModel('Schedule') private scheduleModel: Model<Schedule>,
  ) {}

  /**
   * Crear nuevo schedule
   */
  async create(
    groupId: string,
    day: string,
    startTime: string,
    endTime: string,
  ): Promise<Schedule> {
    const schedule = new this.scheduleModel({
      group_id: new Types.ObjectId(groupId),
      day,
      startTime,
      endTime,
    });
    return schedule.save();
  }

  /**
   * Obtener schedule por ID
   */
  async findById(scheduleId: string): Promise<Schedule | null> {
    return this.scheduleModel.findById(scheduleId).exec();
  }

  /**
   * Obtener todos los schedules de un grupo
   */
  async findByGroupId(groupId: string): Promise<Schedule[]> {
    return this.scheduleModel
      .find({ group_id: new Types.ObjectId(groupId) })
      .sort({ day: 1, startTime: 1 })
      .exec();
  }

  /**
   * Actualizar schedule
   */
  async update(
    scheduleId: string,
    updates: {
      day?: string;
      startTime?: string;
      endTime?: string;
    },
  ): Promise<Schedule | null> {
    return this.scheduleModel
      .findByIdAndUpdate(scheduleId, updates, { new: true })
      .exec();
  }

  /**
   * Eliminar schedule
   */
  async delete(scheduleId: string): Promise<Schedule | null> {
    return this.scheduleModel.findByIdAndDelete(scheduleId).exec();
  }

  /**
   * Eliminar todos los schedules de un grupo
   */
  async deleteByGroupId(groupId: string): Promise<any> {
    return this.scheduleModel.deleteMany({
      group_id: new Types.ObjectId(groupId),
    });
  }

  /**
   * Obtener schedules poblados con información del grupo
   */
  async findByGroupIdPopulated(groupId: string): Promise<Schedule[]> {
    return this.scheduleModel
      .find({ group_id: new Types.ObjectId(groupId) })
      .populate('group_id')
      .sort({ day: 1, startTime: 1 })
      .exec();
  }
}
