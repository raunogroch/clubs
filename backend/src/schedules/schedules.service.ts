// Servicio para la gestión de horarios
import { Injectable } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { Schedule } from './schema/schedule.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class SchedulesService {
  // Constructor con inyección del modelo Schedule
  constructor(
    @InjectModel(Schedule.name) private scheduleModel: Model<Schedule>,
  ) {}

  /**
   * Crea un nuevo horario si no existe uno igual
   */
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

  /**
   * Obtiene todos los horarios
   */
  findAll() {
    return this.scheduleModel.find();
  }

  /**
   * Busca un horario por su ID
   */
  findOne(id: string) {
    return this.scheduleModel.findById(id);
  }

  /**
   * Actualiza los datos de un horario
   */
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

  /**
   * Elimina un horario por su ID
   */
  async remove(id: string) {
    const scheduleExists = await this.scheduleModel.findById(id);
    if (!scheduleExists) {
      throw new Error(`Schedule with id ${id} does not exist`);
    }

    return scheduleExists.deleteOne();
  }
}
