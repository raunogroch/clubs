import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Delete,
  Put,
  UseGuards,
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

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.registrationsService.findById(id);
  }

  @Get('group/:groupId')
  async getByGroup(@Param('groupId') groupId: string) {
    return this.registrationsService.findByGroup(groupId);
  }

  @Get('debug/all')
  async debugAll() {
    try {
      const registrations = await this.registrationsService.findByGroups([]);
      return { total: registrations.length, data: registrations };
    } catch (error: any) {
      return { error: error.message, registrations: [] };
    }
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
