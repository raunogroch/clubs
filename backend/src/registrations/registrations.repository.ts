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
    const reg = new this.registrationModel({
      ...data,
      group_id: new Types.ObjectId((data as any).group_id),
      athlete_id: new Types.ObjectId((data as any).athlete_id),
      monthly_payments: (data as any).monthly_payments || [],
    });
    return reg.save();
  }

  async findById(id: string): Promise<Registration | null> {
    return this.registrationModel.findById(id).exec();
  }

  async findByGroup(groupId: string): Promise<Registration[]> {
    return (await this.registrationModel
      .find({ group_id: new Types.ObjectId(groupId) })
      .populate(
        'athlete_id',
        'name lastname ci role phone images createdAt birth_date gender username parent_id documentPath fileIdentifier',
      )
      .lean()
      .exec()) as any;
  }

  async findByGroups(groupIds: string[]): Promise<Registration[]> {
    const ids = groupIds.map((g) => new Types.ObjectId(g));
    return (await this.registrationModel
      .find({ group_id: { $in: ids } })
      .populate(
        'athlete_id',
        'name lastname ci role phone images createdAt birth_date gender username parent_id documentPath fileIdentifier',
      )
      .lean()
      .exec()) as any;
  }

  async findByGroupAndAthlete(
    groupId: string,
    athleteId: string,
  ): Promise<Registration | null> {
    return this.registrationModel
      .findOne({
        group_id: new Types.ObjectId(groupId),
        athlete_id: new Types.ObjectId(athleteId),
      })
      .exec();
  }

  async update(
    id: string,
    payload: Partial<Registration>,
  ): Promise<Registration | null> {
    return this.registrationModel
      .findByIdAndUpdate(id, payload, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Registration | null> {
    return this.registrationModel.findByIdAndDelete(id).exec();
  }
}
