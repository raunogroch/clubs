import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './schemas/user.schema';
import { UserRepository } from './repository/user.repository';
import { UserValidatorService } from './user-validator.service';
import { UserPasswordService } from './user-password.service';
import { AssignmentsModule } from '../assignments/assignments.module';
import { Group, GroupSchema } from '../clubs/schemas/group.schema';
import { RegistrationsModule } from '../registrations/registrations.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Group.name, schema: GroupSchema },
    ]),
    AssignmentsModule,
    RegistrationsModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    { provide: 'UserRepository', useClass: UserRepository },
    UserValidatorService,
    UserPasswordService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
