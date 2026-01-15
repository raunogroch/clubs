import { Module } from '@nestjs/common';
import { ClubsModule } from '../clubs/clubs.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AthletesController } from './controllers/athletes.controller';
import { ParentsController } from './controllers/parents.controller';
import { CoachesController } from './controllers/coaches.controller';
import { AssistantsController } from './controllers/assistants.controller';
import { AdminsController } from './controllers/admins.controller';
import { SuperadminsController } from './controllers/superadmins.controller';
import { User, UserSchema } from './schemas/user.schema';
import { UserRepository } from './repository/user.repository';
import { UserValidatorService } from './user-validator.service';
import { ImageService } from '../utils';
import { UserPasswordService } from './user-password.service';
import { GroupsModule } from 'src/clubs/groups/groups.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ClubsModule,
    GroupsModule,
  ],
  controllers: [
    UsersController,
    AthletesController,
    ParentsController,
    CoachesController,
    AssistantsController,
    AdminsController,
    SuperadminsController,
  ],
  providers: [
    UsersService,
    { provide: 'UserRepository', useClass: UserRepository },
    UserValidatorService,
    ImageService,
    UserPasswordService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
