import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Delete,
  Put,
  UseGuards,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RegistrationsService } from './registrations.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { UpdateRegistrationDto } from './dto/update-registration.dto';

@Controller('registrations')
@UseGuards(JwtAuthGuard)
export class RegistrationsController {
  constructor(private registrationsService: RegistrationsService) {}

  @Post()
  async create(@Body() body: CreateRegistrationDto) {
    return this.registrationsService.createRegistration(body);
  }

  @Get('debug/all')
  @UseGuards(JwtAuthGuard)
  async debugAll() {
    try {
      const registrations = await this.registrationsService.findByGroups([]);
      return { total: registrations.length, data: registrations };
    } catch (error: any) {
      return { error: error.message, registrations: [] };
    }
  }

  @Get('assignment/:assignmentId')
  async getByAssignment(
    @Param('assignmentId') assignmentId: string,
    @Query('registration_pay') registrationPay?: string,
  ) {
    if (registrationPay === 'false') {
      // Retornar solo sin pagar (donde registration_pay es null)
      const registrations =
        await this.registrationsService.findByAssignment(assignmentId);
      return registrations.filter((reg) => !reg.registration_pay);
    }
    // Retornar todos
    return this.registrationsService.findByAssignment(assignmentId);
  }

  @Get('group/:groupId')
  async getByGroup(@Param('groupId') groupId: string) {
    return this.registrationsService.findByGroup(groupId);
  }

  @Get('group/:groupId/paid-athletes')
  async getPaidAthletesByGroup(@Param('groupId') groupId: string) {
    return this.registrationsService.getPaidAthletesByGroup(groupId);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.registrationsService.findById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UpdateRegistrationDto) {
    return this.registrationsService.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.registrationsService.delete(id);
  }
}
