import { Injectable, NotFoundException } from '@nestjs/common';
import { RegistrationsRepository } from './registrations.repository';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { UpdateRegistrationDto } from './dto/update-registration.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class RegistrationsService {
  constructor(
    private registrationsRepository: RegistrationsRepository,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async createRegistration(createDto: CreateRegistrationDto) {
    // validate user exists
    const athlete = await this.userModel.findById(createDto.athlete_id);
    if (!athlete) {
      throw new NotFoundException(
        `Usuario con ID ${createDto.athlete_id} no encontrado`,
      );
    }

    return this.registrationsRepository.create({
      group_id: createDto.group_id,
      athlete_id: createDto.athlete_id,
      registration_date: createDto.registration_date
        ? new Date(createDto.registration_date)
        : new Date(),
      registration_pay: createDto.registration_pay
        ? new Date(createDto.registration_pay)
        : null,
      monthly_payments: createDto.monthly_payments || [],
      assignment_id: createDto.assignment_id,
    } as any);
  }

  async findById(id: string) {
    return this.registrationsRepository.findById(id);
  }

  async findByGroup(groupId: string) {
    return this.registrationsRepository.findByGroup(groupId);
  }

  async findByGroups(groupIds: string[]) {
    return this.registrationsRepository.findByGroups(groupIds);
  }

  async findByAssignment(assignmentId: string) {
    return this.registrationsRepository.findByAssignment(assignmentId);
  }

  async findByGroupsAndAssignment(groupIds: string[], assignmentId: string) {
    return this.registrationsRepository.findByGroupsAndAssignment(
      groupIds,
      assignmentId,
    );
  }

  async findByGroupAndAthlete(groupId: string, athleteId: string) {
    return this.registrationsRepository.findByGroupAndAthlete(
      groupId,
      athleteId,
    );
  }

  async update(id: string, payload: UpdateRegistrationDto) {
    // Get current registration to validate
    const registration = await this.registrationsRepository.findById(id);
    if (!registration) {
      throw new NotFoundException(`Registro con ID ${id} no encontrado`);
    }

    // If trying to update registration_date and registration_pay is already set, throw error
    if (payload.registration_date && registration.registration_pay) {
      throw new Error(
        'No se puede modificar el fecha de registro cuando el pago ya ha sido registrado',
      );
    }

    // If updating registration_pay, set it to current date
    const updatePayload: any = { ...payload };
    if (
      payload.registration_pay !== undefined &&
      payload.registration_pay !== null
    ) {
      updatePayload.registration_pay = new Date();
    }

    // Si se actualiza registration_date, procesar correctamente evitando problemas de zona horaria
    if (
      payload.registration_date &&
      typeof payload.registration_date === 'string'
    ) {
      // Si viene en formato YYYY-MM-DD, crear fecha a las 12:00 UTC
      if (payload.registration_date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [year, month, day] = payload.registration_date
          .split('-')
          .map(Number);
        // Crear fecha a las 12:00 UTC (mediodía) para evitar offset de zona horaria
        updatePayload.registration_date = new Date(
          Date.UTC(year, month - 1, day, 12, 0, 0),
        );
      } else {
        // Si es ISO string, convertir a Date
        updatePayload.registration_date = new Date(payload.registration_date);
      }
    }

    return this.registrationsRepository.update(id, updatePayload);
  }

  async delete(id: string) {
    return this.registrationsRepository.delete(id);
  }

  async deleteByGroup(groupId: string) {
    return this.registrationsRepository.deleteByGroup(groupId);
  }
}
