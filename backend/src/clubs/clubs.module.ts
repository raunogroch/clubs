/**
 * ClubsModule - Módulo de Clubs
 * Gestiona la creación y administración de clubs y grupos
 */

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Club, ClubSchema } from './schemas/club.schema';
import { Group, GroupSchema } from './schemas/group.schema';
import { Event, EventSchema } from './schemas/event.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { ClubsController } from './clubs.controller';
import { ClubsService } from './clubs.service';
import { ClubRepository } from './repository/club.repository';
import { GroupRepository } from './repository/group.repository';
import { EventRepository } from './repository/event.repository';
import { GroupsService } from './groups/groups.service';
import { GroupsController } from './groups/groups.controller';
import { EventsService } from './groups/events.service';
import { EventsController } from './groups/events.controller';
import { AssignmentsModule } from '../assignments/assignments.module';
import { SportsModule } from '../sports/sports.module';
import { RegistrationsModule } from '../registrations/registrations.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Club.name, schema: ClubSchema },
      { name: Group.name, schema: GroupSchema },
      { name: Event.name, schema: EventSchema },
      { name: User.name, schema: UserSchema },
    ]),
    AssignmentsModule,
    SportsModule,
    RegistrationsModule,
  ],
  controllers: [ClubsController, GroupsController, EventsController],
  providers: [
    ClubsService,
    ClubRepository,
    GroupsService,
    GroupRepository,
    EventsService,
    EventRepository,
    { provide: 'ClubRepository', useClass: ClubRepository },
    { provide: 'GroupRepository', useClass: GroupRepository },
    { provide: 'EventRepository', useClass: EventRepository },
  ],
  exports: [
    ClubsService,
    ClubRepository,
    GroupsService,
    GroupRepository,
    EventsService,
    EventRepository,
  ],
})
export class ClubsModule {}
