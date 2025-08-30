// Interfaz para acceso a datos de Schedule
import { Schedule } from '../schema/schedule.schema';
import { CreateScheduleDto } from '../dto/create-schedule.dto';
import { UpdateScheduleDto } from '../dto/update-schedule.dto';

export interface IScheduleRepository {
  findOneByTime(startTime: Date, endTime: Date): Promise<Schedule | null>;
  create(createScheduleDto: CreateScheduleDto): Promise<Schedule>;
  findAll(): Promise<Schedule[]>;
  findById(id: string): Promise<Schedule | null>;
  updateById(
    id: string,
    updateScheduleDto: UpdateScheduleDto,
  ): Promise<Schedule | null>;
  deleteById(id: string): Promise<Schedule | null>;
}
