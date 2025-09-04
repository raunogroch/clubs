import { Module } from '@nestjs/common';
import { ClubsService } from './clubs.service';
import { ClubsController } from './clubs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Club, ClubSchema } from './schema/club.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { ClubRepository } from './repository/club.repository';
import { ImageService } from 'src/utils';
import { ClubValidatorService } from './club-validator.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Club.name, schema: ClubSchema },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [ClubsController],
  providers: [
    ClubsService,
    { provide: 'ClubRepository', useClass: ClubRepository },
    ClubValidatorService,
    ImageService,
  ],
  exports: [ClubsService],
})
export class ClubsModule {}
