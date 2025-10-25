import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}
  /**
   * Endpoint para obtener estado de pagos en una lista de meses
   * Query params: athleteId, clubId, months (comma separated YYYY-MM)
   */
  @Get('/status')
  async status(@Query() query: any) {
    const athleteId = query.athleteId || query.athlete || '';
    const clubId = query.clubId || query.club || '';
    const monthsParam = query.months || query.month || '';
    const months = monthsParam ? String(monthsParam).split(',') : [];
    if (!athleteId || !clubId) {
      throw new BadRequestException('athleteId and clubId are required');
    }
    return this.paymentsService.getPaidMonths(athleteId, clubId, months);
  }

  @Get('/:id')
  async findAll(@Param('id') id: string) {
    // Placeholder for future implementation
    return this.paymentsService.findAll(id);
  }

  @Post()
  async create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }
}
