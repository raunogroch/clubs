import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Registration,
  RegistrationSchema,
} from './schemas/registration.schema';
import { RegistrationsController } from './registrations.controller';
import { RegistrationsService } from './registrations.service';
import { RegistrationsRepository } from './registrations.repository';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Registration.name, schema: RegistrationSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [RegistrationsController],
  providers: [RegistrationsService, RegistrationsRepository],
  exports: [RegistrationsService, RegistrationsRepository],
})
export class RegistrationsModule {}
