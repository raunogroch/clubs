// Servicio para validaciones de Schedule
import { Injectable } from '@nestjs/common';
import type { IScheduleRepository } from './repository/schedule.repository.interface';
import { Inject } from '@nestjs/common';

@Injectable()
export class ScheduleValidatorService {
  constructor(
    @Inject('ScheduleRepository')
    private readonly scheduleRepository: IScheduleRepository,
  ) {}

  async validateUniqueTime(startTime: Date, endTime: Date): Promise<void> {
    const schedule = await this.scheduleRepository.findOneByTime(
      startTime,
      endTime,
    );
    if (schedule) {
      throw new Error('Schedule with the same time already exists');
    }
  }

  async validateExistence(id: string): Promise<void> {
    const schedule = await this.scheduleRepository.findById(id);
    if (!schedule) {
      throw new Error(`Schedule with id ${id} does not exist`);
    }
  }
}
