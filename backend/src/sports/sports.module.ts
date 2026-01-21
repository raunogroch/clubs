import { Module } from '@nestjs/common';
import { SportsService } from './sports.service';
import { SportsController } from './sports.controller';
import { Sport, SportsSchema } from './schemas/sport.schemas';
import { MongooseModule } from '@nestjs/mongoose';
import { SportRepository } from './repository/sport.repository';
import { SportValidatorService } from './sport-validator.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Sport.name, schema: SportsSchema }]),
  ],
  controllers: [SportsController],
  providers: [
    SportsService,
    { provide: 'SportRepository', useClass: SportRepository },
    SportValidatorService,
  ],
  exports: [
    SportsService,
    { provide: 'SportRepository', useClass: SportRepository },
  ],
})
export class SportsModule {}
