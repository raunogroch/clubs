import { Module } from '@nestjs/common';
import { SportsService } from './sports.service';
import { SportsController } from './sports.controller';
import { Sport, SportsSchema } from './schemas/sport.schemas';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Sport.name, schema: SportsSchema }]),
  ],
  controllers: [SportsController],
  providers: [SportsService],
})
export class SportsModule {}
