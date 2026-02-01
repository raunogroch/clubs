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
      registration_pay: !!createDto.registration_pay,
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
    return this.registrationsRepository.update(id, payload as any);
  }

  async delete(id: string) {
    return this.registrationsRepository.delete(id);
  }

  async deleteByGroup(groupId: string) {
    return this.registrationsRepository.deleteByGroup(groupId);
  }
}
