import { Module } from '@nestjs/common';
import { SportsService } from './sports.service';
import { SportsController } from './sports.controller';
import { Sport, SportsSchema } from './schemas/sport.schemas';
import { MongooseModule } from '@nestjs/mongoose';
import { SportRepository } from './repository/sport.repository';
import { SportValidatorService } from './sport-validator.service';
import { User, UserSchema } from 'src/users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Sport.name, schema: SportsSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [SportsController],
  providers: [
    SportsService,
    { provide: 'SportRepository', useClass: SportRepository },
    SportValidatorService,
  ],
})
export class SportsModule {}
