// Implementación de la interfaz de repositorio usando Mongoose
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Schedule } from '../schema/schedule.schema';
import { IScheduleRepository } from './schedule.repository.interface';
import { CreateScheduleDto } from '../dto/create-schedule.dto';
import { UpdateScheduleDto } from '../dto/update-schedule.dto';

@Injectable()
export class ScheduleRepository implements IScheduleRepository {
  constructor(
    @InjectModel(Schedule.name) private scheduleModel: Model<Schedule>,
  ) {}

  async findOneByTime(
    startTime: Date,
    endTime: Date,
  ): Promise<Schedule | null> {
    return this.scheduleModel.findOne({ startTime, endTime });
  }

  async create(createScheduleDto: CreateScheduleDto): Promise<Schedule> {
    return this.scheduleModel.create(createScheduleDto);
  }

  async findAll(): Promise<Schedule[]> {
    return await this.scheduleModel.find();
  }

  async findById(id: string): Promise<Schedule | null> {
    return this.scheduleModel.findById(id);
  }

  async updateById(
    id: string,
    updateScheduleDto: UpdateScheduleDto,
  ): Promise<Schedule | null> {
    return this.scheduleModel.findByIdAndUpdate(id, updateScheduleDto, {
      new: true,
    });
  }

  async deleteById(id: string): Promise<Schedule | null> {
    return this.scheduleModel.findByIdAndDelete(id);
  }
}
