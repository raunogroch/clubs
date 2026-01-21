/**
 * ClubsModule - Módulo de Clubs
 * Gestiona la creación y administración de clubs y grupos
 */

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Club, ClubSchema } from './schemas/club.schema';
import { Group, GroupSchema } from './schemas/group.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { ClubsController } from './clubs.controller';
import { ClubsService } from './clubs.service';
import { ClubRepository } from './repository/club.repository';
import { GroupRepository } from './repository/group.repository';
import { GroupsService } from './groups/groups.service';
import { GroupsController } from './groups/groups.controller';
import { AssignmentsModule } from '../assignments/assignments.module';
import { SportsModule } from '../sports/sports.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Club.name, schema: ClubSchema },
      { name: Group.name, schema: GroupSchema },
      { name: User.name, schema: UserSchema },
    ]),
    AssignmentsModule,
    SportsModule,
  ],
  controllers: [ClubsController, GroupsController],
  providers: [
    ClubsService,
    ClubRepository,
    GroupsService,
    GroupRepository,
    { provide: 'ClubRepository', useClass: ClubRepository },
    { provide: 'GroupRepository', useClass: GroupRepository },
  ],
  exports: [ClubsService, ClubRepository, GroupsService, GroupRepository],
})
export class ClubsModule {}
