import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ScheduleRepository } from '../repositories/schedule.repository';
import { GroupRepository } from '../repository/group.repository';
import { Schedule } from '../schemas/schedule.schema';
import { CreateScheduleDto, UpdateScheduleDto } from '../dto/schedule.dto';

@Injectable()
export class ScheduleService {
  private readonly VALID_DAYS = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  constructor(
    private scheduleRepository: ScheduleRepository,
    private groupRepository: GroupRepository,
  ) {}

  /**
   * Crear nuevo schedule para un grupo
   */
  async create(
    groupId: string,
    createScheduleDto: CreateScheduleDto,
    userId: string,
  ): Promise<Schedule> {
    // Verificar que el grupo existe y el usuario tiene acceso
    const group = await this.groupRepository.findById(groupId);
    if (!group) {
      throw new NotFoundException(`Grupo con ID ${groupId} no encontrado`);
    }

    // Validar el horario
    this.validateSchedule(createScheduleDto);
    // Verificar que no exista otro schedule con el mismo día en el grupo
    const existing = await this.scheduleRepository.findByGroupId(groupId);
    if (existing.some((s) => s.day === createScheduleDto.day)) {
      throw new BadRequestException(
        `Ya existe un horario para el día ${createScheduleDto.day}`,
      );
    }

    const schedule = await this.scheduleRepository.create(
      groupId,
      createScheduleDto.day,
      createScheduleDto.startTime,
      createScheduleDto.endTime,
    );

    // Agregar el ID del schedule al grupo si no está ya
    if (!group.schedules_added) {
      group.schedules_added = [];
    }
    if (!group.schedules_added.includes(schedule._id)) {
      group.schedules_added.push(schedule._id);
      await group.save();
    }

    return schedule;
  }

  /**
   * Obtener schedule por ID
   */
  async findById(scheduleId: string): Promise<Schedule> {
    const schedule = await this.scheduleRepository.findById(scheduleId);
    if (!schedule) {
      throw new NotFoundException(
        `Schedule con ID ${scheduleId} no encontrado`,
      );
    }
    return schedule;
  }

  /**
   * Obtener todos los schedules de un grupo
   */
  async findByGroupId(groupId: string): Promise<Schedule[]> {
    // Verificar que el grupo existe
    const group = await this.groupRepository.findById(groupId);
    if (!group) {
      throw new NotFoundException(`Grupo con ID ${groupId} no encontrado`);
    }

    return this.scheduleRepository.findByGroupId(groupId);
  }

  /**
   * Actualizar schedule
   */
  async update(
    scheduleId: string,
    updateScheduleDto: UpdateScheduleDto,
    userId: string,
  ): Promise<Schedule> {
    const schedule = await this.scheduleRepository.findById(scheduleId);
    if (!schedule) {
      throw new NotFoundException(
        `Schedule con ID ${scheduleId} no encontrado`,
      );
    }

    // Validar si hay cambios
    if (Object.keys(updateScheduleDto).length === 0) {
      return schedule;
    }

    // Validar el horario actualizado
    const updatedSchedule = {
      day: updateScheduleDto.day || schedule.day,
      startTime: updateScheduleDto.startTime || schedule.startTime,
      endTime: updateScheduleDto.endTime || schedule.endTime,
    };
    this.validateSchedule(updatedSchedule);

    // Si se cambia el día, validar que no exista otro schedule en el mismo grupo con ese día
    if (updateScheduleDto.day && updateScheduleDto.day !== schedule.day) {
      const groupSchedules = await this.scheduleRepository.findByGroupId(
        schedule.group_id.toString(),
      );
      const conflict = groupSchedules.find(
        (s) =>
          s.day === updateScheduleDto.day && s._id.toString() !== scheduleId,
      );
      if (conflict) {
        throw new BadRequestException(
          `Ya existe un horario para el día ${updateScheduleDto.day}`,
        );
      }
    }

    const result = await this.scheduleRepository.update(
      scheduleId,
      updateScheduleDto,
    );
    if (!result) throw new NotFoundException('Schedule not found');
    return result;
  }

  /**
   * Eliminar schedule
   */
  async delete(scheduleId: string, userId: string): Promise<void> {
    const schedule = await this.scheduleRepository.findById(scheduleId);
    if (!schedule) {
      throw new NotFoundException(
        `Schedule con ID ${scheduleId} no encontrado`,
      );
    }

    // Remover el ID del schedule del grupo
    const group = await this.groupRepository.findById(
      schedule.group_id.toString(),
    );
    if (group && group.schedules_added) {
      group.schedules_added = group.schedules_added.filter(
        (id) => id.toString() !== scheduleId,
      );
      await group.save();
    }

    // Eliminar el schedule
    await this.scheduleRepository.delete(scheduleId);
  }

  /**
   * Eliminar todos los schedules de un grupo
   */
  async deleteByGroupId(groupId: string): Promise<void> {
    await this.scheduleRepository.deleteByGroupId(groupId);

    // Limpiar los IDs del grupo
    const group = await this.groupRepository.findById(groupId);
    if (group) {
      group.schedules_added = [];
      await group.save();
    }
  }

  /**
   * Reemplazar todos los schedules de un grupo (batch)
   */
  async replaceBatch(
    groupId: string,
    schedules: CreateScheduleDto[],
    userId: string,
  ): Promise<Schedule[]> {
    // Verificar que el grupo existe
    const group = await this.groupRepository.findById(groupId);
    if (!group) {
      throw new NotFoundException(`Grupo con ID ${groupId} no encontrado`);
    }

    // Validar formato y duplicados
    schedules.forEach((schedule) => this.validateSchedule(schedule));
    const days = schedules.map((s) => s.day);
    const uniqueDays = new Set(days);
    if (uniqueDays.size !== days.length) {
      throw new BadRequestException(
        'No se permiten días duplicados en la lista de schedules',
      );
    }

    // Eliminar los schedules antiguos
    await this.scheduleRepository.deleteByGroupId(groupId);

    // Crear los nuevos schedules
    const newSchedules: Schedule[] = [];
    const scheduleIds: any[] = [];

    for (const schedule of schedules) {
      const newSchedule = await this.scheduleRepository.create(
        groupId,
        schedule.day,
        schedule.startTime,
        schedule.endTime,
      );
      newSchedules.push(newSchedule);
      scheduleIds.push(newSchedule._id);
    }

    // Actualizar los IDs en el grupo
    group.schedules_added = scheduleIds;
    await group.save();

    return newSchedules;
  }

  /**
   * Validar un schedule
   */
  private validateSchedule(
    schedule: CreateScheduleDto | UpdateScheduleDto,
  ): void {
    if (schedule.day && !this.VALID_DAYS.includes(schedule.day)) {
      throw new BadRequestException(`Día inválido: ${schedule.day}`);
    }

    if (
      schedule.startTime &&
      schedule.endTime &&
      schedule.startTime >= schedule.endTime
    ) {
      throw new BadRequestException(
        'La hora de inicio debe ser menor a la hora de fin',
      );
    }
  }
}
