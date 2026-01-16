import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Payment } from './schemas/payment.schema';
import { PaymentRepository } from './repository/payment.repository';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Club } from 'src/clubs/schema/club.schema';
import { Roles } from 'src/users/enum/roles.enum';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    @InjectModel(Club.name) private readonly clubModel: Model<Club>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  /**
   * Obtener el groupId del admin desde AdminGroup
   */
  private async getAdminGroup(userId: string): Promise<Types.ObjectId | null> {
    try {
      const adminGroupModel =
        this.userModel.collection.conn.model('AdminGroup');
      const adminGroup = await adminGroupModel.findOne({
        administrator: userId,
      });
      return adminGroup?._id || null;
    } catch (error) {
      console.error('Error getting admin group:', error);
      return null;
    }
  }

  async findAll(
    id: string,
    requestingUser?: { sub: string; role: string },
  ): Promise<Payment | null> {
    return await this.paymentRepository.findById(id);
  }
  /**
   * Crea un pago. Si no se pasa amount, toma el monthly_fee del club.
   */
  async create(
    createPaymentDto: CreatePaymentDto,
    requestingUser?: { sub: string; role: string },
  ): Promise<Payment> {
    const { athleteId, clubId, amount, month, note } = createPaymentDto;

    // Buscar club para obtener monthly_fee
    const club = await this.clubModel.findById(clubId);
    if (!club) throw new NotFoundException('Club no encontrado');

    // Si es ADMIN, asignar automáticamente su groupId
    if (requestingUser && requestingUser.role === Roles.ADMIN) {
      const adminGroup = await this.getAdminGroup(requestingUser.sub);
      if (adminGroup) {
        createPaymentDto.groupId = adminGroup.toString();
      }
    }

    // validar month (si se provee) -> no puede ser anterior al mes actual
    if (month) {
      // formato ya validado por DTO (YYYY-MM) pero double-check
      const monthRegex = /^\d{4}-(0[1-9]|1[0-2])$/;
      if (!monthRegex.test(month)) {
        throw new BadRequestException(
          'Formato de month inválido, esperado YYYY-MM',
        );
      }
      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${String(
        now.getMonth() + 1,
      ).padStart(2, '0')}`;
      if (month < currentMonth) {
        throw new BadRequestException(
          'No se puede registrar un pago para un mes anterior al actual',
        );
      }
      // Verificar que no exista ya un pago para el mismo athlete+club+month
      const existing = await this.paymentRepository.findByAthleteClubMonths(
        athleteId,
        clubId,
        [month],
      );
      if (existing && existing.length > 0) {
        throw new BadRequestException(
          'Ya existe un pago registrado para el mes indicado',
        );
      }
    }

    const finalAmount =
      typeof amount === 'number' && !isNaN(amount)
        ? amount
        : (club as any).monthly_pay || 0;

    const payment = await this.paymentRepository.create({
      athlete: athleteId,
      club: clubId,
      amount: finalAmount,
      month: month,
      note: note,
      groupId: createPaymentDto.groupId,
    } as any);

    return payment;
  }

  /**
   * Obtiene los pagos para un atleta y club en una lista de meses dada
   */
  async getPaidMonths(
    athleteId: string,
    clubId: string,
    months: string[],
  ): Promise<Payment[]> {
    return await this.paymentRepository.findByAthleteClubMonths(
      athleteId,
      clubId,
      months,
    );
  }
}
