import { Module } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { SchedulesController } from './schedules.controller';
import { Schedule, ScheduleSchema } from './schema/schedule.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleRepository } from './repository/schedule.repository';
import { ScheduleValidatorService } from './schedule-validator.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Schedule.name, schema: ScheduleSchema },
    ]),
  ],
  controllers: [SchedulesController],
  providers: [
    SchedulesService,
    { provide: 'ScheduleRepository', useClass: ScheduleRepository },
    ScheduleValidatorService,
  ],
})
export class SchedulesModule {}
