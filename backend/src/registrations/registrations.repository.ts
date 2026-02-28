import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Registration } from './schemas/registration.schema';

@Injectable()
export class RegistrationsRepository {
  constructor(
    @InjectModel(Registration.name)
    private registrationModel: Model<Registration>,
  ) {}

  async create(data: Partial<Registration>): Promise<Registration> {
    const payload: any = {
      ...data,
      group_id: new Types.ObjectId((data as any).group_id),
      athlete_id: new Types.ObjectId((data as any).athlete_id),
      monthly_payments: (data as any).monthly_payments || [],
    };
    if ((data as any).assignment_id) {
      payload.assignment_id = new Types.ObjectId((data as any).assignment_id);
    }
    const reg = new this.registrationModel(payload);
    return reg.save();
  }

  async deleteByGroup(groupId: string): Promise<number> {
    const res = await this.registrationModel.deleteMany({
      group_id: new Types.ObjectId(groupId),
    });
    return res.deletedCount || 0;
  }

  async findById(id: string): Promise<Registration | null> {
    return this.registrationModel.findById(id);
  }

  async findByGroup(groupId: string): Promise<Registration[]> {
    return (await this.registrationModel
      .find({ group_id: new Types.ObjectId(groupId) })
      .populate(
        'athlete_id',
        'name lastname ci role phone images createdAt birth_date gender username parent_id documentPath fileIdentifier',
      )
      .lean()) as any;
  }

  /**
   * Obtiene todas las inscripciones asociadas a un atleta específico
   */
  async findByAthlete(athleteId: string): Promise<Registration[]> {
    return (await this.registrationModel
      .find({ athlete_id: new Types.ObjectId(athleteId) })
      .populate(
        'athlete_id',
        'name lastname ci role phone images createdAt birth_date gender username parent_id documentPath fileIdentifier',
      )
      .populate({
        path: 'group_id',
        select: 'name club_id schedules_added',
        populate: { path: 'schedules_added', select: 'day startTime endTime' },
      })
      .lean()) as any;
  }

  /**
   * Obtiene inscripciones para varios atletas (útil para padres con múltiples hijos)
   */
  async findByAthletes(athleteIds: string[]): Promise<Registration[]> {
    const ids = athleteIds.map((id) => new Types.ObjectId(id));
    return (await this.registrationModel
      .find({ athlete_id: { $in: ids } })
      .populate(
        'athlete_id',
        'name lastname ci role phone images createdAt birth_date gender username parent_id documentPath fileIdentifier',
      )
      .populate({
        path: 'group_id',
        select: 'name club_id schedules_added',
        populate: { path: 'schedules_added', select: 'day startTime endTime' },
      })
      .lean()) as any;
  }

  async findByGroups(groupIds: string[]): Promise<Registration[]> {
    const ids = groupIds.map((g) => new Types.ObjectId(g));
    return (await this.registrationModel
      .find({ group_id: { $in: ids } })
      .populate(
        'athlete_id',
        'name lastname ci role phone images createdAt birth_date gender username parent_id documentPath fileIdentifier',
      )
      .lean()) as any;
  }

  async findByAssignment(assignmentId: string): Promise<Registration[]> {
    return (await this.registrationModel
      .find({ assignment_id: new Types.ObjectId(assignmentId) })
      .populate(
        'athlete_id',
        'name lastname ci role phone images createdAt birth_date gender username parent_id documentPath fileIdentifier',
      )
      .populate({
        path: 'group_id',
        select: 'name club_id',
        populate: {
          path: 'club_id',
          select: 'name',
        },
      })
      .lean()) as any;
  }

  async findByGroupsAndAssignment(
    groupIds: string[],
    assignmentId: string,
  ): Promise<Registration[]> {
    const ids = groupIds.map((g) => new Types.ObjectId(g));
    return (await this.registrationModel
      .find({
        group_id: { $in: ids },
        assignment_id: new Types.ObjectId(assignmentId),
      })
      .populate(
        'athlete_id',
        'name lastname ci role phone images createdAt birth_date gender username parent_id documentPath fileIdentifier',
      )
      .lean()) as any;
  }

  async findByGroupAndAthlete(
    groupId: string,
    athleteId: string,
  ): Promise<Registration | null> {
    return this.registrationModel.findOne({
      group_id: new Types.ObjectId(groupId),
      athlete_id: new Types.ObjectId(athleteId),
    });
  }

  async update(
    id: string,
    payload: Partial<Registration>,
  ): Promise<Registration | null> {
    return this.registrationModel.findByIdAndUpdate(id, payload, { new: true });
  }

  async delete(id: string): Promise<Registration | null> {
    return this.registrationModel.findByIdAndDelete(id);
  }

  async getPaidAthletesByGroup(groupId: string): Promise<any> {
    return (await this.registrationModel
      .find({
        group_id: new Types.ObjectId(groupId),
        registration_pay: { $ne: null },
      })
      .populate(
        'athlete_id',
        'name lastname ci role phone images createdAt birth_date gender username parent_id documentPath fileIdentifier',
      )
      .populate({
        path: 'monthly_payments',
        model: 'Payment',
        select: 'amount payment_date payment_start payment_end',
      })
      .lean()) as any;
  }
}
