/**
 * ClubsModule - Módulo de Clubs
 * Gestiona la creación y administración de clubs
 */

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Club, ClubSchema } from './schemas/club.schema';
import { ClubsController } from './clubs.controller';
import { ClubsService } from './clubs.service';
import { ClubRepository } from './repository/club.repository';
import { AssignmentsModule } from '../assignments/assignments.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Club.name, schema: ClubSchema }]),
    AssignmentsModule,
  ],
  controllers: [ClubsController],
  providers: [
    ClubsService,
    ClubRepository,
    { provide: 'ClubRepository', useClass: ClubRepository },
  ],
  exports: [ClubsService, ClubRepository],
})
export class ClubsModule {}
