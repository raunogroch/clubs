import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post()
  async create(@Body() body: CreatePaymentDto) {
    return this.paymentsService.create(body);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.paymentsService.findById(id);
  }

  @Get('athlete/:athleteId')
  async getByAthlete(@Param('athleteId') athleteId: string) {
    return this.paymentsService.findByAthlete(athleteId);
  }

  @Get('group/:groupId')
  async getByGroup(@Param('groupId') groupId: string) {
    return this.paymentsService.findByGroup(groupId);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UpdatePaymentDto) {
    return this.paymentsService.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.paymentsService.delete(id);
  }
}
