import { Module } from '@nestjs/common';
import { ManagementGroupsModule } from './management-groups/management-groups.module';

@Module({
  imports: [ManagementGroupsModule],
  exports: [ManagementGroupsModule],
})
export class AdminModule {}
