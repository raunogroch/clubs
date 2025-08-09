import { Injectable } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { Schedule } from './schema/schedule.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectModel(Schedule.name) private scheduleModel: Model<Schedule>,
  ) {}

  async create(createScheduleDto: CreateScheduleDto): Promise<Schedule> {
    const schedule = await this.scheduleModel.findOne({
      startTime: createScheduleDto.startTime,
      endTime: createScheduleDto.endTime,
    });
    if (schedule) {
      throw new Error('Schedule with the same time already exists');
    }
    return await this.scheduleModel.create(createScheduleDto);
  }

  findAll() {
    return this.scheduleModel.find();
  }

  findOne(id: string) {
    return this.scheduleModel.findById(id);
  }

  async update(id: string, updateScheduleDto: UpdateScheduleDto) {
    const scheduleExists = await this.scheduleModel.findById(id);
    if (!scheduleExists) {
      throw new Error(`Schedule with id ${id} does not exist`);
    }
    const schedule = await this.scheduleModel.findOne({
      startTime: updateScheduleDto.startTime,
      endTime: updateScheduleDto.endTime,
    });
    if (schedule) {
      throw new Error('Schedule with the same time already exists');
    }
    return await this.scheduleModel.findByIdAndUpdate(id, updateScheduleDto, {
      new: true,
    });
  }

  async remove(id: string) {
    const scheduleExists = await this.scheduleModel.findById(id);
    if (!scheduleExists) {
      throw new Error(`Schedule with id ${id} does not exist`);
    }

    return scheduleExists.deleteOne();
  }
}
