import { Injectable, NotFoundException } from '@nestjs/common';
import { PaymentsRepository } from './payments.repository';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { RegistrationsRepository } from '../registrations/registrations.repository';

@Injectable()
export class PaymentsService {
  constructor(
    private paymentsRepository: PaymentsRepository,
    private registrationsRepository: RegistrationsRepository,
  ) {}

  private calculatePaymentMonths(
    registrationDate: Date,
    paymentStartDate?: Date,
  ): { start: Date; end: Date } {
    const baseDate = paymentStartDate || registrationDate;
    const startOfMonth = new Date(
      baseDate.getFullYear(),
      baseDate.getMonth(),
      1,
    );
    const endOfMonth = new Date(
      baseDate.getFullYear(),
      baseDate.getMonth() + 1,
      0,
      23,
      59,
      59,
    );
    return { start: startOfMonth, end: endOfMonth };
  }

  async create(createDto: CreatePaymentDto) {
    let paymentStart = createDto.payment_start
      ? new Date(createDto.payment_start)
      : undefined;
    let paymentEnd = createDto.payment_end
      ? new Date(createDto.payment_end)
      : undefined;

    // Si no se proporcionan payment_start y payment_end, calcularlos desde registration_date
    if (!paymentStart || !paymentEnd) {
      try {
        const reg = await this.registrationsRepository.findByGroupAndAthlete(
          createDto.group_id,
          createDto.athlete_id,
        );
        if (reg && (reg as any).registration_date) {
          const months = this.calculatePaymentMonths(
            (reg as any).registration_date,
            paymentStart,
          );
          paymentStart = paymentStart || months.start;
          paymentEnd = paymentEnd || months.end;
        }
      } catch (e) {
        console.error('Error obteniendo registration_date:', e);
      }
    }

    const payment = await this.paymentsRepository.create({
      amount: createDto.amount,
      group_id: createDto.group_id,
      athlete_id: createDto.athlete_id,
      payment_date: createDto.payment_date
        ? new Date(createDto.payment_date)
        : new Date(),
      payment_start: paymentStart,
      payment_end: paymentEnd,
    } as any);

    // Asociar el id del payment a la registration correspondiente (group + athlete)
    try {
      const reg = await this.registrationsRepository.findByGroupAndAthlete(
        createDto.group_id,
        createDto.athlete_id,
      );
      if (reg) {
        const current = (reg as any).monthly_payments || [];
        const already = current.find(
          (id: any) => id?.toString() === payment._id.toString(),
        );
        if (!already) {
          current.push(payment._id);
          await this.registrationsRepository.update((reg as any)._id, {
            monthly_payments: current,
          } as any);
        }
      }
    } catch (e) {
      // no bloquear creación de pago si ocurre error al asociar
      console.error('Error asociando payment a registration:', e);
    }

    return payment;
  }

  async findById(id: string) {
    const p = await this.paymentsRepository.findById(id);
    if (!p) throw new NotFoundException(`Payment ${id} not found`);
    return p;
  }

  async findByAthlete(athleteId: string) {
    return this.paymentsRepository.findByAthlete(athleteId);
  }

  async findByGroup(groupId: string) {
    return this.paymentsRepository.findByGroup(groupId);
  }

  async update(id: string, dto: UpdatePaymentDto) {
    return this.paymentsRepository.update(id, dto as any);
  }

  async delete(id: string) {
    return this.paymentsRepository.delete(id);
  }
}
