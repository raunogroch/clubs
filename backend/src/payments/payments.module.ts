import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './schemas/payment.schema';
import { Club, ClubSchema } from 'src/clubs/schema/club.schema';
import { PaymentRepository } from './repository/payment.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Payment.name, schema: PaymentSchema },
      { name: Club.name, schema: ClubSchema },
    ]),
  ],
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    { provide: 'PaymentRepository', useClass: PaymentRepository },
    PaymentRepository,
  ],
  exports: [PaymentsService],
})
export class PaymentsModule {}
