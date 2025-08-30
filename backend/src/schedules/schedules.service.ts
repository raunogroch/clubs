// Servicio para la gestión de horarios
import { Injectable } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { Schedule } from './schema/schedule.schema';
import type { IScheduleRepository } from './repository/schedule.repository.interface';
import { ScheduleValidatorService } from './schedule-validator.service';

@Injectable()
export class SchedulesService {
  constructor(
    private readonly scheduleRepository: IScheduleRepository,
    private readonly scheduleValidator: ScheduleValidatorService,
  ) {}

  /**
   * Crea un nuevo horario si no existe uno igual
   * SRP: la validación se delega al validador
   */
  async create(createScheduleDto: CreateScheduleDto): Promise<Schedule> {
    const startTimeDate = new Date(createScheduleDto.startTime);
    const endTimeDate = new Date(createScheduleDto.endTime);
    await this.scheduleValidator.validateUniqueTime(startTimeDate, endTimeDate);
    return this.scheduleRepository.create(createScheduleDto);
  }

  /**
   * Obtiene todos los horarios
   */
  async findAll(): Promise<Schedule[]> {
    return this.scheduleRepository.findAll();
  }

  /**
   * Busca un horario por su ID
   */
  async findOne(id: string): Promise<Schedule | null> {
    return this.scheduleRepository.findById(id);
  }

  /**
   * Actualiza los datos de un horario
   * SRP: la validación se delega al validador
   */
  async update(
    id: string,
    updateScheduleDto: UpdateScheduleDto,
  ): Promise<Schedule | null> {
    await this.scheduleValidator.validateExistence(id);
    let startTimeDate: Date | undefined = undefined;
    let endTimeDate: Date | undefined = undefined;
    if (updateScheduleDto.startTime) {
      startTimeDate = new Date(updateScheduleDto.startTime);
    }
    if (updateScheduleDto.endTime) {
      endTimeDate = new Date(updateScheduleDto.endTime);
    }
    await this.scheduleValidator.validateUniqueTime(
      startTimeDate as Date,
      endTimeDate as Date,
    );
    return this.scheduleRepository.updateById(id, updateScheduleDto);
  }

  /**
   * Elimina un horario por su ID
   */
  async remove(id: string): Promise<Schedule | null> {
    await this.scheduleValidator.validateExistence(id);
    return this.scheduleRepository.deleteById(id);
  }
}
