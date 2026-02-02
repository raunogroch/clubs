import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Payment } from './schemas/payment.schema';

@Injectable()
export class PaymentsRepository {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
  ) {}

  async create(data: Partial<Payment>): Promise<Payment> {
    const payload: any = {
      ...data,
      group_id: new Types.ObjectId((data as any).group_id),
      athlete_id: new Types.ObjectId((data as any).athlete_id),
      payment_date: data.payment_date
        ? new Date(data.payment_date)
        : new Date(),
    };
    const p = new this.paymentModel(payload);
    return p.save();
  }

  async findById(id: string): Promise<Payment | null> {
    return this.paymentModel.findById(id).exec();
  }

  async findByAthlete(athleteId: string): Promise<Payment[]> {
    return this.paymentModel
      .find({ athlete_id: new Types.ObjectId(athleteId) })
      .lean()
      .exec() as any;
  }

  async findByGroup(groupId: string): Promise<Payment[]> {
    return this.paymentModel
      .find({ group_id: new Types.ObjectId(groupId) })
      .lean()
      .exec() as any;
  }

  async update(id: string, payload: Partial<Payment>): Promise<Payment | null> {
    return this.paymentModel
      .findByIdAndUpdate(id, payload, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Payment | null> {
    return this.paymentModel.findByIdAndDelete(id).exec();
  }
}
