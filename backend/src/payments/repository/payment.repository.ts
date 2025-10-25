import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment } from '../schemas/payment.schema';

@Injectable()
export class PaymentRepository {
  constructor(
    @InjectModel(Payment.name) private readonly paymentModel: Model<Payment>,
  ) {}

  async create(payment: Partial<Payment>): Promise<Payment> {
    const created = new this.paymentModel(payment);
    return created.save();
  }

  async findById(id: string): Promise<Payment | null> {
    return this.paymentModel.findById(id);
  }

  async findAllByAthlete(athleteId: string): Promise<Payment[]> {
    return this.paymentModel.find({ athlete: athleteId });
  }

  async findByAthleteClubMonths(
    athleteId: string,
    clubId: string,
    months: string[],
  ): Promise<Payment[]> {
    if (!months || months.length === 0) return [];

    // Construir condiciones: buscar pagos donde month esté en la lista
    // o (si el campo month no existe) intentar casar por createdAt dentro del mes
    const orConditions: any[] = [];
    // condición directa: month in months
    orConditions.push({ month: { $in: months } });

    // fallback: pagos sin campo month pero con createdAt dentro del mes correspondiente
    months.forEach((ym) => {
      const [yStr, mStr] = ym.split('-');
      const y = Number(yStr);
      const m = Number(mStr) - 1; // 0-indexed month
      const start = new Date(y, m, 1);
      const end = new Date(y, m + 1, 1);
      orConditions.push({
        month: { $exists: false },
        createdAt: { $gte: start, $lt: end },
      });
    });

    return this.paymentModel.find({
      athlete: athleteId,
      club: clubId,
      $or: orConditions,
    });
  }
}
