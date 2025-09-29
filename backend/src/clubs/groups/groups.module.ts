import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Group, GroupSchema } from './schema/group.schema';
import { GroupsUserHelperService } from './groups-user-helper.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Group.name,
        schema: GroupSchema,
      },
    ]),
  ],
  controllers: [GroupsController],
  providers: [GroupsService, GroupsUserHelperService],
  exports: [GroupsUserHelperService],
})
export class GroupsModule {}
