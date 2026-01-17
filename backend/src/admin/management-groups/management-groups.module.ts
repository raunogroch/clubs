import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ManagementGroupsService } from './management-groups.service';
import { ManagementGroupsController } from './management-groups.controller';
import { ManagementGroup, ManagementGroupSchema } from './schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ManagementGroup.name,
        schema: ManagementGroupSchema,
      },
    ]),
  ],
  controllers: [ManagementGroupsController],
  providers: [ManagementGroupsService],
  exports: [ManagementGroupsService],
})
export class ManagementGroupsModule {}
