// Interfaz para acceso a datos de Schedule
import { Schedule } from '../schema/schedule.schema';
import { CreateScheduleDto } from '../dto/create-schedule.dto';
import { UpdateScheduleDto } from '../dto/update-schedule.dto';

export interface IScheduleRepository {
  findOneByTime(startTime: Date, endTime: Date): Promise<Schedule | null>;
  create(createScheduleDto: CreateScheduleDto): Promise<Schedule>;
  findAllPaginated(skip: number, limit: number, name?: string): Promise<[Schedule[], number]>;
  findById(id: string): Promise<Schedule | null>;
  updateById(
    id: string,
    updateUserDto: UpdateScheduleDto,
  ): Promise<Schedule | null>;
  deleteById(id: string): Promise<Schedule | null>;
}
